import { Component, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription, map } from 'rxjs';
import { CertificateService } from 'src/app/service-certificate/certificate.service';
import { Certificate } from 'src/app/shared/models/Certificate';

@Component({
  selector: 'app-day-list',
  templateUrl: './day-list.component.html',
  styleUrls: ['./day-list.component.scss'],
})
export class DayListComponent implements OnDestroy {
  subscription: Subscription = new Subscription();
  dataSource$: Observable<any>;

  year: string = '';
  mode: string = '';
  registration: string = '';
  typeCertificate: string = '';

  displayedColumns: string[] = ['registration', 'startDay', 'endDay', 'mode'];

  constructor(private certificateService: CertificateService) {
   this.dataSource$ = this.certificateService.list().pipe(map((list: Certificate[])=> list.filter((data: Certificate) => data.registration === this.registration)));
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onRegistration(evento: string){
    this.registration = evento;
  }
}
