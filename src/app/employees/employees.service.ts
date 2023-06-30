import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  DocumentData,
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  getFirestore,
  setDoc,
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Employee } from '../shared/models/Employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  employees: Employee[] = [];
  employee: Employee = {
    id: '',
    registration: '',
    name: '',
    birthday: '',
  };

  constructor(private firestore: Firestore) {}

  list() {
    let $employeeRef = collection(this.firestore, 'employees');
    return collectionData($employeeRef, { idField: 'id' }) as Observable<
      Employee[]
    >;
  }

  findOne(id: string) {
    let $employeeRef = doc(this.db, 'employees/' + id);
    return docData($employeeRef, {
      idField: 'id',
    }) as Observable<Employee>;
  }

  delete(id: string) {
    let $employeeRef = doc(this.db, 'employees/' + id);
    return deleteDoc($employeeRef);
  }

  employeeAdd(employee: Employee) {
    let $employeeRef = collection(this.db, 'employees');
    return addDoc($employeeRef, employee);
  }

  update(employee: Employee, id: string) {
    let $employeeRef = doc(this.db, 'employees/' + id);
    return setDoc($employeeRef, employee);
  }
}
