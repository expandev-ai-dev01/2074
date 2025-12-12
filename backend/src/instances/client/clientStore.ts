/**
 * @summary
 * In-memory store for Client entities.
 *
 * @module instances/client/clientStore
 */

import { ClientEntity } from '@/services/client/clientTypes';

class ClientStore {
  private clients: Map<number, ClientEntity> = new Map();
  private currentId: number = 0;

  getNextId(): number {
    this.currentId += 1;
    return this.currentId;
  }

  add(client: ClientEntity): void {
    this.clients.set(client.id, client);
  }

  getById(id: number): ClientEntity | undefined {
    return this.clients.get(id);
  }

  getByEmail(email: string): ClientEntity | undefined {
    return Array.from(this.clients.values()).find((c) => c.email === email);
  }

  getByCpf(cpf: string): ClientEntity | undefined {
    return Array.from(this.clients.values()).find((c) => c.cpf === cpf);
  }

  update(id: number, data: Partial<ClientEntity>): ClientEntity | undefined {
    const existing = this.clients.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.clients.set(id, updated);
    return updated;
  }

  clear(): void {
    this.clients.clear();
    this.currentId = 0;
  }
}

export const clientStore = new ClientStore();
