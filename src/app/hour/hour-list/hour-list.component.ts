import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription, first, map, take, tap, toArray } from 'rxjs';
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
  dataSource$: Observable<any>;
  // certificates!: Observable<any>;

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
          data
            .filter(
              (result: Certificate) =>
                this.searchListHour[0] === result.registration &&
                this.searchListHour[2] === result.type &&
                this.searchListHour[3] === result.mode &&
                this.searchListHour[1] ===
                  result.startDay.toString().substring(6)
            )
            .sort((a, b) =>
            b.startDay.toString().split('/').reverse().join('/').localeCompare(a.startDay.toString().split('/').reverse().join('/'))
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
  ngOnInit(): void {
    this.acumulate();
  }

  acumulate() {
this.dataSource$
      .pipe(
        map((result: Certificate[]) => {
          for (let t of result) {
            let hour1: any = new Date(`2023-07-18T${t.startHour}Z`);
            let hour2: any = new Date(`2023-07-18T${t.endHour}Z`);
            this.fullMinutes += Math.floor((hour2 - hour1) / (1000 * 60)) % 60;

            this.totalHours +=
              Math.floor((hour2 - hour1) / (1000 * 60 * 60)) +
              Math.floor(this.totalMinutes / 60);
          }
          const dec = ((this.fullMinutes / 60) % 1).toFixed(3);
          this.totalMinutes = Math.round(parseFloat(dec) * 60);
       
        })
      ).pipe(first()).subscribe();
    
  }
}
