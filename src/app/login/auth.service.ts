import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  collection,
  DocumentData,
  getDocs,
  getFirestore,
} from 'firebase/firestore/lite';
import { map, Observable } from 'rxjs';
import { User } from 'src/app/shared/models/User';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  users: User[] = [];
  role: string = '';
  user: User = {
    id: '',
    username: '',
    name: '',
    password: '',
    role: '',
  };

  constructor() {}

  list(): Observable<User[]> {
    const users = collection(this.db, 'users');
    return new Observable<DocumentData[]>((subscriber) => {
      getDocs(users)
        .then((usersSnapshot) => {
          const usersList = usersSnapshot.docs.map((doc) => doc.data());
          subscriber.next(usersList);
          subscriber.complete();
        })
        .catch((error) => {
          subscriber.error(error);
        });
    }).pipe(map((usersList) => usersList as User[]));
  }
}
