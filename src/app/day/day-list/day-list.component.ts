import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Observable, Subscription, map } from 'rxjs';
import { CertificateService } from 'src/app/service-certificate/certificate.service';
import { Certificate } from 'src/app/shared/models/Certificate';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation/confirmation.component';
import { DialogUpdatedComponent } from 'src/app/shared/dialogs/dialog-updated/dialog-updated.component';

@Component({
  selector: 'app-day-list',
  templateUrl: './day-list.component.html',
  styleUrls: ['./day-list.component.scss'],
})
export class DayListComponent implements OnDestroy {
  subscription: Subscription = new Subscription();
  dataSource$: Observable<any>;
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
    this.dataSource$ = this.certificateService
      .list()
      .pipe(
        map((data: Certificate[]) =>
          data.filter(
            (result: Certificate) =>
              this.searchListDay[0] === result.registration &&
              this.searchListDay[1] ===
                result.startDay.toString().substring(6) &&
              this.searchListDay[2] === result.type
          )
        )
      );
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
