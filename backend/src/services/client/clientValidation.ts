/**
 * @summary
 * Validation schemas for Client registration.
 *
 * @module services/client/clientValidation
 */

import { z } from 'zod';

export const clientRegisterSchema = z.object({
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
  foto_perfil: z.string().nullable().optional(),
  termos_aceitos: z
    .boolean()
    .refine((val) => val === true, { message: 'Termos devem ser aceitos' }),
  metodo_cadastro: z.enum(['direto', 'google', 'facebook', 'apple']).optional().default('direto'),
  id_externo: z.string().nullable().optional(),
  autenticacao_dois_fatores: z.boolean().optional().default(false),
});

export type ClientRegisterInput = z.infer<typeof clientRegisterSchema>;
