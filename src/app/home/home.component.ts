import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  isDay: boolean = true;
  isHour: boolean = false;
  isDonation: boolean = false;
  isEmployees: boolean = false;
  isUsers: boolean = false;
  isSearch: boolean = false;
  isOpened: boolean = true;

  registration: string = '';
  year: string = '';
  type: string = '';
  mode: string = '';
  typeCertificate: string = '';

  titleName: string = 'ATESTADO DE DIA';

  onType(option: string) {
    if (option === 'day') {
      this.isHour = false;
      this.isDonation = false;
      this.isEmployees = false;
      this.isUsers = false;
      this.isSearch = false;
      this.isDay = true;
      this.titleName = 'ATESTADO DE DIA';
    }
    if (option === 'hour') {
      this.isDay = false;
      this.isDonation = false;
      this.isEmployees = false;
      this.isUsers = false;
      this.isSearch = false;
      this.isHour = true;
      this.titleName = 'ATESTADO DE HORA';
    }
    if (option === 'donation') {
      this.isDay = false;
      this.isHour = false;
      this.isEmployees = false;
      this.isUsers = false;
      this.isSearch = false;
      this.isDonation = true;
      this.titleName = 'ATESTADO DE DOAÇÃO DE SANGUE';
    }
    if (option === 'employees') {
      this.isDay = false;
      this.isHour = false;
      this.isDonation = false;
      this.isUsers = false;
      this.isSearch = false;
      this.isEmployees = true;
      this.titleName = 'CADASTRO';
    }
    if (option === 'users') {
      this.isDay = false;
      this.isHour = false;
      this.isDonation = false;
      this.isEmployees = false;
      this.isSearch = false;
      this.isUsers = true;
      this.titleName = 'ADMINISTRAÇÃO';
    }

    if (option === 'search') {
      this.isDay = false;
      this.isHour = false;
      this.isDonation = false;
      this.isEmployees = false;
      this.isUsers = false;
      this.isSearch = true;
      this.titleName = 'CONSULTA';
    }

  }

  onOpened() {
    this.isOpened = !this.isOpened;
  }
  onYear(year: any) {
    this.year = year;
  }
  onMode(mode: any) {
    this.mode = mode;
  }
  onRegistration(registration: any) {
    this.registration = registration;
  }
  onTypeCertificate(typeCertificate: any) {
    this.typeCertificate = typeCertificate;
  }
}
