/**
 * @summary
 * In-memory store for Professional entities.
 *
 * @module instances/professional/professionalStore
 */

import { ProfessionalEntity } from '@/services/professional/professionalTypes';

class ProfessionalStore {
  private professionals: Map<number, ProfessionalEntity> = new Map();
  private currentId: number = 0;

  getNextId(): number {
    this.currentId += 1;
    return this.currentId;
  }

  add(professional: ProfessionalEntity): void {
    this.professionals.set(professional.id, professional);
  }

  getById(id: number): ProfessionalEntity | undefined {
    return this.professionals.get(id);
  }

  getByEmail(email: string): ProfessionalEntity | undefined {
    return Array.from(this.professionals.values()).find((p) => p.email === email);
  }

  getByCpf(cpf: string): ProfessionalEntity | undefined {
    return Array.from(this.professionals.values()).find((p) => p.cpf === cpf);
  }

  update(id: number, data: Partial<ProfessionalEntity>): ProfessionalEntity | undefined {
    const existing = this.professionals.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.professionals.set(id, updated);
    return updated;
  }

  clear(): void {
    this.professionals.clear();
    this.currentId = 0;
  }
}

export const professionalStore = new ProfessionalStore();
