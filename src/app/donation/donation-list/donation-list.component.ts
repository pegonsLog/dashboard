import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { CertificateService } from '../../service-certificate/certificate.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation/confirmation.component';

@Component({
  selector: 'app-donation-list',
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.scss'],
})
export class DonationListComponent {
  subscription: Subscription = new Subscription();
  dataSource = [];
  displayedColumns: string[] = ['registration', 'startDay', 'mode', 'dayOff', 'actions'];

  constructor(
    private certificateService: CertificateService,
    public dialog: MatDialog
  ) {
    this.subscription = this.certificateService
      .list()
      .subscribe((certificates: any) => (this.dataSource = certificates));
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
