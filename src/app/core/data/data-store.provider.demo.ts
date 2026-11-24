import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { DEMO_MODE, DataStore } from './data-store';
import { MemoryDataStore } from './memory-data-store';

/** Modo demonstração: dados fictícios em memória, sem acesso ao Firestore. */
export function provideDataStore(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: DataStore, useClass: MemoryDataStore },
    { provide: DEMO_MODE, useValue: true },
  ]);
}
