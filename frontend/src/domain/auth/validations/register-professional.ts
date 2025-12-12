import { z } from 'zod';

const metodosCadastro = ['direto', 'google', 'facebook', 'apple'] as const;

export const registerProfessionalSchema = z.object({
  nome_completo: z
    .string('Nome completo é obrigatório')
    .min(5, 'Nome deve ter no mínimo 5 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z.string('Email é obrigatório').email('Email inválido'),
  senha: z
    .string('Senha é obrigatória')
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'Senha deve conter pelo menos um caractere especial'),
  cpf: z
    .string('CPF é obrigatório')
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido. Formato: 000.000.000-00'),
  telefone: z
    .string('Telefone é obrigatório')
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido. Formato: (00) 00000-0000'),
  data_nascimento: z.string('Data de nascimento é obrigatória'),
  cep: z.string('CEP é obrigatório').regex(/^\d{5}-\d{3}$/, 'CEP inválido. Formato: 00000-000'),
  endereco: z
    .string('Endereço é obrigatório')
    .min(5, 'Endereço deve ter no mínimo 5 caracteres')
    .max(100, 'Endereço deve ter no máximo 100 caracteres'),
  numero: z.string('Número é obrigatório').max(10, 'Número deve ter no máximo 10 caracteres'),
  complemento: z.string().max(50, 'Complemento deve ter no máximo 50 caracteres').optional(),
  bairro: z.string('Bairro é obrigatório').max(50, 'Bairro deve ter no máximo 50 caracteres'),
  cidade: z.string('Cidade é obrigatória').max(50, 'Cidade deve ter no máximo 50 caracteres'),
  estado: z
    .string('Estado é obrigatório')
    .length(2, 'Estado deve ter 2 caracteres')
    .regex(/^[A-Z]{2}$/, 'Estado inválido'),
  foto_perfil: z.string('Foto de perfil é obrigatória'),
  foto_documento: z.string('Foto do documento é obrigatória'),
  comprovante_residencia: z.string('Comprovante de residência é obrigatório'),
  antecedentes_criminais: z.string('Atestado de antecedentes criminais é obrigatório'),
  experiencia: z
    .string('Experiência profissional é obrigatória')
    .min(50, 'Descreva sua experiência com mais detalhes (mínimo 50 caracteres)')
    .max(1000, 'Experiência deve ter no máximo 1000 caracteres'),
  disponibilidade: z.array(z.any()).min(1, 'Informe pelo menos um dia de disponibilidade'),
  raio_atuacao: z
    .number('Raio de atuação é obrigatório')
    .min(1, 'Raio de atuação deve ser no mínimo 1 km')
    .max(50, 'Raio de atuação deve ser no máximo 50 km'),
  dados_bancarios: z.object({
    banco: z.string('Código do banco é obrigatório'),
    agencia: z.string('Agência é obrigatória'),
    conta: z.string('Conta é obrigatória'),
  }),
  termos_aceitos: z.boolean().refine((val) => val === true, 'Você deve aceitar os termos'),
  metodo_cadastro: z.enum(metodosCadastro).default('direto'),
  id_externo: z.string().optional(),
  autenticacao_dois_fatores: z.boolean().default(false),
});

export type RegisterProfessionalFormInput = z.input<typeof registerProfessionalSchema>;
export type RegisterProfessionalFormOutput = z.output<typeof registerProfessionalSchema>;
