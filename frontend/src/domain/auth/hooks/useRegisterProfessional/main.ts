import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import type { RegisterProfessionalFormOutput } from '../../validations';
import { toast } from 'sonner';

export const useRegisterProfessional = () => {
  const { mutateAsync: register, isPending } = useMutation({
    mutationFn: (data: RegisterProfessionalFormOutput) => authService.registerProfessional(data),
    onSuccess: () => {
      toast.success('Cadastro realizado com sucesso! Aguarde a validação dos documentos.');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Erro ao realizar cadastro';
      toast.error(message);
    },
  });

  return { register, isPending };
};
