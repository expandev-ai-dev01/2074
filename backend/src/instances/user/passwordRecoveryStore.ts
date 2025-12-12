/**
 * @summary
 * In-memory store for password recovery tokens.
 *
 * @module instances/user/passwordRecoveryStore
 */

import { PasswordRecoveryToken } from '@/services/user/userTypes';

class PasswordRecoveryStore {
  private tokens: PasswordRecoveryToken[] = [];

  add(token: PasswordRecoveryToken): void {
    this.tokens.push(token);
  }

  getByToken(token: string): PasswordRecoveryToken | undefined {
    return this.tokens.find((t) => t.token === token);
  }

  getRecentRequests(userId: string, hours: number): PasswordRecoveryToken[] {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - hours);
    return this.tokens.filter(
      (t) => t.id_usuario === userId && new Date(t.data_solicitacao) > cutoff
    );
  }

  invalidateAllTokens(userId: string): void {
    this.tokens.forEach((t) => {
      if (t.id_usuario === userId) {
        t.usado = true;
      }
    });
  }

  markAsUsed(token: string): void {
    const found = this.tokens.find((t) => t.token === token);
    if (found) {
      found.usado = true;
    }
  }

  clear(): void {
    this.tokens = [];
  }
}

export const passwordRecoveryStore = new PasswordRecoveryStore();
