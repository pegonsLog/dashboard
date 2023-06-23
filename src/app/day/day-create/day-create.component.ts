import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CertificateService } from 'src/app/service-certificate/certificate.service';
import { Certificate } from 'src/app/shared/models/Certificate';

@Component({
  selector: 'app-day-create',
  templateUrl: './day-create.component.html',
  styleUrls: ['./day-create.component.scss'],
})
export class DayCreateComponent {
  form: FormGroup;

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
    private certificateService: CertificateService
  ) {
    this.form = this.fb.group({
      registration: ['', Validators.required],
      startDay: ['', Validators.required],
      endDay: ['', Validators.required],
      startHour: ['00:00'],
      endHour: ['00:00'],
      dayOff: ['00/00/0000'],
      type: ['', Validators.required],
      mode: ['', Validators.required],
    });
  }

  onClear() {
    this.form.reset();
  }

  certificateDayAdd() {
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
      .then(() => console.log('Deu Certo'))
      .catch(() => console.log('Deu erro'));
  }

  registrationOutput(event: any) {
    console.log(event);
  }
}
