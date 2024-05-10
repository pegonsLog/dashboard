import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { Observable, Subscription, first, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Certificate } from './../shared/models/Certificate';
import { parse } from 'date-fns';

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

  constructor(private firestore: Firestore) {}

  list() {
    let $certificateRef = collection(this.firestore, 'certificates');
    return collectionData($certificateRef, { idField: 'id' }) as Observable<
      Certificate[]
    >;
  }
  async listHour(startDay: string) {

    this.list()
      .pipe(
        map((result: Certificate[]) => {
          for (let r of result) {

            console.log(r.startDay, new Date(startDay))
    //  if(r.startDay != startDay){console.log(new Date(r.startDay) + 'é igual a ' + startDay)}

            // this.certificates.push(r);
          }
        })
      )
      .subscribe();

    return this.certificates;
    // const date = startDay.toLocaleDateString()
    // console.log(date)
    // const q = query(
    //   collection(this.firestore, 'certificates'),
    //   where('startDay', '>=', date)
    // );
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

  certificateAdd(certificate: Certificate) {
    let $certificateRef = collection(this.db, 'certificates');
    return addDoc($certificateRef, certificate);
  }

  update(certificate: Certificate, id: string) {
    let $certificateRef = doc(this.db, 'certificates/' + id);
    return setDoc($certificateRef, certificate);
  }
}
