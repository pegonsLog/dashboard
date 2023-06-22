import { Component, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
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

  certificateDay: Certificate = {
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

  @Input() registration: string = '';
  @Input() year: string = '';
  @Input() type: string = '';
  @Input() mode: string = '';

  displayedColumns: string[] = ['registration', 'startDay', 'endDay', 'mode', 'actions'];

  constructor(private certificateService: CertificateService) {
    this.dataSource$ = this.certificateService.list();
    // .pipe(
    //   map((list: Certificate[]) =>
    //     list.filter(
    //       (data: Certificate) => data.registration === '564'
    //     )
    //   )
    // );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onRegistration(teste: any) {
    console.log(teste);
  }

  onUpdateCertificate() {
  }

  onDeleteCertificate(id: string) {
   this.certificateService.delete(id).then();
  }

  onSearch(emit: any) {

    // console.log(this.registration = emit[0]),
    // console.log(this.year = emit[1]),
    // console.log(this.typeCertificate = emit[2]),
    // console.log(this.mode = emit[3])
  }
}
