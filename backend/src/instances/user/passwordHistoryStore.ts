/**
 * @summary
 * In-memory store for password history.
 *
 * @module instances/user/passwordHistoryStore
 */

import { UserPasswordHistory } from '@/services/user/userTypes';

class PasswordHistoryStore {
  private history: UserPasswordHistory[] = [];

  add(record: UserPasswordHistory): void {
    this.history.push(record);
  }

  getByUserId(userId: string): UserPasswordHistory[] {
    return this.history
      .filter((h) => h.id_usuario === userId)
      .sort((a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime())
      .slice(0, 5);
  }

  removeOldest(userId: string): void {
    const userHistory = this.history
      .filter((h) => h.id_usuario === userId)
      .sort((a, b) => new Date(a.data_criacao).getTime() - new Date(b.data_criacao).getTime());

    if (userHistory.length > 0) {
      const oldest = userHistory[0];
      const index = this.history.indexOf(oldest);
      if (index > -1) {
        this.history.splice(index, 1);
      }
    }
  }

  clear(): void {
    this.history = [];
  }
}

export const passwordHistoryStore = new PasswordHistoryStore();
