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

  searchType: string = '';

  @Output() searchTypeName: EventEmitter<string[]> = new EventEmitter<
    string[]
  >();

  constructor() {
    this.yearSearch = '2023';
    this.typeSearch = 'Atestado de dia';
    this.modeSearch = 'Comparecimento';
  }

  onSearch(search: string) {
    switch (search) {
      case 'Atestado de dia':
        this.searchType = 'dayList';
        break;
      case 'Atestado de hora':
        this.searchType = 'hourList';
        break;
      case 'Atestado de doação':
        this.searchType = 'donationList';
        break;
    }
    this.searchTypeName.emit([
      this.registrationSearch,
      this.yearSearch,
      this.typeSearch,
      this.modeSearch,
      this.searchType,
    ]);
  }

  onClear() {
    this.registrationSearch = '';
    this.yearSearch = '';
    this.typeSearch = '';
    this.modeSearch = '';
  }
}
