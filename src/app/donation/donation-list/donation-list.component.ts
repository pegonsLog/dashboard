import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { CertificateService } from '../../service-certificate/certificate.service';

@Component({
  selector: 'app-donation-list',
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.scss']
})
export class DonationListComponent {
  subscription: Subscription = new Subscription();
  dataSource = [];
  displayedColumns: string[] = ['registration', 'startDay', 'mode', 'dayOff'];

  constructor( private certificateService: CertificateService) {

    this.subscription = this.certificateService.list()
      .subscribe(
        (certificates: any) => (this.dataSource = certificates)
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
