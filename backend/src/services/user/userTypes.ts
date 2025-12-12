/**
 * @summary
 * Type definitions for User authentication and management.
 *
 * @module services/user/userTypes
 */

export type UserType = 'cliente' | 'profissional' | 'administrador';
export type UserStatus = 'ativo' | 'inativo' | 'pendente' | 'bloqueado' | 'desativado';
export type AuthMethod = 'direto' | 'google' | 'facebook' | 'apple';
export type LogoutType = 'atual' | 'todos';

export interface UserSession {
  sessao_id: string;
  id_usuario: string;
  tipo_usuario: UserType;
  data_login: string;
  ultimo_acesso: string;
  ip_acesso: string;
  dispositivo_acesso: string;
  manter_conectado: boolean;
  token_acesso: string;
  ativo: boolean;
}

export interface UserLoginAttempt {
  id_usuario: string;
  tentativas: number;
  data_ultimo_erro: string;
  bloqueado_ate: string | null;
}

export interface PasswordRecoveryToken {
  id_usuario: string;
  token: string;
  data_solicitacao: string;
  data_expiracao: string;
  usado: boolean;
}

export interface UserPasswordHistory {
  id_usuario: string;
  senha_hash: string;
  data_criacao: string;
}
