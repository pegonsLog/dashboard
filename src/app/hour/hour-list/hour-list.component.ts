import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CertificateService } from 'src/app/service-certificate/certificate.service';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation/confirmation.component';
import { Certificate } from 'src/app/shared/models/Certificate';

@Component({
  selector: 'app-hour-list',
  templateUrl: './hour-list.component.html',
  styleUrls: ['./hour-list.component.scss'],
})
export class HourListComponent implements OnDestroy {
  subscription: Subscription = new Subscription();
  dataSource = [];

  certificateUpdate: string = 'hourUpdate';

  @Input() registration: string = '';
  @Input() year: string = '';
  @Input() mode: string = '';
  @Input() typeHour: string = '';

  @Output() type: EventEmitter<string> = new EventEmitter<string>();
  @Output() certificateEmit: EventEmitter<any> = new EventEmitter<string>();

  displayedColumns: string[] = [
    'registration',
    'startDay',
    'startHour',
    'endHour',
    'mode',
    'actions',
  ];

  constructor(
    private certificateService: CertificateService,
    public dialog: MatDialog
  ) {
    this.subscription = this.certificateService
      .list()
      .subscribe((certificates: any) => (this.dataSource = certificates));
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
