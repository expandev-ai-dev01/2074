/**
 * @summary
 * In-memory store for login attempts tracking.
 *
 * @module instances/user/userLoginAttemptStore
 */

import { UserLoginAttempt } from '@/services/user/userTypes';

class UserLoginAttemptStore {
  private attempts: Map<string, UserLoginAttempt> = new Map();

  get(userId: string): UserLoginAttempt | undefined {
    return this.attempts.get(userId);
  }

  incrementAttempts(userId: string): void {
    const existing = this.attempts.get(userId);
    if (existing) {
      existing.tentativas += 1;
      existing.data_ultimo_erro = new Date().toISOString();
    } else {
      this.attempts.set(userId, {
        id_usuario: userId,
        tentativas: 1,
        data_ultimo_erro: new Date().toISOString(),
        bloqueado_ate: null,
      });
    }
  }

  resetAttempts(userId: string): void {
    this.attempts.delete(userId);
  }

  blockUser(userId: string, blockedUntil: string): void {
    const existing = this.attempts.get(userId);
    if (existing) {
      existing.bloqueado_ate = blockedUntil;
    }
  }

  clear(): void {
    this.attempts.clear();
  }
}

export const userLoginAttemptStore = new UserLoginAttemptStore();
