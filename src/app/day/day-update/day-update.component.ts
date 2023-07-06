import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { EmployeesService } from 'src/app/employees/employees.service';
import { CertificateService } from 'src/app/service-certificate/certificate.service';
import { DialogUpdatedComponent } from 'src/app/shared/dialogs/dialog-updated/dialog-updated.component';
import { Certificate } from 'src/app/shared/models/Certificate';
import { Employee } from 'src/app/shared/models/Employee';

@Component({
  selector: 'app-day-update',
  templateUrl: './day-update.component.html',
  styleUrls: ['./day-update.component.scss'],
})
export class DayUpdateComponent implements OnInit {
  form!: FormGroup;

  registrations: Employee[] = [];
  subscription: Subscription = new Subscription();

  // dateInputMask = createMask<Date>({
  //   alias: 'datetime',
  //   inputFormat: 'dd/mm/yyyy',
  //   formatter: (value: string) => {
  //     const values = value.split('-');
  //     const date = +values[2];
  //     const month = +values[1] - 1;
  //     const year = +values[0];
  //     return formatDate(new Date(year, month, date), 'dd/MM/yyyy', 'en-US');
  //   },
  // });

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
    year: 0,
  };

  @Output() typeList: EventEmitter<string> = new EventEmitter<string>();
  main: string = 'main';

  @Input() certificateUpdate: Certificate = {
    id: '',
    registration: '',
    startDay: new Date(),
    endDay: new Date(),
    startHour: new Date(),
    endHour: new Date(),
    dayOff: new Date(),
    type: '',
    mode: '',
    year: 0,
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
  }

  onClear() {
    this.form.reset();
  }

  certificateDayUpdate() {
    const dateInput = new Date(this.form.value.startDay);
    const year = dateInput.getFullYear();

    this.certificateDay.id = this.form.value.id;
    this.certificateDay.registration = this.form.value.registration;
    this.certificateDay.startDay = this.form.value.startDay;
    this.certificateDay.endDay = this.form.value.endDay;
    this.certificateDay.startHour = this.form.value.startHour;
    this.certificateDay.endHour = this.form.value.endHour;
    this.certificateDay.dayOff = this.form.value.dayOff;
    this.certificateDay.type = this.form.value.type;
    this.certificateDay.mode = this.form.value.mode;
    this.certificateDay.year = year;
    return this.certificateService
      .update(this.certificateDay, this.certificateDay.id)
      .then(() => {
        const dialogReference = this.dialog.open(DialogUpdatedComponent);
        this.subscription = dialogReference.afterClosed().subscribe();
        this.typeList.emit(this.main);
      })
      .catch(() => console.log('Deu erro'));
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.certificateUpdate.id],
      registration: [this.certificateUpdate.registration, Validators.required],
      startDay: [this.certificateUpdate.startDay, Validators.required],
      endDay: [this.certificateUpdate.endDay, Validators.required],
      startHour: [this.certificateUpdate.startHour, Validators.required],
      endHour: [this.certificateUpdate.endHour, Validators.required],
      dayOff: [this.certificateUpdate.dayOff, Validators.required],
      year: [this.certificateUpdate.year, Validators.required],
      type: [this.certificateUpdate.type, Validators.required],
      mode: [this.certificateUpdate.mode, Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
