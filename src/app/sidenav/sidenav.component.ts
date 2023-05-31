import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {
  //Links para adicionar
  day: string = 'dayCreate';
  hour: string = 'hourCreate';
  donation: string = 'donationCreate';
  employees: string = 'employeesList';
  users: string = 'usersList';
  search: string = 'search';

  //Variáveis para a consulta
  registrationSearch: string = '';
  yearSearch: string = '';
  typeSearch: string = '';
  modeSearch: string = '';

  @Output() registration: EventEmitter<string> = new EventEmitter<string>();
  @Output() type: EventEmitter<string> = new EventEmitter<string>();
  @Output() year: EventEmitter<string> = new EventEmitter<string>();
  @Output() mode: EventEmitter<string> = new EventEmitter<string>();
  @Output() typeCertificate: EventEmitter<string> = new EventEmitter<string>();

  constructor(private route: Router) {}
  onDay() {
    this.type.emit(this.day);
  }
  onHour() {
    this.type.emit(this.hour);
  }
  onDonation() {
    this.type.emit(this.donation);
  }
  onListEmployees() {
    this.type.emit(this.employees);
  }
  onListUsers() {
    this.type.emit(this.users);
  }
  onSearch() {

    this.type.emit(this.search);
    this.typeCertificate.emit(this.typeSearch);
    this.registration.emit(this.registrationSearch);
    this.year.emit(this.yearSearch);
    this.mode.emit(this.modeSearch);
  }
}
