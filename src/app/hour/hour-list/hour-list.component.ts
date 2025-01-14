import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { CertificateService } from 'src/app/service-certificate/certificate.service';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation/confirmation.component';
import { Certificate } from 'src/app/shared/models/Certificate';

@Component({
  selector: 'app-hour-list',
  templateUrl: './hour-list.component.html',
  styleUrls: ['./hour-list.component.scss'],
})
export class HourListComponent implements OnDestroy, OnInit {
  subscription: Subscription = new Subscription();
  certificates: Certificate[] = [];
  dataSource: Certificate[] = [];
  // certificates$?: Observable<any>;

  temSaldo: boolean = false;

  certificateUpdate: string = 'hourUpdate';

  totalHours: number = 0;
  fullMinutes: number = 0;
  totalMinutes: number = 0;

  // totalTiming: number = 0;

  @Input() searchListHour: any[] = [];

  @Input() typeHour: string = '';

  @Output() type: EventEmitter<string> = new EventEmitter<string>();
  @Output() certificateEmit: EventEmitter<any> = new EventEmitter<string>();

  displayedColumns: string[] = [
    'registration',
    'startDay',
    'startHour',
    'endHour',
    'mode',
    'status',
    'actions',
  ];

  constructor(
    private certificateService: CertificateService,
    public dialog: MatDialog,
    public router: Router
  ) {
    this.loadCertificates();
  }

  onUpdateCertificate(id: string) {
    this.subscription = this.certificateService
      .findOne(id)
      .subscribe((result: Certificate) => {
        this.certificateEmit.emit(result),
          this.type.emit(this.certificateUpdate);
      });
  }


  loadCertificates() {
    this.subscription = this.certificateService
      .list()
      .pipe(
        map((certificates: Certificate[]) => {
          const datesplitsearch = this.searchListHour[1].split('-');

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

          const filteredCertificates = certificates.filter(r => {
            const dateIni = r.startDay.toString().split('/');
            const dayIni = parseInt(dateIni[0], 10);
            const monthIni = parseInt(dateIni[1], 10) - 1;
            const yearIni = parseInt(dateIni[2], 10);
            const dateObjetcR = new Date(yearIni, monthIni, dayIni);

            return (
              dateObjectIni <= dateObjetcR &&
              dateObjectEnd >= dateObjetcR &&
              r.registration === this.searchListHour[0] &&
              r.type === this.searchListHour[2] &&
              r.mode === this.searchListHour[3]
            );
          });

          // Ordena os certificados por startDay em ordem decrescente
          filteredCertificates.sort((a, b) => {
            const dateA = new Date(a.startDay.toString().split('/').reverse().join('-'));
            const dateB = new Date(b.startDay.toString().split('/').reverse().join('-'));
            return dateB.getTime() - dateA.getTime();
          });

          return filteredCertificates;
        })
      )
      .subscribe((sortedCertificates: Certificate[]) => {
        this.certificates = sortedCertificates;
        this.dataSource = this.certificates;
      });
  }

  onDeleteCertificate(id: string) {
    const dialogReference = this.dialog.open(ConfirmationDialogComponent);
    this.subscription = dialogReference
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.certificateService.delete(id).then(() => {
            location.reload();
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.certificates.sort((a, b) =>
      a
        .startDay!.toLocaleDateString()
        .split('/')
        .reverse()
        .toString()
        .localeCompare(
          b.startDay!.toLocaleDateString().split('/').reverse().toString()
        )
    );
  }

  acumulate() {
    for (let t of this.dataSource) {
      let hour1: any = new Date(`2023-07-18T${t.startHour}Z`);
      let hour2: any = new Date(`2023-07-18T${t.endHour}Z`);
      this.fullMinutes += Math.floor((hour2 - hour1) / (1000 * 60)) % 60;

      this.totalHours +=
        Math.floor((hour2 - hour1) / (1000 * 60 * 60)) +
        Math.floor(this.totalMinutes / 60);
    }
    const dec = ((this.fullMinutes / 60) % 1).toFixed(3);
    this.totalMinutes = Math.round(parseFloat(dec) * 60);
    this.temSaldo = true;
  }
}
