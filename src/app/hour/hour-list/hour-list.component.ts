import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CertificateService } from 'src/app/service-certificate/certificate.service';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation/confirmation.component';

@Component({
  selector: 'app-hour-list',
  templateUrl: './hour-list.component.html',
  styleUrls: ['./hour-list.component.scss'],
})
export class HourListComponent {
  subscription: Subscription = new Subscription();
  dataSource = [];

  registration: string = '';
  displayedColumns: string[] = ['registration', 'startDay', 'startHour', 'endHour', 'mode', 'actions'];

  constructor(private certificateService: CertificateService, public dialog: MatDialog) {
    this.subscription = this.certificateService
      .list()
      .subscribe((certificates: any) => (this.dataSource = certificates));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
}
