import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export type DocumentData = Record<string, unknown>;

export interface StoredDocument {
  readonly id: string;
  readonly data: DocumentData;
}

/** Nomes das coleções do Firestore (mantidos iguais aos do sistema original). */
export const COLLECTIONS = {
  certificates: 'certificates',
  employees: 'employees',
  users: 'users',
} as const;

/**
 * Acesso a dados independente do banco. Em produção é o Firestore;
 * no modo demonstração é um banco em memória (ver data-store.provider.demo.ts).
 */
export abstract class DataStore {
  /** Emite todos os documentos da coleção e volta a emitir a cada alteração. */
  abstract watchCollection(collection: string): Observable<StoredDocument[]>;

  abstract getDocument(collection: string, id: string): Promise<StoredDocument | null>;

  /** Busca documentos cujos campos sejam iguais aos valores informados. */
  abstract findByFields(
    collection: string,
    fields: Readonly<Record<string, string>>,
  ): Promise<StoredDocument[]>;

  /** Cria um documento e retorna o id gerado. */
  abstract addDocument(collection: string, data: DocumentData): Promise<string>;

  /** Grava os campos informados, preservando campos desconhecidos do documento. */
  abstract setDocument(collection: string, id: string, data: DocumentData): Promise<void>;

  abstract deleteDocument(collection: string, id: string): Promise<void>;

  /** Aplica a mesma alteração parcial em vários documentos. */
  abstract updateMany(
    collection: string,
    ids: readonly string[],
    patch: DocumentData,
  ): Promise<void>;
}

/** Indica que o app está usando dados fictícios em memória. */
export const DEMO_MODE = new InjectionToken<boolean>('DEMO_MODE', { factory: () => false });
