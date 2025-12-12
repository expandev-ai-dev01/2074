/**
 * @summary
 * Business logic for User authentication and session management.
 * Handles login, logout, password recovery with in-memory storage.
 *
 * @module services/user/userService
 */

import { ServiceError } from '@/utils';
import {
  userSessionStore,
  userLoginAttemptStore,
  passwordRecoveryStore,
  passwordHistoryStore,
} from '@/instances/user';
import { clientStore } from '@/instances/client';
import { professionalStore } from '@/instances/professional';
import {
  loginSchema,
  logoutSchema,
  passwordRecoveryRequestSchema,
  passwordRecoveryResetSchema,
} from './userValidation';
import { UserSession, UserType } from './userTypes';
import crypto from 'crypto';

const MAX_LOGIN_ATTEMPTS = 5;
const BLOCK_DURATION_MINUTES = 30;
const TOKEN_EXPIRATION_HOURS = 1;
const MAX_RECOVERY_REQUESTS_PER_DAY = 3;
const PASSWORD_HISTORY_LIMIT = 5;

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function generateSessionId(): string {
  return crypto.randomUUID();
}

function checkPasswordInHistory(userId: string, newPasswordHash: string): boolean {
  const history = passwordHistoryStore.getByUserId(userId);
  return history.some((h) => h.senha_hash === newPasswordHash);
}

function addPasswordToHistory(userId: string, passwordHash: string): void {
  const history = passwordHistoryStore.getByUserId(userId);
  if (history.length >= PASSWORD_HISTORY_LIMIT) {
    passwordHistoryStore.removeOldest(userId);
  }
  passwordHistoryStore.add({
    id_usuario: userId,
    senha_hash: passwordHash,
    data_criacao: new Date().toISOString(),
  });
}

export async function userLogin(body: unknown): Promise<any> {
  const validation = loginSchema.safeParse(body);
  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Dados inválidos', 400, validation.error.errors);
  }

  const { email, senha, tipo_usuario, manter_conectado, codigo_2fa, metodo_autenticacao } =
    validation.data;

  let user: any;
  let userId: string;

  if (tipo_usuario === 'cliente') {
    user = clientStore.getByEmail(email);
    userId = user ? `cliente_${user.id}` : '';
  } else if (tipo_usuario === 'profissional') {
    user = professionalStore.getByEmail(email);
    userId = user ? `profissional_${user.id}` : '';
  } else {
    throw new ServiceError('VALIDATION_ERROR', 'Tipo de usuário não suportado', 400);
  }

  if (!user) {
    throw new ServiceError('INVALID_CREDENTIALS', 'Email ou senha incorretos', 401);
  }

  const attempt = userLoginAttemptStore.get(userId);
  if (attempt && attempt.bloqueado_ate) {
    const now = new Date();
    const blockedUntil = new Date(attempt.bloqueado_ate);
    if (now < blockedUntil) {
      throw new ServiceError(
        'ACCOUNT_TEMPORARILY_BLOCKED',
        'Conta temporariamente bloqueada devido a múltiplas tentativas de login. Tente novamente em 30 minutos',
        403
      );
    }
  }

  if (metodo_autenticacao === 'direto') {
    const passwordHash = hashPassword(senha);
    if (user.senha !== passwordHash) {
      userLoginAttemptStore.incrementAttempts(userId);
      const currentAttempt = userLoginAttemptStore.get(userId);
      if (currentAttempt && currentAttempt.tentativas >= MAX_LOGIN_ATTEMPTS) {
        const blockUntil = new Date();
        blockUntil.setMinutes(blockUntil.getMinutes() + BLOCK_DURATION_MINUTES);
        userLoginAttemptStore.blockUser(userId, blockUntil.toISOString());
        throw new ServiceError(
          'ACCOUNT_TEMPORARILY_BLOCKED',
          'Conta bloqueada por 30 minutos devido a múltiplas tentativas incorretas',
          403
        );
      }
      throw new ServiceError('INVALID_CREDENTIALS', 'Email ou senha incorretos', 401);
    }
  }

  if (user.status === 'inativo') {
    throw new ServiceError(
      'ACCOUNT_INACTIVE',
      'Sua conta está inativa. Entre em contato com o suporte',
      403
    );
  }
  if (user.status === 'bloqueado') {
    throw new ServiceError(
      'ACCOUNT_BLOCKED',
      'Sua conta foi bloqueada. Entre em contato com o suporte',
      403
    );
  }
  if (tipo_usuario === 'profissional' && user.status === 'pendente_validacao') {
    throw new ServiceError(
      'ACCOUNT_PENDING',
      'Seu cadastro ainda está em análise. Você receberá um email quando for aprovado',
      403
    );
  }
  if (tipo_usuario === 'profissional' && user.status === 'reprovado') {
    throw new ServiceError(
      'ACCOUNT_REJECTED',
      'Seu cadastro não foi aprovado. Entre em contato com o suporte para mais informações',
      403
    );
  }

  if (user.autenticacao_dois_fatores && !codigo_2fa) {
    throw new ServiceError('2FA_REQUIRED', 'Código de verificação 2FA necessário', 403);
  }

  if (user.autenticacao_dois_fatores && codigo_2fa) {
    // Simplified 2FA validation (in production, validate against TOTP or SMS code)
    if (codigo_2fa.length !== 6) {
      throw new ServiceError('INVALID_2FA_CODE', 'Código de verificação inválido', 401);
    }
  }

  userLoginAttemptStore.resetAttempts(userId);

  const sessionId = generateSessionId();
  const token = generateToken();
  const now = new Date().toISOString();

  const session: UserSession = {
    sessao_id: sessionId,
    id_usuario: userId,
    tipo_usuario,
    data_login: now,
    ultimo_acesso: now,
    ip_acesso: 'unknown',
    dispositivo_acesso: 'unknown',
    manter_conectado: manter_conectado || false,
    token_acesso: token,
    ativo: true,
  };

  if (!manter_conectado) {
    userSessionStore.terminateAllSessions(userId);
  }

  userSessionStore.add(session);

  return {
    token_acesso: token,
    sessao_id: sessionId,
    tipo_usuario,
    usuario: {
      id: user.id,
      nome_completo: user.nome_completo,
      email: user.email,
      foto_perfil: user.foto_perfil || null,
    },
    ultimo_acesso: now,
  };
}

export async function userLogout(body: unknown): Promise<{ message: string }> {
  const validation = logoutSchema.safeParse(body);
  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Dados inválidos', 400, validation.error.errors);
  }

  const { id_usuario, sessao_id, tipo_logout } = validation.data;

  const session = userSessionStore.getById(sessao_id);
  if (!session || session.id_usuario !== id_usuario) {
    throw new ServiceError('INVALID_SESSION', 'Sessão inválida', 401);
  }

  if (tipo_logout === 'todos') {
    userSessionStore.terminateAllSessions(id_usuario);
  } else {
    userSessionStore.terminateSession(sessao_id);
  }

  return { message: 'Logout realizado com sucesso' };
}

export async function passwordRecoveryRequest(body: unknown): Promise<{ message: string }> {
  const validation = passwordRecoveryRequestSchema.safeParse(body);
  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Dados inválidos', 400, validation.error.errors);
  }

  const { email, tipo_usuario } = validation.data;

  let user: any;
  let userId: string;

  if (tipo_usuario === 'cliente') {
    user = clientStore.getByEmail(email);
    userId = user ? `cliente_${user.id}` : '';
  } else if (tipo_usuario === 'profissional') {
    user = professionalStore.getByEmail(email);
    userId = user ? `profissional_${user.id}` : '';
  } else {
    throw new ServiceError('VALIDATION_ERROR', 'Tipo de usuário não suportado', 400);
  }

  if (!user) {
    return { message: 'Se o email estiver cadastrado, você receberá instruções para recuperação' };
  }

  const recentRequests = passwordRecoveryStore.getRecentRequests(userId, 24);
  if (recentRequests.length >= MAX_RECOVERY_REQUESTS_PER_DAY) {
    throw new ServiceError(
      'REQUEST_LIMIT_EXCEEDED',
      'Você atingiu o limite de solicitações de recuperação. Tente novamente mais tarde',
      429
    );
  }

  passwordRecoveryStore.invalidateAllTokens(userId);

  const token = generateToken();
  const now = new Date();
  const expiration = new Date(now.getTime() + TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000);

  passwordRecoveryStore.add({
    id_usuario: userId,
    token,
    data_solicitacao: now.toISOString(),
    data_expiracao: expiration.toISOString(),
    usado: false,
  });

  return { message: 'Se o email estiver cadastrado, você receberá instruções para recuperação' };
}

export async function passwordRecoveryReset(body: unknown): Promise<{ message: string }> {
  const validation = passwordRecoveryResetSchema.safeParse(body);
  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Dados inválidos', 400, validation.error.errors);
  }

  const { token_recuperacao, nova_senha } = validation.data;

  const recoveryToken = passwordRecoveryStore.getByToken(token_recuperacao);
  if (!recoveryToken || recoveryToken.usado) {
    throw new ServiceError('INVALID_TOKEN', 'Token inválido ou já utilizado', 400);
  }

  const now = new Date();
  const expiration = new Date(recoveryToken.data_expiracao);
  if (now > expiration) {
    throw new ServiceError('EXPIRED_TOKEN', 'Token expirado', 400);
  }

  const newPasswordHash = hashPassword(nova_senha);
  if (checkPasswordInHistory(recoveryToken.id_usuario, newPasswordHash)) {
    throw new ServiceError(
      'PASSWORD_RECENTLY_USED',
      'Por favor, escolha uma senha diferente das últimas utilizadas',
      400
    );
  }

  const [userType, userIdStr] = recoveryToken.id_usuario.split('_');
  const userId = parseInt(userIdStr);

  if (userType === 'cliente') {
    const user = clientStore.getById(userId);
    if (user) {
      addPasswordToHistory(recoveryToken.id_usuario, user.senha);
      clientStore.update(userId, { senha: newPasswordHash });
    }
  } else if (userType === 'profissional') {
    const user = professionalStore.getById(userId);
    if (user) {
      addPasswordToHistory(recoveryToken.id_usuario, user.senha);
      professionalStore.update(userId, { senha: newPasswordHash });
    }
  }

  passwordRecoveryStore.markAsUsed(token_recuperacao);
  userSessionStore.terminateAllSessions(recoveryToken.id_usuario);

  return { message: 'Senha alterada com sucesso' };
}
