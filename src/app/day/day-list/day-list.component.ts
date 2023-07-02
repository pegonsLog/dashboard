import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CertificateService } from 'src/app/service-certificate/certificate.service';
import { Certificate } from 'src/app/shared/models/Certificate';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation/confirmation.component';

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
    year: '',
  };

  @Input() registration: string = '';
  @Input() year: string = '';
  @Input() type: string = '';
  @Input() mode: string = '';

  displayedColumns: string[] = [
    'registration',
    'startDay',
    'endDay',
    'mode',
    'actions',
  ];

  constructor(
    private certificateService: CertificateService,
    public dialog: MatDialog
  ) {
    this.dataSource$ = this.certificateService.list();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onUpdateCertificate() {}

  onDeleteCertificate(id: string) {
    const dialogReference = this.dialog.open(ConfirmationDialogComponent);
    this.subscription = dialogReference
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.certificateService.delete(id).then();
        }
      });
  }

}
