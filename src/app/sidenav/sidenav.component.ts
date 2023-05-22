import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {
  day: string = 'day';
  hour: string = 'hour';
  donation: string = 'donation';
  employees: string = 'employees';
  users: string = 'users';
  @Output() type: EventEmitter<string> = new EventEmitter();

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
}
