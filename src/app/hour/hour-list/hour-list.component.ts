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

  totalHours: number = 0;
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
    this.acumulate();
  }

  acumulate() {
    let hourStart: number = 0;
    let minuteStart: number = 0;
    let hourEnd: number = 0;
    let minuteEnd: number = 0;
    let teste: number = 0;
    this.dataSource$
      .pipe(
        map((result: Certificate[]) => {
          for (let t of result) {

            const startH =  parseInt(t.startHour.toString().split(':')[0]);
            hourStart += startH;
            const startM = parseInt(t.startHour.toString().split(':')[1]);
            minuteStart += startM;
            const endH =  parseInt(t.endHour.toString().split(':')[0]);
            hourEnd += startH;
            const endM = parseInt(t.endHour.toString().split(':')[1]);
            minuteEnd += startM;
          }

        this.totalHours = (hourEnd + (Math.floor(minuteEnd/60))) - (hourStart + (Math.floor(minuteStart/60)));
        this.totalMinutes = minuteEnd%60 - minuteStart%60;
        console.log(teste);

        })
      )
      .subscribe();
  }
}
