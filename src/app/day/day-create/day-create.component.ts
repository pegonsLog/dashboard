import { Component } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Certificate } from 'src/app/shared/models/Certificate';

@Component({
  selector: 'app-day-create',
  templateUrl: './day-create.component.html',
  styleUrls: ['./day-create.component.scss'],
})
export class DayCreateComponent {
  form: FormGroup;

  form: FormGroup;

  certificateDay: Certificate = {
    id: '',
    registration:  '',
    startDay: new Date(),
    endDay: new Date(),
    startHour: new Date(),
    endHour: new Date(),
    dayOff: new Date(),
    type: '',
    mode: ''}

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      registration: ['564', Validators.required],
      startDay: ['23/01/2023', Validators.required],
      endDay: ['23/01/2023', Validators.required],
      startHour: [this.certificateDay.registration, Validators.required],
      dayOff: [this.certificateDay.registration, Validators.required],
      type: ['Atestado de dia', Validators.required],
      mode: [this.certificateDay.registration, Validators.required],


    });
  }

  onClear() {}
  addCertificateDay() {
    this.certificateDay.registration = this.form.value.registration;
    console.log(this.certificateDay.registration)
  }

  onClear() {}
  onSubmit() {}
}
