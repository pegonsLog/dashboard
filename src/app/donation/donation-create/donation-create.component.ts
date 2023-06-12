import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CertificateService } from 'src/app/service-certificate/certificate.service';
import { Certificate } from 'src/app/shared/models/Certificate';

@Component({
  selector: 'app-donation-create',
  templateUrl: './donation-create.component.html',
  styleUrls: ['./donation-create.component.scss'],
})
export class DonationCreateComponent {
  form: FormGroup;

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
    private certificateService: CertificateService
  ) {
    this.form = this.fb.group({
      registration: ['', Validators.required],
      startDay: ['', Validators.required],
      endDay: ['', Validators.required],
      startHour: ['00:00'],
      endHour: ['00:00'],
      dayOff: [''],
      type: ['', Validators.required],
      mode: ['', Validators.required],
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
    console.log(this.certificateDonation);
    return this.certificateService
      .certificateAdd(this.certificateDonation)
      .then(() => console.log('Deu Certo'))
      .catch(() => console.log('Deu erro'));
  }
}
