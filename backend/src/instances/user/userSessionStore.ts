/**
 * @summary
 * In-memory store for user sessions.
 *
 * @module instances/user/userSessionStore
 */

import { UserSession } from '@/services/user/userTypes';

class UserSessionStore {
  private sessions: Map<string, UserSession> = new Map();

  add(session: UserSession): void {
    this.sessions.set(session.sessao_id, session);
  }

  getById(sessionId: string): UserSession | undefined {
    return this.sessions.get(sessionId);
  }

  getByUserId(userId: string): UserSession[] {
    return Array.from(this.sessions.values()).filter((s) => s.id_usuario === userId && s.ativo);
  }

  terminateSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.ativo = false;
    }
  }

  terminateAllSessions(userId: string): void {
    Array.from(this.sessions.values())
      .filter((s) => s.id_usuario === userId)
      .forEach((s) => (s.ativo = false));
  }

  clear(): void {
    this.sessions.clear();
  }
}

export const userSessionStore = new UserSessionStore();
