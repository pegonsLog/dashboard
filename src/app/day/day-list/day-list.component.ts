import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CertificateService } from 'src/app/service-certificate/certificate.service';

@Component({
  selector: 'app-day-list',
  templateUrl: './day-list.component.html',
  styleUrls: ['./day-list.component.scss'],
})
export class DayListComponent implements OnDestroy {
  subscription: Subscription = new Subscription();
  dataSource = [];
  displayedColumns: string[] = ['registration', 'startDay', 'endDay', 'mode'];

  constructor(private certificateService: CertificateService) {
    this.subscription = certificateService.list()
      .subscribe(
        (certificates: any) => (this.dataSource = certificates)
      );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
