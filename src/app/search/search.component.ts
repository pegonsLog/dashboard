import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  // form: FormGroup;

  registrationSearch: string = '';
  yearSearch: string = '';
  typeSearch: string = '';
  modeSearch: string = '';

  searchDayList: string = 'dayList';
  @Output() registratrion: EventEmitter<string> = new EventEmitter<string>();
  @Output() year: EventEmitter<string> = new EventEmitter<string>();
  @Output() type: EventEmitter<string> = new EventEmitter<string>();
  @Output() mode: EventEmitter<string> = new EventEmitter<string>();

  constructor(private fb: FormBuilder, private router: Router) {
    this.yearSearch = '2023';
    this.typeSearch = 'Atestado de dia';
    this.modeSearch = 'Comparecimento';
  }
  onSearch() {
    this.registratrion.emit(this.registrationSearch);
    this.type.emit(this.typeSearch);
    this.year.emit(this.yearSearch);
    this.mode.emit(this.modeSearch);
  }

  onClear() {
    this.registrationSearch = '';
    this.yearSearch = '';
    this.typeSearch = '';
    this.modeSearch = '';
  }
}
