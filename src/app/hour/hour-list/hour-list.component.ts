import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { HourService } from '../hour.service';

@Component({
  selector: 'app-hour-list',
  templateUrl: './hour-list.component.html',
  styleUrls: ['./hour-list.component.scss'],
})
export class HourListComponent {
  subscription: Subscription = new Subscription();
  dataSource = [];
  displayedColumns: string[] = ['registration', 'startDay', 'startHour', 'endHour', 'mode'];

  constructor(private hourService: HourService) {
    this.subscription = hourService
      .list()
      .subscribe((certificates: any) => (this.dataSource = certificates));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
