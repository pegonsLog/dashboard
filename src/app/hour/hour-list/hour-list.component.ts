import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription, map, take, tap, toArray } from 'rxjs';
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
              b.startDay!.toString().localeCompare(a.startDay!.toString())
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
    // let totalTiming: number = 0;
    // let initialHour: number = 0;
    // let finalHour: number = 0;
    // let initialMinute: number = 0;
    // let finalMinute: number = 0;
    // this.dataSource$.pipe(
    //   map((result: Certificate[]) => {
    //     for (let certificate of result) {
    //       initialHour += new Date(
    //         `1970-01-01T${certificate.startHour}Z`
    //       ).getTime();
    //       initialMinute += new Date(
    //         `1970-01-01T${certificate.startHour}Z`
    //       ).getMinutes();
    //       finalHour += new Date(`1970-01-01T${certificate.endHour}Z`).getHours();
    //       finalMinute += new Date(`1970-01-01T${certificate.endHour}Z`).getMinutes();
    //       //totalTiming +=
    //     }
    //  console.log( differenceInMilliseconds(finalDate, initialDate));
    // const seconds = Math.floor(totalTiming / 1000);
    // this.minutes = Math.floor(seconds / 60);
    // this.hours = Math.floor(this.minutes / 60);
    // this.minutes = this.minutes % 60;
    // this.hours = Math.floor(this.minutes / 60)
    //   })
    // )
    // console.log(initialHour);
    // console.log(initialMinute);
    // console.log(finalHour);
    // console.log(finalMinute);
  }
  acumulate() {
    let hours: number = 0;
    let minutes: number = 0;
    this.dataSource$
      .pipe(
        map((result: Certificate[]) => {
          for (let t of result) {
            const h = parseInt(t.startHour.toString().split(':')[0]);
            hours += h;
            const m = parseInt(t.startHour.toString().split(':')[1]);
            minutes += m;
          }

        const totalHours = hours + minutes/60;
          console.log(hours, ":", minutes);
        })
      )
      .subscribe();
  }
}
