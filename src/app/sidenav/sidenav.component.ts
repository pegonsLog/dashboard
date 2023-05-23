import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {
  //Links para adicionar
  day: string = 'day';
  hour: string = 'hour';
  donation: string = 'donation';
  employees: string = 'employees';
  users: string = 'users';
  search: string = 'search';

  //Variáveis para a consulta
  registrationSearch: string = '';
  yearSearch: string = '';
  typeSearch: string = '';
  modeSearch: string = '';

  @Output() searchOutput: EventEmitter<string> = new EventEmitter();
  @Output() type: EventEmitter<string> = new EventEmitter();
  // @Output() year: EventEmitter<string> = new EventEmitter();
  // @Output() mode: EventEmitter<string> = new EventEmitter();

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

     this.searchOutput.emit('search');

  }
}
