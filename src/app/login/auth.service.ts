import { Injectable } from '@angular/core';
import {
  DocumentData,
  Firestore,
  QueryDocumentSnapshot,
  QuerySnapshot,
  collection,
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

  authentication(username: string, password: string): Observable<User> {
    const users = collection(this.db, 'users');

    return new Observable<User>((subscriber) => {
      getDocs(users)
        .then((usersSnapshot: QuerySnapshot<DocumentData>) => {
          const usersList: User[] = usersSnapshot.docs.map(
            (doc: QueryDocumentSnapshot<DocumentData>) => doc.data() as User
          );
          for (let user of usersList) {
            if (user.username === username && user.password === password) {
              this.user = user;
              subscriber.next(this.user);
              subscriber.complete();
            }
          }
        })
        .catch((error) => {
          subscriber.error(error);
        });
    });
  }
}
