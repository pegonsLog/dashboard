import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { DataStore } from './data-store';
import { FirestoreDataStore } from './firestore-data-store';

/**
 * Produção: dados no Firestore.
 * Na configuração "demo" este arquivo é trocado por data-store.provider.demo.ts (ver angular.json).
 */
export function provideDataStore(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: DataStore, useClass: FirestoreDataStore }]);
}
