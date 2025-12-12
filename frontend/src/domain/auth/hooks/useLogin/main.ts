import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import type { LoginFormOutput } from '../../validations';
import { toast } from 'sonner';

export const useLogin = () => {
  const { mutateAsync: login, isPending } = useMutation({
    mutationFn: (data: LoginFormOutput) => authService.login(data),
    onSuccess: () => {
      toast.success('Login realizado com sucesso!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Erro ao fazer login';
      toast.error(message);
    },
  });

  return { login, isPending };
};
