import { Injectable } from '@angular/core';
import { docData } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import {
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from 'firebase/firestore/lite';
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

  constructor() {}

  list(): Observable<Employee[]> {
    const employees = collection(this.db, 'employees');
    return new Observable<DocumentData[]>((subscriber) => {
      getDocs(employees)
        .then((employeesSnapshot) => {
          const employeeList = employeesSnapshot.docs.map((doc) => doc.data());
          subscriber.next(employeeList);
          subscriber.complete();
        })
        .catch((error) => {
          subscriber.error(error);
        });
    }).pipe(map((employeeList) => employeeList as Employee[]));
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

