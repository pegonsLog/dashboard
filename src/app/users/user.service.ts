import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {   addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  Firestore,
  getDocs,
  getFirestore,
  setDoc } from 'firebase/firestore/lite';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../shared/models/User';
import { docData } from '@angular/fire/firestore';

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

  constructor(private firestore: Firestore) { }

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
    let $userRef = doc(this.firestore, 'users/' + id);
    return docData($userRef, {idField: 'id'}) as Observable<User>;
  }

  delete(id: string) {
    let $userRef = doc(this.firestore, 'users/' + id);
    return deleteDoc($userRef);
  }

  addUser(user: User) {
    let $userRef = collection(this.firestore, 'users');
    return addDoc($userRef, user);
  }

  update(user: User, id: string) {
    let $userRef = doc(this.firestore, 'users/' + id);
    return setDoc($userRef, user);
  }
}

