import { Component, EventEmitter, Output } from '@angular/core';

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

  constructor() {
    this.yearSearch = '2023';
    this.typeSearch = 'Atestado de dia';
    this.modeSearch = 'Comparecimento';
  }

  onSearch() {
    this.typeName.emit([this.searchDayType, this.yearSearch, this.modeSearch, this.registrationSearch, this.typeSearch]);
  }

  onClear() {
    this.registrationSearch = '';
    this.yearSearch = '';
    this.typeSearch = '';
    this.modeSearch = '';
  }
}
