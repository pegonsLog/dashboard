import { Component, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { CertificateService } from 'src/app/service-certificate/certificate.service';

@Component({
  selector: 'app-hour-list',
  templateUrl: './hour-list.component.html',
  styleUrls: ['./hour-list.component.scss'],
})
export class HourListComponent {
  subscription: Subscription = new Subscription();
  dataSource = [];
  displayedColumns: string[] = ['registration', 'startDay', 'startHour', 'endHour', 'mode'];

  constructor(private certificateService: CertificateService) {
    this.subscription = certificateService
      .list()
      .subscribe((certificates: any) => (this.dataSource = certificates));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
