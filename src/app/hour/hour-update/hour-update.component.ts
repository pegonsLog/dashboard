import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CertificateService } from 'src/app/service-certificate/certificate.service';
import { DialogUpdatedComponent } from 'src/app/shared/dialogs/dialog-updated/dialog-updated.component';
import { Certificate } from 'src/app/shared/models/Certificate';

@Component({
  selector: 'app-hour-update',
  templateUrl: './hour-update.component.html',
  styleUrls: ['./hour-update.component.scss'],
})
export class HourUpdateComponent implements OnInit, OnDestroy {
  form!: FormGroup;

  subscription: Subscription = new Subscription();

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
    public dialog: MatDialog
  ) {}

  onClear() {
    this.form.reset();
  }

  certificateHourUpdate() {
    const dateInput = new Date(this.form.value.startDay);

    this.certificateHour.registration = this.form.value.registration;
    this.certificateHour.startDay = this.form.value.startDay;
    this.certificateHour.endDay = this.form.value.endDay;
    this.certificateHour.startHour = this.form.value.startHour;
    this.certificateHour.endHour = this.form.value.endHour;
    this.certificateHour.dayOff = this.form.value.dayOff;
    this.certificateHour.type = this.form.value.type;
    this.certificateHour.mode = this.form.value.mode;
    this.certificateHour.year = dateInput.getFullYear();
    return this.certificateService
      .update(this.certificateHour, this.certificateHour.id)
      .then(() => {
        const dialogReference = this.dialog.open(DialogUpdatedComponent);
        this.subscription = dialogReference.afterClosed().subscribe();
        this.typeList.emit(this.main)})
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
