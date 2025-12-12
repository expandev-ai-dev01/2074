/**
 * @service Authentication Service
 * @domain auth
 * @type REST
 */

import { publicClient } from '@/core/lib/api';
import type {
  LoginFormOutput,
  RegisterClientFormOutput,
  RegisterProfessionalFormOutput,
  RecoverPasswordRequestFormOutput,
  RecoverPasswordResetFormOutput,
} from '../validations';

export interface LoginResponse {
  token_acesso: string;
  sessao_id: string;
  tipo_usuario: string;
  usuario: {
    id: number;
    nome_completo: string;
    email: string;
    foto_perfil: string | null;
  };
  ultimo_acesso: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  status: string;
  message: string;
}

export const authService = {
  async login(credentials: LoginFormOutput): Promise<LoginResponse> {
    const { data } = await publicClient.post('/security/login', credentials);
    if (data.data?.token_acesso) {
      localStorage.setItem('auth_token', data.data.token_acesso);
    }
    return data.data;
  },

  async logout(sessao_id: string, tipo_logout: 'atual' | 'todos' = 'atual'): Promise<void> {
    await publicClient.post('/security/logout', {
      sessao_id,
      tipo_logout,
    });
    localStorage.removeItem('auth_token');
  },

  async registerClient(data: RegisterClientFormOutput): Promise<RegisterResponse> {
    const { data: response } = await publicClient.post('/security/register-client', data);
    return response.data;
  },

  async registerProfessional(data: RegisterProfessionalFormOutput): Promise<RegisterResponse> {
    const { data: response } = await publicClient.post('/security/register-professional', data);
    return response.data;
  },

  async recoverPasswordRequest(
    data: RecoverPasswordRequestFormOutput
  ): Promise<{ message: string }> {
    const { data: response } = await publicClient.post('/security/recover-password', data);
    return response.data;
  },

  async recoverPasswordReset(data: RecoverPasswordResetFormOutput): Promise<{ message: string }> {
    const { data: response } = await publicClient.put('/security/recover-password', data);
    return response.data;
  },
};
