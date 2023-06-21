import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  registrationSearch: string = '';
  yearSearch: string = '';
  typeSearch: string = '';
  modeSearch: string = '';

  searchDayType: string = 'dayList';
  searchHourType: string = 'hourList';
  searchDonationType: string = 'donationList';

  @Output() registration: EventEmitter<string> = new EventEmitter<string>();
  @Output() year: EventEmitter<string> = new EventEmitter<string>();
  @Output() typeName: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() mode: EventEmitter<string> = new EventEmitter<string>();

  constructor(private fb: FormBuilder, private router: Router) {
    this.yearSearch = '2023';
    this.typeSearch = 'Atestado de dia';
    this.modeSearch = 'Comparecimento';
  }

  onSearch(registration: string) {
    this.registration.emit(registration);
    this.year.emit(this.yearSearch);
    this.mode.emit(this.modeSearch);
    // switch(type){
    //   case 'Atestado de dia': this.type.emit(this.searchDayType);
    //   break;
    //   case 'Atestado de hora': this.type.emit(this.searchHourType);
    //   break;
    //   case 'Atestado de doação': this.type.emit(this.searchDonationType);
    //   break;
    // }
    this.typeName.emit([this.searchDayType, this.yearSearch, this.modeSearch, this.registrationSearch]);
  }

  onClear() {
    this.registrationSearch = '';
    this.yearSearch = '';
    this.typeSearch = '';
    this.modeSearch = '';
  }
}
