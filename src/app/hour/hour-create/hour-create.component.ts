import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CertificateService } from 'src/app/service-certificate/certificate.service';
import { Certificate } from 'src/app/shared/models/Certificate';

@Component({
  selector: 'app-hour-create',
  templateUrl: './hour-create.component.html',
  styleUrls: ['./hour-create.component.scss'],
})

export class HourCreateComponent {
  form: FormGroup;

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
    private certificateService: CertificateService
  ) {
    this.form = this.fb.group({
      registration: ['', Validators.required],
      startDay: ['', Validators.required],
      endDay: ['00/00/0000', Validators.required],
      startHour: ['', Validators.required],
      endHour: ['', Validators.required],
      dayOff: ['00/00/0000', Validators.required],
      type: ['', Validators.required],
      mode: ['', Validators.required],
    });
  }

  onClear() {
    this.form.reset();
  }

  addCertificateHour() {
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
      .addCertificate(this.certificateHour)
      .then(() => console.log('Deu Certo'))
      .catch(() => console.log('Deu erro'));
  }
}
