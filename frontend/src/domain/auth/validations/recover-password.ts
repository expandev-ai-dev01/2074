import { z } from 'zod';

const tipoUsuario = ['cliente', 'profissional', 'administrador'] as const;

export const recoverPasswordRequestSchema = z.object({
  email: z.string('Email é obrigatório').email('Email inválido'),
  tipo_usuario: z.enum(tipoUsuario, 'Selecione o tipo de usuário'),
});

export const recoverPasswordResetSchema = z
  .object({
    token_recuperacao: z.string('Token de recuperação é obrigatório'),
    nova_senha: z
      .string('Nova senha é obrigatória')
      .min(8, 'Senha deve ter no mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
      .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
      .regex(/[^A-Za-z0-9]/, 'Senha deve conter pelo menos um caractere especial'),
    confirmacao_senha: z.string('Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.nova_senha === data.confirmacao_senha, {
    message: 'As senhas não conferem',
    path: ['confirmacao_senha'],
  });

export type RecoverPasswordRequestFormInput = z.input<typeof recoverPasswordRequestSchema>;
export type RecoverPasswordRequestFormOutput = z.output<typeof recoverPasswordRequestSchema>;
export type RecoverPasswordResetFormInput = z.input<typeof recoverPasswordResetSchema>;
export type RecoverPasswordResetFormOutput = z.output<typeof recoverPasswordResetSchema>;
