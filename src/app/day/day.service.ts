import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from '../shared/models/User';
import { DocumentData, collection, getDocs, getFirestore } from 'firebase/firestore/lite';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { Certificate } from '../shared/models/Certificate';

@Injectable({
  providedIn: 'root'
})
export class DayService {

  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  certificates: Certificate[] = [];
  certificate: Certificate = {
    id: '',
    registration: '',
    startDay: new Date,
    endDay: new Date,
    startHour: new Date,
    endHour: new Date,
    dayOff: new Date,
    type: '',
    mode: '',
  };

  constructor() { }

  list(): Observable<Certificate[]> {
    const certificates = collection(this.db, 'certificate');
    return new Observable<DocumentData[]>((subscriber) => {
      getDocs(certificates)
        .then((certificatesSnapshot) => {
          const certificatesList = certificatesSnapshot.docs.map((doc) => doc.data());
          subscriber.next(certificatesList);
          subscriber.complete();
        })
        .catch((error) => {
          subscriber.error(error);
        });
    }).pipe(map((certificatesList) => certificatesList as Certificate[]));
  }
}
