import { INPUT_MODALITY_DETECTOR_OPTIONS } from '@angular/cdk/a11y';
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
  @Input() registration: string = '';
  typeCertificate: string = '';

  displayedColumns: string[] = ['registration', 'startDay', 'endDay', 'mode'];

  constructor(private certificateService: CertificateService) {
   
    this.dataSource$ = this.certificateService
      .list()
      .pipe(
        map((list: Certificate[]) =>
          list.filter(
            (data: Certificate) => data.registration === this.registration
          )
        )
      );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onRegistration(evento: any) {
    console.log(evento);
  }

  onSearch(emit: any) {
    console.log(emit);

    // console.log(this.registration = emit[0]),
    // console.log(this.year = emit[1]),
    // console.log(this.typeCertificate = emit[2]),
    // console.log(this.mode = emit[3])
  }
}
