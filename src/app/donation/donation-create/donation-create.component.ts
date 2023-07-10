import { formatDate } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { createMask } from '@ngneat/input-mask';
import { Subscription } from 'rxjs';
import { EmployeesService } from 'src/app/employees/employees.service';
import { CertificateService } from 'src/app/service-certificate/certificate.service';
import { DialogUpdatedComponent } from 'src/app/shared/dialogs/dialog-updated/dialog-updated.component';
import { Certificate } from 'src/app/shared/models/Certificate';
import { Employee } from 'src/app/shared/models/Employee';

@Component({
  selector: 'app-donation-create',
  templateUrl: './donation-create.component.html',
  styleUrls: ['./donation-create.component.scss'],
})
export class DonationCreateComponent {
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

  subscription: Subscription = new Subscription();

  @Output() typeList: EventEmitter<string> = new EventEmitter<string>();
  main: string = 'main';

  certificateDonation: Certificate = {
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
  ){
    this.subscription = this.employeesService
    .list()
    .subscribe((data: Employee[]) => (this.registrations = data));
    this.form = this.fb.group({
      registration: ['', Validators.required],
      startDay: ['', Validators.required],
      endDay: ['******************'],
      startHour: ['******************'],
      endHour: ['******************'],
      dayOff: [''],
      type: ['Atestado de doação'],
      mode: ['******************', Validators.required],
    });
  }

  onClear() {
    this.form.reset();
  }

  certificateDonationAdd() {

    this.certificateDonation.registration = this.form.value.registration;
    this.certificateDonation.startDay = this.form.value.startDay;
    this.certificateDonation.endDay = this.form.value.endDay;
    this.certificateDonation.startHour = this.form.value.startHour;
    this.certificateDonation.endHour = this.form.value.endHour;
    this.certificateDonation.dayOff = this.form.value.dayOff;
    this.certificateDonation.type = this.form.value.type;
    this.certificateDonation.mode = this.form.value.mode;
    return this.certificateService
      .certificateAdd(this.certificateDonation)
      .then(() => {
        const dialogReference = this.dialog.open(DialogUpdatedComponent);
        this.subscription = dialogReference.afterClosed().subscribe();
        this.typeList.emit(this.main)})
      .catch(() => console.log('Deu erro'));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
