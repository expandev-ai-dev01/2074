import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import type {
  RecoverPasswordRequestFormOutput,
  RecoverPasswordResetFormOutput,
} from '../../validations';
import { toast } from 'sonner';

export const useRecoverPasswordRequest = () => {
  const { mutateAsync: requestRecovery, isPending } = useMutation({
    mutationFn: (data: RecoverPasswordRequestFormOutput) =>
      authService.recoverPasswordRequest(data),
    onSuccess: () => {
      toast.success('Email de recuperação enviado com sucesso!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Erro ao solicitar recuperação';
      toast.error(message);
    },
  });

  return { requestRecovery, isPending };
};

export const useRecoverPasswordReset = () => {
  const { mutateAsync: resetPassword, isPending } = useMutation({
    mutationFn: (data: RecoverPasswordResetFormOutput) => authService.recoverPasswordReset(data),
    onSuccess: () => {
      toast.success('Senha redefinida com sucesso!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Erro ao redefinir senha';
      toast.error(message);
    },
  });

  return { resetPassword, isPending };
};
