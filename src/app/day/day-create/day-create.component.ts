import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Certificate } from 'src/app/shared/models/Certificate';

@Component({
  selector: 'app-day-create',
  templateUrl: './day-create.component.html',
  styleUrls: ['./day-create.component.scss'],
})
export class DayCreateComponent {
  form: FormGroup;

  certificate: Certificate = {
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

  constructor() {
    this.form = new FormGroup({
      registration: new FormControl('', Validators.required),
      startDay: new FormControl('', Validators.required),
      endDay: new FormControl('', Validators.required),
      startHour: new FormControl('', Validators.required),
      endHour: new FormControl('', Validators.required),
      dayOff: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      mode: new FormControl('', Validators.required),
    });
  }

  onClear() {}
  onSubmit() {}
}
