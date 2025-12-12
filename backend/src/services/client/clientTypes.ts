/**
 * @summary
 * Type definitions for Client entity.
 *
 * @module services/client/clientTypes
 */

export type ClientStatus = 'ativo' | 'inativo' | 'pendente' | 'bloqueado' | 'desativado';
export type RegistrationMethod = 'direto' | 'google' | 'facebook' | 'apple';

export interface ClientEntity {
  id: number;
  nome_completo: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;
  data_nascimento: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  foto_perfil: string | null;
  termos_aceitos: boolean;
  data_cadastro: string;
  status: ClientStatus;
  metodo_cadastro: RegistrationMethod;
  id_externo: string | null;
  autenticacao_dois_fatores: boolean;
  telefone_verificado: boolean;
  motivo_desativacao: string | null;
  data_desativacao: string | null;
}
