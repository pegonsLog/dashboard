import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation/confirmation.component';
import { CertificateService } from '../../service-certificate/certificate.service';
import { Certificate } from 'src/app/shared/models/Certificate';

@Component({
  selector: 'app-donation-list',
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.scss'],
})
export class DonationListComponent implements OnDestroy {
  subscription: Subscription = new Subscription();
  dataSource = [];
  displayedColumns: string[] = [
    'registration',
    'startDay',
    'dayOff',
    'actions',
  ];

  certificateUpdate: string = 'donationUpdate';

  @Input() registration: string = '';
  @Input() year: string = '';
  @Input() typeDonation: string = '';

  @Output() type: EventEmitter<string> = new EventEmitter<string>();
  @Output() certificateEmit: EventEmitter<any> = new EventEmitter<string>();

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
