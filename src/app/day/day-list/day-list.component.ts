import { Component, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DayService } from '../day.service';
import { Observable, Subscription } from 'rxjs';
import { Certificate } from 'src/app/shared/models/Certificate';

@Component({
  selector: 'app-day-list',
  templateUrl: './day-list.component.html',
  styleUrls: ['./day-list.component.scss'],
})
export class DayListComponent implements OnDestroy {
  subscription: Subscription = new Subscription();
  dataSource = [];
  displayedColumns: string[] = ['registration', 'startDay', 'endDay', 'mode'];

  constructor(private dayService: DayService) {
    this.subscription = dayService.list()
      .subscribe(
        (certificates: any) => (this.dataSource = certificates)
      );
  }




  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
