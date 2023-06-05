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
  dayList: string = 'dayList';
  hour: string = 'hourCreate';
  hourList: string = 'hourList';
  donation: string = 'donationCreate';
  donationList: string = 'donationList';
  employees: string = 'employeeList';
  users: string = 'userList';
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
    if(this.typeSearch === 'Atestado de dia'){
      this.type.emit(this.dayList);
    }
    if(this.typeSearch === 'Atestado de hora'){
      this.type.emit(this.hourList);
    }
    if(this.typeSearch === 'Atestado de doação'){
      this.type.emit(this.donationList);
    }
    this.registration.emit(this.registrationSearch);
    this.year.emit(this.yearSearch);
    this.mode.emit(this.modeSearch);
  }
}
