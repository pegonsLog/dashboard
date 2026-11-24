import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DocumentData, StoredDocument } from './data-store';

/**
 * Todo o código que usa o SDK do Firebase fica neste arquivo, carregado sob demanda
 * (import dinâmico) para a tela de login abrir sem esperar o SDK.
 */
const app = getApps().length ? getApp() : initializeApp(environment.firebase);
const db = getFirestore(app);

/** O Firestore aceita no máximo 500 operações por lote. */
const BATCH_LIMIT = 450;

export function watchCollection(name: string): Observable<StoredDocument[]> {
  return new Observable<StoredDocument[]>((subscriber) =>
    onSnapshot(
      collection(db, name),
      (snapshot) =>
        subscriber.next(snapshot.docs.map((item) => ({ id: item.id, data: item.data() }))),
      (error) => subscriber.error(error),
    ),
  );
}

export async function getDocument(name: string, id: string): Promise<StoredDocument | null> {
  const snapshot = await getDoc(doc(db, name, id));
  return snapshot.exists() ? { id: snapshot.id, data: snapshot.data() } : null;
}

export async function findByFields(
  name: string,
  fields: Readonly<Record<string, string>>,
): Promise<StoredDocument[]> {
  const filters = Object.entries(fields).map(([field, value]) => where(field, '==', value));
  const snapshot = await getDocs(query(collection(db, name), ...filters));
  return snapshot.docs.map((item) => ({ id: item.id, data: item.data() }));
}

export async function addDocument(name: string, data: DocumentData): Promise<string> {
  const reference = await addDoc(collection(db, name), data);
  return reference.id;
}

export function setDocument(name: string, id: string, data: DocumentData): Promise<void> {
  return setDoc(doc(db, name, id), data, { merge: true });
}

export function deleteDocument(name: string, id: string): Promise<void> {
  return deleteDoc(doc(db, name, id));
}

export async function updateMany(
  name: string,
  ids: readonly string[],
  patch: DocumentData,
): Promise<void> {
  for (let start = 0; start < ids.length; start += BATCH_LIMIT) {
    const batch = writeBatch(db);
    for (const id of ids.slice(start, start + BATCH_LIMIT)) {
      batch.update(doc(db, name, id), patch);
    }
    await batch.commit();
  }
}
