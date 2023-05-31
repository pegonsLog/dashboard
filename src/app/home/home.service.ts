import { Injectable } from '@angular/core';
import { Menu } from '../shared/models/Menu';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
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

  titleName: string = 'ATESTADO DE DIA';

  constructor() {}

  dayCreate(type: boolean) {
    this.menuName.dayCreate = type;
    return this.menuName;
  }
  dayUpdate(type: boolean) {
    this.menuName.dayUpdate = type;
    return this.menuName;
  }
  dayList(type: boolean) {
    this.menuName.dayList = type;
    return this.menuName;
  }

  hourCreate(type: boolean) {
    this.menuName.hourCreate = type;
    return this.menuName;
  }
  hourUpdate(type: boolean) {
    this.menuName.hourUpdate = type;
    return this.menuName;
  }
  hourList(type: boolean) {
    this.menuName.hourList = type;
    return this.menuName;
  }

  donationCreate(type: boolean) {
    this.menuName.donationCreate = type;
    return this.menuName;
  }
  donationUpdate(type: boolean) {
    this.menuName.donationUpdate = type;
    return this.menuName;
  }
  donationList(type: boolean) {
    this.menuName.donationList = type;
    return this.menuName;
  }

  employeeCreate(type: boolean) {
    this.menuName.employeeCreate = type;
    return this.menuName;
  }
  employeeUpdate(type: boolean) {
    this.menuName.employeeUpdate = type;
    return this.menuName;
  }
  employeeList(type: boolean) {
    this.menuName.employeeList = type;
    return this.menuName;
  }

  userCreate(type: boolean) {
    this.menuName.userCreate = type;
    return this.menuName;
  }
  userUpdate(type: boolean) {
    this.menuName.userUpdate = type;
    return this.menuName;
  }
  userList(type: boolean) {
    this.menuName.userList = type;
    return this.menuName;
  }

  search(type: boolean) {
    this.menuName.search = type;
    return this.menuName;
  }
}

// }

// onType(option: string) {
//   if (option === 'dayCreate') {
//     this.isHour = false;
//     this.isDonation = false;
//     this.isEmployees = false;
//     this.isUsers = false;
//     this.isSearch = false;
//     this.isDayCreate = true;
//     this.titleName = 'ATESTADO DE DIA';
//   }
//   if (option === 'dayUpdate') {
//     this.isHour = false;
//     this.isDonation = false;
//     this.isEmployees = false;
//     this.isUsers = false;
//     this.isSearch = false;
//     this.isDayCreate = true;
//     this.titleName = 'ATESTADO DE DIA';
//   }
//   if (option === 'dayList') {
//     this.isHour = false;
//     this.isDonation = false;
//     this.isEmployees = false;
//     this.isUsers = false;
//     this.isSearch = false;
//     this.isDayCreate = true;
//     this.titleName = 'ATESTADO DE DIA';
//   }
//   if (option === 'hour') {
//     this.isDayCreate = false;
//     this.isDonation = false;
//     this.isEmployees = false;
//     this.isUsers = false;
//     this.isSearch = false;
//     this.isHour = true;
//     this.titleName = 'ATESTADO DE HORA';
//   }
//   if (option === 'donation') {
//     this.isDayCreate = false;
//     this.isHour = false;
//     this.isEmployees = false;
//     this.isUsers = false;
//     this.isSearch = false;
//     this.isDonation = true;
//     this.titleName = 'ATESTADO DE DOAÇÃO DE SANGUE';
//   }
//   if (option === 'employees') {
//     this.isDayCreate = false;
//     this.isHour = false;
//     this.isDonation = false;
//     this.isUsers = false;
//     this.isSearch = false;
//     this.isEmployees = true;
//     this.titleName = 'CADASTRO';
//   }
//   if (option === 'users') {
//     this.isDayCreate = false;
//     this.isHour = false;
//     this.isDonation = false;
//     this.isEmployees = false;
//     this.isSearch = false;
//     this.isUsers = true;
//     this.titleName = 'ADMINISTRAÇÃO';
//   }

//   if (option === 'search') {
//     this.isDayCreate = false;
//     this.isHour = false;
//     this.isDonation = false;
//     this.isEmployees = false;
//     this.isUsers = false;
//     this.isSearch = true;
//     this.titleName = 'CONSULTA';
//   }
