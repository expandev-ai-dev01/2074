/**
 * @summary
 * Validation schemas for Professional registration.
 *
 * @module services/professional/professionalValidation
 */

import { z } from 'zod';

const bankDetailsSchema = z.object({
  banco: z.string().min(1),
  agencia: z.string().min(1),
  conta: z.string().min(1),
});

const availabilitySchema = z.object({
  dia: z.string(),
  horario_inicio: z.string(),
  horario_fim: z.string(),
});

export const professionalRegisterSchema = z.object({
  nome_completo: z.string().min(5).max(100),
  email: z.string().email().max(100),
  senha: z
    .string()
    .min(8)
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
  telefone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/),
  data_nascimento: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/),
  cep: z.string().regex(/^\d{5}-\d{3}$/),
  endereco: z.string().min(5).max(100),
  numero: z.string().max(10),
  complemento: z.string().max(50).nullable().optional(),
  bairro: z.string().max(50),
  cidade: z.string().max(50),
  estado: z.string().length(2),
  foto_perfil: z.string(),
  foto_documento: z.string(),
  comprovante_residencia: z.string(),
  antecedentes_criminais: z.string(),
  experiencia: z.string().min(50).max(1000),
  disponibilidade: z.array(availabilitySchema).min(1),
  raio_atuacao: z.number().int().min(1).max(50),
  dados_bancarios: bankDetailsSchema,
  termos_aceitos: z
    .boolean()
    .refine((val) => val === true, { message: 'Termos devem ser aceitos' }),
  metodo_cadastro: z.enum(['direto', 'google', 'facebook', 'apple']).optional().default('direto'),
  id_externo: z.string().nullable().optional(),
  autenticacao_dois_fatores: z.boolean().optional().default(false),
});

export type ProfessionalRegisterInput = z.infer<typeof professionalRegisterSchema>;
