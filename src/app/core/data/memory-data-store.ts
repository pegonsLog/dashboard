import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, map } from 'rxjs';
import { DataStore, DocumentData, StoredDocument } from './data-store';
import { createDemoData } from './demo-seed';

type Database = Record<string, Record<string, DocumentData>>;

const STORAGE_KEY = 'garbo.demo-database';
const LATENCY_MS = 150;

/**
 * Banco em memória usado no modo demonstração (`npm run start:demo`).
 * Os dados ficam no localStorage do navegador e nunca vão para o Firestore.
 */
@Injectable()
export class MemoryDataStore extends DataStore {
  private readonly database$ = new BehaviorSubject<Database>(this.load());

  watchCollection(name: string): Observable<StoredDocument[]> {
    return this.database$.pipe(
      map((database) =>
        Object.entries(database[name] ?? {}).map(([id, data]) => ({ id, data: { ...data } })),
      ),
      delay(LATENCY_MS),
    );
  }

  async getDocument(name: string, id: string): Promise<StoredDocument | null> {
    await this.wait();
    const data = this.database$.value[name]?.[id];
    return data ? { id, data: { ...data } } : null;
  }

  async findByFields(
    name: string,
    fields: Readonly<Record<string, string>>,
  ): Promise<StoredDocument[]> {
    await this.wait();
    return Object.entries(this.database$.value[name] ?? {})
      .filter(([, data]) => Object.entries(fields).every(([field, value]) => data[field] === value))
      .map(([id, data]) => ({ id, data: { ...data } }));
  }

  async addDocument(name: string, data: DocumentData): Promise<string> {
    const id = crypto.randomUUID().replaceAll('-', '').slice(0, 20);
    await this.write(name, (documents) => ({ ...documents, [id]: { ...data } }));
    return id;
  }

  async setDocument(name: string, id: string, data: DocumentData): Promise<void> {
    await this.write(name, (documents) => ({ ...documents, [id]: { ...documents[id], ...data } }));
  }

  async deleteDocument(name: string, id: string): Promise<void> {
    await this.write(name, (documents) => {
      const { [id]: _removed, ...rest } = documents;
      return rest;
    });
  }

  async updateMany(name: string, ids: readonly string[], patch: DocumentData): Promise<void> {
    await this.write(name, (documents) => {
      const updated = { ...documents };
      for (const id of ids) {
        if (updated[id]) {
          updated[id] = { ...updated[id], ...patch };
        }
      }
      return updated;
    });
  }

  private async write(
    name: string,
    change: (documents: Record<string, DocumentData>) => Record<string, DocumentData>,
  ): Promise<void> {
    await this.wait();
    const database = { ...this.database$.value, [name]: change(this.database$.value[name] ?? {}) };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
    this.database$.next(database);
  }

  private wait(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, LATENCY_MS));
  }

  private load(): Database {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as Database;
      }
    } catch {
      // Dados salvos corrompidos: recomeça com os dados de exemplo.
    }
    return createDemoData();
  }
}
