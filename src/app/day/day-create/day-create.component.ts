import { formatDate } from '@angular/common';
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { createMask } from '@ngneat/input-mask';
import { Subscription } from 'rxjs';
import { EmployeesService } from 'src/app/employees/employees.service';
import { CertificateService } from 'src/app/service-certificate/certificate.service';
import { DialogUpdatedComponent } from 'src/app/shared/dialogs/dialog-updated/dialog-updated.component';
import { Certificate } from 'src/app/shared/models/Certificate';
import { Employee } from 'src/app/shared/models/Employee';

@Component({
  selector: 'app-day-create',
  templateUrl: './day-create.component.html',
  styleUrls: ['./day-create.component.scss'],
})
export class DayCreateComponent implements OnDestroy {
  form: FormGroup;

  registrations: Employee[] = [];
  subscription: Subscription = new Subscription();
  @Output() typeList: EventEmitter<string> = new EventEmitter<string>();
  main: string = 'main';

  dateInputMask = createMask<Date>({
    alias: 'datetime',
    inputFormat: 'dd/mm/yyyy',
    formatter: (value: string) => {
      const values = value.split('-');
      const date = +values[2];
      const month = +values[1] - 1;
      const year = +values[0];
      return formatDate(new Date(year, month, date), 'dd/MM/yyyy', 'en-US');
    },
  });

  dateInput: number = 0;

  registration: string = '';
  year: string = '';
  type: string = '';
  mode: string = '';

  certificateDay: Certificate = {
    id: '',
    registration: '',
    startDay: new Date(),
    endDay: new Date(),
    startHour: new Date(),
    endHour: new Date(),
    dayOff: new Date(),
    type: '',
    mode: '',
  };

  constructor(
    private fb: FormBuilder,
    private certificateService: CertificateService,
    private employeesService: EmployeesService,
    public dialog: MatDialog
  ) {
    this.subscription = this.employeesService
      .list()
      .subscribe((data: Employee[]) => (this.registrations = data));
    this.form = this.fb.group({
      registration: ['', Validators.required],
      startDay: ['', Validators.required],
      endDay: ['', Validators.required],
      startHour: ['******************'],
      endHour: ['******************'],
      dayOff: ['******************'],
      type: ['Atestado de dia', Validators.required],
      mode: ['******************', Validators.required],
    });
  }

  onClear() {
    this.form.reset();
  }

  certificateDayAdd() {
    this.dateInput = new Date(this.form.value.startDay).getFullYear();

    this.certificateDay.registration = this.form.value.registration;
    this.certificateDay.startDay = this.form.value.startDay;
    this.certificateDay.endDay = this.form.value.endDay;
    this.certificateDay.startHour = this.form.value.startHour;
    this.certificateDay.endHour = this.form.value.endHour;
    this.certificateDay.dayOff = this.form.value.dayOff;
    this.certificateDay.type = this.form.value.type;
    this.certificateDay.mode = this.form.value.mode;
    return this.certificateService
      .certificateAdd(this.certificateDay)
      .then(() => {
        const dialogReference = this.dialog.open(DialogUpdatedComponent);
        this.subscription = dialogReference.afterClosed().subscribe();
        this.typeList.emit(this.main);
      })
      .catch(() => console.log('Deu erro'));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
