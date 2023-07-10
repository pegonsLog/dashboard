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

  constructor(
    private route: ActivatedRoute,
    private employeesService: EmployeesService
  ) {
    this.route.queryParams.subscribe((params) => {
      const birthdayMonth = params['birthday'];

      this.birthdays$ = this.employeesService
        .listForMonth(birthdayMonth)
        .pipe(
          map((result: Employee[]) =>
            result.sort((a: { birthday: any }, b: { birthday: any }) =>
              a.birthday!.localeCompare(b.birthday!)
            )
          )
        );
    });
  }
}
