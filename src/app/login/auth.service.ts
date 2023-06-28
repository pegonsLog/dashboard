import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  getFirestore,
} from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { Observable } from 'rxjs';
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

  constructor(private firestore: Firestore) {}

  list() {
    let $userRef = collection(this.firestore, 'users');
    return collectionData($userRef, { idField: 'id' }) as Observable<User[]>;
  }

  toAuth() {
    localStorage.setItem('login', 'sim');
  }

  toUnlogin() {
    localStorage.clear();
  }

  getStatusLogin = () => !!localStorage.getItem('login');
}
