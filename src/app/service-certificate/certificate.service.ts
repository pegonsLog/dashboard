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
import { Observable, Subscription, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Certificate } from './../shared/models/Certificate';

@Injectable({ providedIn: 'root' })
export class CertificateService {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  subscription: Subscription = new Subscription();

  certificates: Certificate[] = [];
  certificate: Certificate = {
    id: '',
    registration: '',
    startDay: new Date(),
    endDay: new Date(),
    startHour: new Date(),
    endHour: new Date(),
    dayOff: new Date(),
    type: '',
    mode: '',
  };

  list(): Observable<Certificate[]> {
    const certificates = collection(this.db, 'certificate');
    return new Observable<DocumentData[]>((subscriber) => {
      getDocs(certificates)
        .then((certificatesSnapshot) => {
          const certificatesList = certificatesSnapshot.docs.map((doc) =>
            doc.data()
          );
          subscriber.next(certificatesList);
          subscriber.complete();
        })
        .catch((error) => {
          subscriber.error(error);
        });
    }).pipe(map((certificatesList) => certificatesList as Certificate[]));
  }

  findOne(id: string) {
    let $certificateRef = doc(this.db, 'certificates/' + id);
    return docData($certificateRef, {
      idField: 'id',
    }) as Observable<Certificate>;
  }

  delete(id: string) {
    let $certificateRef = doc(this.db, 'certificates/' + id);
    return deleteDoc($certificateRef);
  }

  addCertificate(certificate: Certificate) {
    let $certificateRef = collection(this.db, 'certificates');
    return addDoc($certificateRef, certificate);
  }

  update(certificate: Certificate, id: string) {
    let $certificateRef = doc(this.db, 'certificates/' + id);
    return setDoc($certificateRef, certificate);
  }
}
