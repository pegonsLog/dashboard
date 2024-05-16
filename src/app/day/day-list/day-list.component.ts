import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, map } from 'rxjs';
import { CertificateService } from 'src/app/service-certificate/certificate.service';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation/confirmation.component';
import { Certificate } from 'src/app/shared/models/Certificate';

@Component({
  selector: 'app-day-list',
  templateUrl: './day-list.component.html',
  styleUrls: ['./day-list.component.scss'],
})
export class DayListComponent implements OnDestroy {
  subscription: Subscription = new Subscription();
  dataSource: Certificate[] = [];
  certificates: Certificate[] = [];
  certificateUpdate: string = 'dayUpdate';

  @Input() searchListDay: any[] = [];

  @Output() type: EventEmitter<string> = new EventEmitter<string>();
  @Output() certificateEmit: EventEmitter<any> = new EventEmitter<string>();

  displayedColumns: string[] = [
    'registration',
    'startDay',
    'endDay',
    'actions',
  ];

  constructor(
    private certificateService: CertificateService,
    public dialog: MatDialog
  ) {
    this.subscription = this.certificateService
    .list()
    .pipe(
      map((certificates: Certificate[]) => {
        const datesplitsearch = this.searchListDay[1].split('-');

        const dateIni = datesplitsearch[0].split('/');
        const dayIni = parseInt(dateIni[0], 10);
        const monthIni = parseInt(dateIni[1], 10) - 1;
        const yearIni = parseInt(dateIni[2], 10);

        const dateEnd = datesplitsearch[1].split('/');
        const dayEnd = parseInt(dateEnd[0], 10);
        const monthEnd = parseInt(dateEnd[1], 10) - 1;
        const yearEnd = parseInt(dateEnd[2], 10);

        const dateObjectIni = new Date(yearIni, monthIni, dayIni);

        const dateObjectEnd = new Date(yearEnd, monthEnd, dayEnd);
        for (let r of certificates) {
          const dateIni = r.startDay.toString().split('/');
          const dayIni = parseInt(dateIni[0], 10);
          const monthIni = parseInt(dateIni[1], 10) - 1;
          const yearIni = parseInt(dateIni[2], 10);
          const dateObjetcR = new Date(yearIni, monthIni, dayIni);

          if (
            dateObjectIni <= dateObjetcR &&
            dateObjectEnd >= dateObjetcR &&
            r.registration === this.searchListDay[0] &&
            r.type === this.searchListDay[2] 
          ) {
            this.certificates.push(r);
          }
        }
      })
    )
    .subscribe(() => (this.dataSource = this.certificates));

  }

  onUpdateCertificate(id: string) {
    this.subscription = this.certificateService
      .findOne(id)
      .subscribe((result: Certificate) => {
        this.certificateEmit.emit(result),
          this.type.emit(this.certificateUpdate);
      });
  }

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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
