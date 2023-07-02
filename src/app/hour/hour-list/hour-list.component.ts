<<<<<<< HEAD
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
=======
import { Component, Input } from '@angular/core';
>>>>>>> f9e8d2e7be0dfa117eb5ad7543dc4311d9f58ce1
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
  displayedColumns: string[] = ['registration', 'startDay', 'startHour', 'endHour', 'mode', 'actions'];

<<<<<<< HEAD
  constructor(private certificateService: CertificateService, public dialog: MatDialog) {
=======
  @Input() registration: string = '';
  @Input() year: string = '';
  @Input() type: string = '';
  @Input() mode: string = '';

  constructor(private certificateService: CertificateService) {
>>>>>>> f9e8d2e7be0dfa117eb5ad7543dc4311d9f58ce1
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
