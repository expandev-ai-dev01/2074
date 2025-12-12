import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import type { RegisterClientFormOutput } from '../../validations';
import { toast } from 'sonner';

export const useRegisterClient = () => {
  const { mutateAsync: register, isPending } = useMutation({
    mutationFn: (data: RegisterClientFormOutput) => authService.registerClient(data),
    onSuccess: () => {
      toast.success('Cadastro realizado com sucesso! Verifique seu email.');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Erro ao realizar cadastro';
      toast.error(message);
    },
  });

  return { register, isPending };
};
