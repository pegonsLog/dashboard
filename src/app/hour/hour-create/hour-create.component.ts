import { formatDate } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { createMask } from '@ngneat/input-mask';
import { Subscription } from 'rxjs';
import { EmployeesService } from 'src/app/employees/employees.service';
import { CertificateService } from 'src/app/service-certificate/certificate.service';
import { DialogCreatedComponent } from 'src/app/shared/dialogs/dialog-created/dialog-created.component';
import { DialogUpdatedComponent } from 'src/app/shared/dialogs/dialog-updated/dialog-updated.component';
import { Certificate } from 'src/app/shared/models/Certificate';
import { Employee } from 'src/app/shared/models/Employee';

@Component({
  selector: 'app-hour-create',
  templateUrl: './hour-create.component.html',
  styleUrls: ['./hour-create.component.scss'],
})
export class HourCreateComponent {
  form: FormGroup;
  registrations: Employee[] = [];

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
  hourInputMask = createMask<Date>({
    alias: 'datetime',
    inputFormat: 'HH:MM',
    formatter: (value: string) => {
      const values = value.split(':');
      const hour = +values[2];
      const minute = +values[2];
      return formatDate(new Date(hour, minute), 'hh:mm', 'en-US');
    },
  });

  subscription: Subscription = new Subscription();

  @Output() typeList: EventEmitter<string> = new EventEmitter<string>();
  main: string = 'main';

  certificateHour: Certificate = {
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
      endDay: ['******************', Validators.required],
      startHour: ['', Validators.required],
      endHour: ['', Validators.required],
      dayOff: ['******************', Validators.required],
      type: ['Atestado de hora', Validators.required],
      mode: ['', Validators.required],
    });
  }

  onClear() {
    this.form.reset();
  }

  certificateHourAdd() {

    this.certificateHour.registration = this.form.value.registration;
    this.certificateHour.startDay = this.form.value.startDay;
    this.certificateHour.endDay = this.form.value.endDay;
    this.certificateHour.startHour = this.form.value.startHour;
    this.certificateHour.endHour = this.form.value.endHour;
    this.certificateHour.dayOff = this.form.value.dayOff;
    this.certificateHour.type = this.form.value.type;
    this.certificateHour.mode = this.form.value.mode;
    console.log(this.certificateHour);
    return this.certificateService
      .certificateAdd(this.certificateHour)
      .then(() => {
        const dialogReference = this.dialog.open(DialogCreatedComponent);
        this.subscription = dialogReference.afterClosed().subscribe();
        this.typeList.emit(this.main)})
      .catch(() => console.log('Deu erro'));
  }
}
