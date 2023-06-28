import { Injectable } from '@angular/core';
import {
  DocumentData,
  Firestore,
  QueryDocumentSnapshot,
  QuerySnapshot,
  collection,
  collectionData,
  doc,
  docData,
  getDocs,
  getFirestore,
} from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { initializeApp } from 'firebase/app';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../shared/models/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  users: User[] = [];
  user: User = {
    id: '',
    username: '',
    name: '',
    password: '',
  };

  constructor(private firestore: Firestore, private snackBar: MatSnackBar) {}

  list() {
    let $userRef = collection(this.firestore, 'users');
    return collectionData($userRef, { idField: 'id' }) as Observable<User[]>;
  }
}
