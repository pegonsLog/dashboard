import { Component } from '@angular/core';
import { HomeService } from './home.service';
import { Menu } from '../shared/models/Menu';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  menuName: Menu = {
    dayCreate: false,
    dayUpdate: false,
    dayList: false,
    hourCreate: false,
    hourUpdate: false,
    hourList: false,
    donationCreate: false,
    donationUpdate: false,
    donationList: false,
    employeeCreate: false,
    employeeUpdate: false,
    employeeList: false,
    userCreate: false,
    userUpdate: false,
    userList: false,
    search: false,
  };

  isOpened: boolean = true;

  titleName: string = 'ATESTADO DE DIA';

  registration: string = '';
  year: string = '';
  type: string = '';
  mode: string = '';
  typeCertificate: string = '';

  constructor(private homeService: HomeService) {}

  onType(type: string) {
    switch (type) {
      case 'dayCreate':
        this.menuName = this.homeService.dayCreate(true);
        break;
      case 'dayUpdate':
        this.menuName = this.homeService.dayUpdate(true);
        break;
      case 'dayList':
        this.menuName = this.homeService.dayList(true);
        break;
      case 'hourCreate':
        this.menuName = this.homeService.hourCreate(true);
        break;
      case 'hourUpdate':
        this.menuName = this.homeService.hourUpdate(true);
        break;
      case 'hourList':
        this.menuName = this.homeService.hourList(true);
        break;
      case 'donationCreate':
        this.menuName = this.homeService.donationCreate(true);
        break;
      case 'donationUpdate':
        this.menuName = this.homeService.donationUpdate(true);
        break;
      case 'donationList':
        this.menuName = this.homeService.donationList(true);
        break;
      case 'employeeCreate':
        this.menuName = this.homeService.employeeCreate(true);
        break;
      case 'employeeUpdate':
        this.menuName = this.homeService.employeeUpdate(true);
        break;
      case 'employeeList':
        this.menuName = this.homeService.employeeList(true);
        break;
      case 'userCreate':
        this.menuName = this.homeService.userCreate(true);
        break;
      case 'userUpdate':
        this.menuName = this.homeService.userUpdate(true);
        break;
      case 'userList':
        this.menuName = this.homeService.userList(true);
        break;
      default:
        this.menuName = this.homeService.dayCreate(true);
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
