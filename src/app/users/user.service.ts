import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { DocumentData, Firestore, addDoc, collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore/lite';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { docData } from '@angular/fire/firestore';
import { User } from '../shared/models/User';

@Injectable(
  { providedIn: 'root'}
  )
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

  findOne(id: string) {
    let $userRef = doc(this.db, 'users/' + id);
    return docData($userRef, {idField: 'id'}) as Observable<User>;
  }

  delete(id: string) {
    let $userRef = doc(this.db, 'users/' + id);
    return deleteDoc($userRef);
  }

  addUser(user: User) {
    let $userRef = collection(this.db, 'users');
    return addDoc($userRef, user);
  }

  update(user: User, id: string) {
    let $userRef = doc(this.db, 'users/' + id);
    return setDoc($userRef, user);
  }
}

