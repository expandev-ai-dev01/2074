import { z } from 'zod';

const metodoAutenticacao = ['direto', 'google', 'facebook', 'apple'] as const;
const tipoUsuario = ['cliente', 'profissional', 'administrador'] as const;

export const loginSchema = z.object({
  email: z.string('Email é obrigatório').email('Email inválido'),
  senha: z.string('Senha é obrigatória').min(8, 'Senha deve ter no mínimo 8 caracteres'),
  tipo_usuario: z.enum(tipoUsuario, 'Selecione o tipo de usuário'),
  manter_conectado: z.boolean().default(false),
  codigo_2fa: z.string().optional(),
  metodo_autenticacao: z.enum(metodoAutenticacao).default('direto'),
  token_acesso_externo: z.string().optional(),
});

export type LoginFormInput = z.input<typeof loginSchema>;
export type LoginFormOutput = z.output<typeof loginSchema>;
