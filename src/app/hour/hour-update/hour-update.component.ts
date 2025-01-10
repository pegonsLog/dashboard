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
    public dialog: MatDialog
  ) {}

  certificateHourUpdate() {

    this.certificateUpdate.id = this.form.value.id;
    this.certificateUpdate.registration = this.form.value.registration;
    this.certificateUpdate.startDay = this.form.value.startDay;
    this.certificateUpdate.endDay = this.form.value.endDay;
    this.certificateUpdate.startHour = this.form.value.startHour;
    this.certificateUpdate.endHour = this.form.value.endHour;
    this.certificateUpdate.dayOff = this.form.value.dayOff;
    this.certificateUpdate.type = this.form.value.type;
    this.certificateUpdate.mode = this.form.value.mode;
    if (
      this.certificateUpdate.registration !== '' &&
      this.certificateUpdate.startDay.toString() !== '' &&
      this.certificateUpdate.startHour.toString() !== '' &&
      this.certificateUpdate.endHour.toString()
    ) {
     this.certificateService
        .update(this.certificateUpdate, this.certificateUpdate.id)
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
