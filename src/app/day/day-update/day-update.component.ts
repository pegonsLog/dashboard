import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
export class DayUpdateComponent implements OnInit, OnDestroy {
  form!: FormGroup;

  registrations: Employee[] = [];
  subscription: Subscription = new Subscription();

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
    status: '',
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

  certificateDayUpdate() {

    this.certificateDay.id = this.form.value.id;
    this.certificateDay.registration = this.form.value.registration;
    this.certificateDay.startDay = this.form.value.startDay;
    this.certificateDay.endDay = this.form.value.endDay;
    this.certificateDay.startHour = this.form.value.startHour;
    this.certificateDay.endHour = this.form.value.endHour;
    this.certificateDay.dayOff = this.form.value.dayOff;
    this.certificateDay.type = this.form.value.type;
    this.certificateDay.mode = this.form.value.mode;
    if (
      this.certificateDay.registration !== '' &&
      this.certificateDay.startDay.toString() !== '' &&
      this.certificateDay.endDay.toString() !== ''
    ) {
     this.certificateService
        .update(this.certificateDay, this.certificateDay.id)
        .then(() => {
          this.typeList.emit(this.main);
          const dialogReference = this.dialog.open(DialogUpdatedComponent);
          this.subscription = dialogReference.afterClosed().subscribe();
          })
        .catch(() => console.log('Deu erro'));
    }
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
      type: [this.certificateUpdate.type, Validators.required],
      mode: [this.certificateUpdate.mode, Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
