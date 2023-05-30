import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { DocumentData, Firestore, addDoc, collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore/lite';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Certificate } from '../shared/models/Certificate';
import { docData } from '@angular/fire/firestore';

@Injectable(
  { providedIn: 'root'}
    )
export class CertificateService {

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

  constructor(private firestore: Firestore) { }

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

  findOne(id: string) {
    let $certificateRef = doc(this.firestore, 'certificates/' + id);
    return docData($certificateRef, {idField: 'id'}) as Observable<Certificate>;
  }

  delete(id: string) {
    let $certificateRef = doc(this.firestore, 'certificates/' + id);
    return deleteDoc($certificateRef);
  }

  addUser(certificate: Certificate) {
    let $certificateRef = collection(this.firestore, 'certificates');
    return addDoc($certificateRef, certificate);
  }

  update(certificate: Certificate, id: string) {
    let $certificateRef = doc(this.firestore, 'certificates/' + id);
    return setDoc($certificateRef, certificate);
  }
}
