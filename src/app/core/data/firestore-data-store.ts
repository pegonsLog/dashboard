import { Injectable } from '@angular/core';
import { Observable, from, switchMap } from 'rxjs';
import { DataStore, DocumentData, StoredDocument } from './data-store';

type FirestoreApi = typeof import('./firestore-api');

/** Dados no Cloud Firestore (produção). O SDK é carregado na primeira utilização. */
@Injectable()
export class FirestoreDataStore extends DataStore {
  private readonly api: Promise<FirestoreApi> = import('./firestore-api');

  watchCollection(name: string): Observable<StoredDocument[]> {
    return from(this.api).pipe(switchMap((api) => api.watchCollection(name)));
  }

  async getDocument(name: string, id: string): Promise<StoredDocument | null> {
    return (await this.api).getDocument(name, id);
  }

  async findByFields(
    name: string,
    fields: Readonly<Record<string, string>>,
  ): Promise<StoredDocument[]> {
    return (await this.api).findByFields(name, fields);
  }

  async addDocument(name: string, data: DocumentData): Promise<string> {
    return (await this.api).addDocument(name, data);
  }

  async setDocument(name: string, id: string, data: DocumentData): Promise<void> {
    return (await this.api).setDocument(name, id, data);
  }

  async deleteDocument(name: string, id: string): Promise<void> {
    return (await this.api).deleteDocument(name, id);
  }

  async updateMany(name: string, ids: readonly string[], patch: DocumentData): Promise<void> {
    return (await this.api).updateMany(name, ids, patch);
  }
}
