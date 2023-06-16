import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  form: FormGroup;

  searchDayList: string = 'dayList';
  @Output() type: EventEmitter<string> = new EventEmitter<string>();

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      registration: ['', Validators.required],
      year: ['2023', Validators.required],
      type: ['Atestado de dia', Validators.required],
      mode: ['Comparecimento', Validators.required],
    });
  }

  onSearch() {
    console.log(this.form.getRawValue());
    this.type.emit(this.searchDayList);
  }

  onClear() {
    this.form.reset();
  }
}
