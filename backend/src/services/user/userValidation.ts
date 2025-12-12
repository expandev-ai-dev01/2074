/**
 * @summary
 * Validation schemas for User authentication operations.
 *
 * @module services/user/userValidation
 */

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email().max(100),
  senha: z.string().min(8),
  tipo_usuario: z.enum(['cliente', 'profissional', 'administrador']),
  manter_conectado: z.boolean().optional().default(false),
  codigo_2fa: z.string().length(6).optional(),
  metodo_autenticacao: z
    .enum(['direto', 'google', 'facebook', 'apple'])
    .optional()
    .default('direto'),
  token_acesso_externo: z.string().optional(),
});

export const logoutSchema = z.object({
  id_usuario: z.string(),
  sessao_id: z.string(),
  tipo_logout: z.enum(['atual', 'todos']).optional().default('atual'),
});

export const passwordRecoveryRequestSchema = z.object({
  email: z.string().email().max(100),
  tipo_usuario: z.enum(['cliente', 'profissional', 'administrador']),
});

export const passwordRecoveryResetSchema = z
  .object({
    token_recuperacao: z.string(),
    nova_senha: z
      .string()
      .min(8)
      .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/),
    confirmacao_senha: z.string(),
  })
  .refine((data) => data.nova_senha === data.confirmacao_senha, {
    message: 'Senhas não conferem',
    path: ['confirmacao_senha'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
export type PasswordRecoveryRequestInput = z.infer<typeof passwordRecoveryRequestSchema>;
export type PasswordRecoveryResetInput = z.infer<typeof passwordRecoveryResetSchema>;
