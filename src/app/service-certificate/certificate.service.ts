import { Injectable } from '@angular/core';
import {
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
import { initializeApp } from 'firebase/app';
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
    startDay: new Date('dd/mm/yyyy'),
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
  async listHour(
    registration: string,
    period: string,
    type: string,
    mode: string
  ) {
    const datesplitsearch = period.split('-');

    const dateIni = datesplitsearch[0].split('/');
    const dayIni = parseInt(dateIni[0], 10);
    const monthIni = parseInt(dateIni[1], 10) - 1;
    const yearIni = parseInt(dateIni[2], 10);

    const dateEnd = datesplitsearch[1].split('/');
    const dayEnd = parseInt(dateEnd[0], 10);
    const monthEnd = parseInt(dateEnd[1], 10) - 1;
    const yearEnd = parseInt(dateEnd[2], 10);

    const dateObjectIni = new Date(yearIni, monthIni, dayIni);
    const dateObjectEnd = new Date(yearEnd, monthEnd, dayEnd);

    this.list()
      .pipe(
        map((result: Certificate[]) => {
          for (let r of result) {
            const dateIni = r.startDay.toString().split('/');
            const dayIni = parseInt(dateIni[0], 10);
            const monthIni = parseInt(dateIni[1], 10) - 1;
            const yearIni = parseInt(dateIni[2], 10);
            const dateObjetcR = new Date(yearIni, monthIni, dayIni);

            if (
              dateObjectIni <= dateObjetcR &&
              dateObjetcR <= dateObjectEnd &&
              r.registration === registration &&
              r.type === type &&
              r.mode === mode
            ) {
              this.certificates.push(r);
            }
          }
        })
      )

      .subscribe();

    return this.certificates;
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
