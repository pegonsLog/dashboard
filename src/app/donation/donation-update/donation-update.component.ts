import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CertificateService } from 'src/app/service-certificate/certificate.service';
import { DialogUpdatedComponent } from 'src/app/shared/dialogs/dialog-updated/dialog-updated.component';
import { Certificate } from 'src/app/shared/models/Certificate';

@Component({
  selector: 'app-donation-update',
  templateUrl: './donation-update.component.html',
  styleUrls: ['./donation-update.component.scss']
})
export class DonationUpdateComponent {
  form!: FormGroup;

  subscription: Subscription = new Subscription();

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
    year: 0
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
  ) { }

  onClear() {
    this.form.reset();
  }

  certificateDonationUpdate() {
    const dateInput = new Date(this.form.value.startDay);

    this.certificateDonation.registration = this.form.value.registration;
    this.certificateDonation.startDay = this.form.value.startDay;
    this.certificateDonation.endDay = this.form.value.endDay;
    this.certificateDonation.startHour = this.form.value.startHour;
    this.certificateDonation.endHour = this.form.value.endHour;
    this.certificateDonation.dayOff = this.form.value.dayOff;
    this.certificateDonation.type = this.form.value.type;
    this.certificateDonation.mode = this.form.value.mode;
    this.certificateDonation.year = dateInput.getFullYear();
    return this.certificateService
      .update(this.certificateDonation, this.certificateDonation.id)
      .then(() => {
        const dialogReference = this.dialog.open(DialogUpdatedComponent);
        this.subscription = dialogReference.afterClosed().subscribe();
        this.typeList.emit(this.main)})
      .catch(() => console.log('Deu erro'));
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.certificateDonation.id],
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
}
