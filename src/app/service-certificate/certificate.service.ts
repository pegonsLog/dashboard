import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection, collectionData, deleteDoc,
  doc, docData, getFirestore,
  setDoc
} from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { Observable, Subscription } from 'rxjs';
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

  constructor(private firestore: Firestore){

  }

  list() {
    let $certificateRef = collection(this.firestore, 'certificates');
    return collectionData($certificateRef, { idField: 'id' }) as Observable<Certificate[]>;
  }

  // list(): Observable<Certificate[]> {
  //   const certificates = collection(this.db, 'certificates');
  //   return new Observable<DocumentData[]>((subscriber) => {
  //     getDocs(certificates)
  //       .then((certificatesSnapshot) => {
  //         const certificatesList = certificatesSnapshot.docs.map((doc) =>
  //           doc.data()
  //         );
  //         subscriber.next(certificatesList);
  //         subscriber.complete();
  //       })
  //       .catch((error) => {
  //         subscriber.error(error);
  //       });
  //   }).pipe(map((certificatesList) => certificatesList as Certificate[]));
  // }

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

  certificateAdd(certificate: Certificate) {
    let $certificateRef = collection(this.db, 'certificates');
    return addDoc($certificateRef, certificate);
  }

  update(certificate: Certificate, id: string) {
    let $certificateRef = doc(this.db, 'certificates/' + id);
    return setDoc($certificateRef, certificate);
  }
}
