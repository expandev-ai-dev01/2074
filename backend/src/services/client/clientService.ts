/**
 * @summary
 * Business logic for Client registration and management.
 *
 * @module services/client/clientService
 */

import { ServiceError } from '@/utils';
import { clientStore } from '@/instances/client';
import { clientRegisterSchema } from './clientValidation';
import { ClientEntity } from './clientTypes';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function calculateAge(birthDate: string): number {
  const [day, month, year] = birthDate.split('/').map(Number);
  const birth = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export async function clientRegister(body: unknown): Promise<any> {
  const validation = clientRegisterSchema.safeParse(body);
  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Dados inválidos', 400, validation.error.errors);
  }

  const params = validation.data;

  if (clientStore.getByEmail(params.email)) {
    throw new ServiceError('EMAIL_EXISTS', 'Este email já está cadastrado no sistema', 409);
  }

  if (clientStore.getByCpf(params.cpf)) {
    throw new ServiceError('CPF_EXISTS', 'Este CPF já está cadastrado no sistema', 409);
  }

  const age = calculateAge(params.data_nascimento);
  if (age < 18) {
    throw new ServiceError(
      'UNDERAGE',
      'É necessário ter pelo menos 18 anos para se cadastrar',
      400
    );
  }

  const now = new Date().toISOString();
  const id = clientStore.getNextId();

  const newClient: ClientEntity = {
    id,
    nome_completo: params.nome_completo,
    email: params.email,
    senha: hashPassword(params.senha),
    cpf: params.cpf,
    telefone: params.telefone,
    data_nascimento: params.data_nascimento,
    cep: params.cep,
    endereco: params.endereco,
    numero: params.numero,
    complemento: params.complemento || null,
    bairro: params.bairro,
    cidade: params.cidade,
    estado: params.estado,
    foto_perfil: params.foto_perfil || null,
    termos_aceitos: params.termos_aceitos,
    data_cadastro: now,
    status: 'pendente',
    metodo_cadastro: params.metodo_cadastro || 'direto',
    id_externo: params.id_externo || null,
    autenticacao_dois_fatores: params.autenticacao_dois_fatores || false,
    telefone_verificado: false,
    motivo_desativacao: null,
    data_desativacao: null,
  };

  clientStore.add(newClient);

  return {
    id: newClient.id,
    email: newClient.email,
    status: newClient.status,
    message: 'Cadastro realizado com sucesso. Verifique seu email para confirmar o cadastro.',
  };
}
