import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, filter, map } from 'rxjs';
import { EmployeesService } from 'src/app/employees/employees.service';
import { Employee } from 'src/app/shared/models/Employee';

@Component({
  selector: 'app-birthday-list',
  templateUrl: './birthday-list.component.html',
  styleUrls: ['./birthday-list.component.scss'],
})
export class BirthdayListComponent {
  birthdays$!: Observable<any>;

  displayedColumns: string[] = [
    'name',
    'birthday',
  ];

  birthdayMonth: string = ''
  nameMonthBirthday: string = ''

  constructor(
    private route: ActivatedRoute,
    private employeesService: EmployeesService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.birthdayMonth = params['birthday'];

      this.birthdays$ = this.employeesService
        .listForMonth(this.birthdayMonth)
        .pipe(
          map((result: Employee[]) =>
            result.sort((a: { birthday: any }, b: { birthday: any }) =>
              a.birthday!.localeCompare(b.birthday!)
            )
          )
        );
        this.nameMonth(this.birthdayMonth);
    }
    );
  }
  nameMonth(nameMonth: string){
    switch(nameMonth){
      case '01': this.nameMonthBirthday ='Janeiro'; break;
      case '02': this.nameMonthBirthday ='Fevereiro'; break;
      case '03': this.nameMonthBirthday ='Março'; break;
      case '04': this.nameMonthBirthday ='Abril'; break;
      case '05': this.nameMonthBirthday ='Maio'; break;
      case '06': this.nameMonthBirthday ='Junho'; break;
      case '07': this.nameMonthBirthday ='Julho'; break;
      case '08': this.nameMonthBirthday ='Agosto'; break;
      case '09': this.nameMonthBirthday ='Setembro'; break;
      case '10': this.nameMonthBirthday ='Outubro'; break;
      case '11': this.nameMonthBirthday ='Novembro'; break;
      case '12': this.nameMonthBirthday ='Dezembro'; break;
    }

  }
}
