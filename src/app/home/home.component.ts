import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CertificateService } from '../service-certificate/certificate.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  form: FormGroup;
  menuName: string[] = [
    'dayCreate',
    'dayUpdate',
    'dayList',
    'hourCreate',
    'hourUpdate',
    'hourList',
    'donationCreate',
    'donationUpdate',
    'donationList',
    'employeeCreate',
    'employeeUpdate',
    'employeeList',
    'userCreate',
    'userUpdate',
    'userList',
    'search',
    '',
  ];

  typeName: string = '';
  isOpened: boolean = true;

  titleName: string = 'ATESTADO DE DIA';

  @Input() registration: string = '';
  @Input() year: string = '';
  @Input() type: string = '';
  @Input() mode: string = '';

  registrationSearch: string = '';
  yearSearch: string = '';
  modeSearch: string = '';
  typeSearch: string = '';

  @Output() registrationEmit: EventEmitter<any> = new EventEmitter<any>();
  // @Output() yearEmit: EventEmitter<any> = new EventEmitter<any>();
  // @Output() typeEmit: EventEmitter<any> = new EventEmitter<any>();
  // @Output() modeEmit: EventEmitter<any> = new EventEmitter<any>();

  day: string = 'dayCreate';
  dayUpdate: string = 'dayUpdate';
  dayList: string = 'dayList';
  hour: string = 'hourCreate';
  hourUpdate: string = 'hourUpdate';
  hourList: string = 'hourList';
  donation: string = 'donationCreate';
  donationUpdate: string = 'donationUpdate';
  donationList: string = 'donationList';
  employees: string = 'employeeList';
  users: string = 'userList';
  search: string = 'search';

  dataSource$: Observable<any> | undefined;

  constructor(
    private fb: FormBuilder,
    private certificateService: CertificateService
  ) {
    this.form = this.fb.group({
      registrationSearch: ['', Validators.required],
      yearSearch: ['2023', Validators.required],
      modeSearch: ['Comparecimento', Validators.required],
      typeSearch: ['Atestado de dia', Validators.required],
    });
  }

  onType(type: any) {
    if (this.menuName[0] === type) {
      this.typeName = 'dayCreate';
    }
    if (this.menuName[1] === type) {
      this.typeName = 'dayUpdate';
    }
    if (this.menuName[2] === type) {
      this.typeName = 'dayList';

    }
    if (this.menuName[3] === type) {
      this.typeName = 'hourCreate';
    }
    if (this.menuName[4] === type) {
      this.typeName = 'hourUpdate';
    }
    if (this.menuName[5] === type) {
      this.typeName = 'hourList';
    }
    if (this.menuName[6] === type) {
      this.typeName = 'donationCreate';
    }
    if (this.menuName[7] === type) {
      this.typeName = 'donationUpdate';
    }
    if (this.menuName[8] === type) {
      this.typeName = 'donationList';
    }
    if (this.menuName[9] === type) {
      this.typeName = 'employeeCreate';
    }
    if (this.menuName[10] === type) {
      this.typeName = 'employeeUpdate';
    }
    if (this.menuName[11] === type) {
      this.typeName = 'employeeList';
    }
    if (this.menuName[12] === type) {
      this.typeName = 'userCreate';
    }
    if (this.menuName[13] === type) {
      this.typeName = 'userUpdate';
    }
    if (this.menuName[14] === type) {
      this.typeName = 'userList';
    }
    if (this.menuName[15] === type) {
      this.typeName = 'search';
    }
  }

  onYear(year: any) {
    this.year = year;
  }
  onMode(mode: any) {
    this.mode = mode;
  }
  onRegistration(registration: string) {
    this.registration = registration;
    console.log(this.registration);
  }
  onOpened() {
    this.isOpened = !this.isOpened;
  }
  onListUsers(users: string) {
    this.titleName = 'USUÁRIOS CADASTRADOS';
    this.onType(users);
  }
  onListEmployees(employees: string) {
    this.titleName = 'FUNCIONÁRIOS CADASTRADOS';
    this.onType(employees);
  }
  onDonation(donation: string) {
    this.titleName = 'ATESTADO DE DOAÇÃO';
    this.onType(donation);
  }
  onHour(hour: string) {
    this.titleName = 'ATESTADO DE HORA';
    this.onType(hour);
  }
  onDay(day: string) {
    this.titleName = 'ATESTADO DE DIA';
    this.onType(day);
  }
  onDayList(dayList: any) {
    this.titleName = 'LISTA DE ATESTADOS';
    this.registrationEmit.emit(this.day)
    this.onType(dayList[0]);
  }
  onSearch(search: string) {
    this.titleName = 'CONSULTA';
    this.onType(search);
  }

  // onSearch() {
  //     if (this.form.value.type === 'Atestado de dia') {
  //       this.titleName = 'ATESTADO DE DIA';
  //       this.onType(this.dayList);
  // this.registration = this.form.value.registrationSearch

  //       // this.registrationEmit.emit(this.form.value.registration);
  //       // this.yearEmit.emit(this.yearSearch);
  //       // this.typeEmit.emit(this.typeSearch);
  //       // this.modeEmit.emit(this.modeSearch);

  //     }
  //     if (this.typeSearch === 'Atestado de hora') {
  //       this.titleName = 'ATESTADO DE HORA';
  //       this.onType(this.hourList);
  //     }
  //     if (this.typeSearch === 'Atestado de doação') {
  //       this.titleName = 'ATESTADO DE DOAÇÃO';
  //       this.onType(this.donationList);
  //     }
  // }
}
