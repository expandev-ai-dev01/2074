/**
 * @summary
 * Type definitions for Professional entity.
 *
 * @module services/professional/professionalTypes
 */

export type ProfessionalStatus =
  | 'pendente_validacao'
  | 'aprovado'
  | 'reprovado'
  | 'ativo'
  | 'inativo'
  | 'bloqueado'
  | 'desativado';
export type RegistrationMethod = 'direto' | 'google' | 'facebook' | 'apple';

export interface BankDetails {
  banco: string;
  agencia: string;
  conta: string;
}

export interface Availability {
  dia: string;
  horario_inicio: string;
  horario_fim: string;
}

export interface ProfessionalEntity {
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
  foto_perfil: string;
  foto_documento: string;
  comprovante_residencia: string;
  antecedentes_criminais: string;
  experiencia: string;
  disponibilidade: Availability[];
  raio_atuacao: number;
  dados_bancarios: BankDetails;
  termos_aceitos: boolean;
  data_cadastro: string;
  status: ProfessionalStatus;
  metodo_cadastro: RegistrationMethod;
  id_externo: string | null;
  autenticacao_dois_fatores: boolean;
  telefone_verificado: boolean;
  motivo_desativacao: string | null;
  data_desativacao: string | null;
}
