import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { DonationService } from '../donation.service';

@Component({
  selector: 'app-donation-list',
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.scss']
})
export class DonationListComponent {
  subscription: Subscription = new Subscription();
  dataSource = [];
  displayedColumns: string[] = ['registration', 'startDay', 'mode', 'dayOff'];

  constructor(private donationService: DonationService) {
    this.subscription = donationService.list()
      .subscribe(
        (certificates: any) => (this.dataSource = certificates)
      );
  }




  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
