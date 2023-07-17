import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { differenceInMilliseconds } from 'date-fns';
import { Observable, Subscription, map, of } from 'rxjs';
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
  dataSource$!: Observable<any>;

  certificates!: Observable<any>;

  certificateUpdate: string = 'hourUpdate';

  totalTiming: number = 0;
  timingFinal: string = '';

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
    this.subscription = this.certificateService
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
      )
      .subscribe((result: any) => {this.certificates = of(result), this.dataSource$ = of(result)});
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
    // for (let certificate of this.certificates) {
    //   this.totalTiming += this.timing(
    //     certificate.startHour,
    //     certificate.endHour
    //   );

    // }
    // const seconds = Math.floor(this.totalTiming / 1000);
    // const minutes = Math.floor(seconds / 60);
    // const hours = Math.floor(minutes / 60);

    // const minutosRestantes = minutes % 60;
    // this.timingFinal = `${hours}h ${minutosRestantes}m`;

    this.certificates.subscribe((result) => console.log(result));
  }

  timing(initialHour: Date, finalHour: Date) {
    const initialDate = new Date(`1970-01-01T${initialHour}09:00Z`);
    const finalDate = new Date(`1970-01-01T${finalHour}10:17Z`);
    return differenceInMilliseconds(finalDate, initialDate);
  }
}
