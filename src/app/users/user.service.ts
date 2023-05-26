import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { DocumentData, collection, getDocs, getFirestore } from 'firebase/firestore/lite';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../shared/models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  users: User[] = [];
  user: User = {
    id: '',
    username: '',
    name: '',
    password: ''
  };

  constructor() { }

  list(): Observable<User[]> {
    const users = collection(this.db, 'users');
    return new Observable<DocumentData[]>((subscriber) => {
      getDocs(users)
        .then((usersSnapshot) => {
          const userList = usersSnapshot.docs.map((doc) => doc.data());
          subscriber.next(userList);
          subscriber.complete();
        })
        .catch((error) => {
          subscriber.error(error);
        });
    }).pipe(map((certificatesList) => certificatesList as User[]));
  }
}
