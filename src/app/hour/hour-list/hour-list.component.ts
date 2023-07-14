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
import { Observable, Subscription, map, toArray } from 'rxjs';
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

  certificates!: Certificate[];

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
    // "timing",
    'mode',
    'actions',
  ];

  constructor(
    private certificateService: CertificateService,
    public dialog: MatDialog
  ) {
    // this.dataSource$ = this.certificateService.list().pipe(
    //   map((data: Certificate[]) => {
    //     data
    //       .filter(
    //         (result: Certificate) =>
    //           this.searchListHour[0] === result.registration &&
    //           this.searchListHour[2] === result.type &&
    //           this.searchListHour[3] === result.mode &&
    //           this.searchListHour[1] === result.startDay.toString().substring(6)
    //       )
    //       .sort((a, b) =>
    //         b.startDay!.toString().localeCompare(a.startDay!.toString())
    //       );
    //   })
    // );
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
    this.certificateFilter();
  }

  certificateFilter() {
    this.subscription = this.certificateService
      .list()
      .pipe(
        map((data: Certificate[]) =>
          data.filter(
            (result: Certificate) =>
              this.searchListHour[0] === result.registration &&
              this.searchListHour[2] === result.type &&
              this.searchListHour[3] === result.mode &&
              this.searchListHour[1] === result.startDay.toString().substring(6)
          ))
        ).subscribe((data: Certificate[]) =>  this.listFor(data));
      
  
  }

  listFor(list: Certificate[]) {
    for (let data of list) {
      let miliseconds = this.timing(data.startHour, data.endHour);
      this.totalTiming += miliseconds;
    }
    const seconds = Math.floor(this.totalTiming / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const minutosRestantes = minutes % 60;
    this.timingFinal = `${hours}h ${minutosRestantes}m`;
  }

  timing(initialHour: Date, finalHour: Date) {
    const initialDate = new Date(`1970-01-01T${initialHour}09:00Z`);
    const finalDate = new Date(`1970-01-01T${finalHour}10:17Z`);

    // Calcular a diferença em milissegundos
    return differenceInMilliseconds(finalDate, initialDate);
  }
}
