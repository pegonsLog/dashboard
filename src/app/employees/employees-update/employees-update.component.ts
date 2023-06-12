import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from 'src/app/shared/models/Employee';
import { EmployeesService } from '../employees.service';

@Component({
  selector: 'app-employees-update',
  templateUrl: './employees-update.component.html',
  styleUrls: ['./employees-update.component.scss']
})
export class EmployeesUpdateComponent {
  form: FormGroup;

  employee: Employee = {
    id: '',
    registration: '',
    name: '',
    birthday: ''
  };

  constructor(
    private fb: FormBuilder,
    private employeesService: EmployeesService
  ) {
    this.form = this.fb.group({
      registration: ['', Validators.required],
      name: ['', Validators.required],
      birthday: [''],
    });
  }

  onClear() {
    this.form.reset();
  }

  employeeUpdate() {
    this.employee.registration = this.form.value.registration;

    return this.employeesService
      .employeeAdd(this.employee)
      .then(() => console.log('Deu Certo'))
      .catch(() => console.log('Deu erro'));
  }
}
