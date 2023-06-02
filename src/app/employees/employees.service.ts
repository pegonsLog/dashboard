import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  DocumentData,
  collection,
  getDocs,
  getFirestore,
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
}
