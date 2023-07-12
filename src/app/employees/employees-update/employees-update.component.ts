import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from 'src/app/shared/models/Employee';
import { EmployeesService } from '../employees.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogUpdatedComponent } from 'src/app/shared/dialogs/dialog-updated/dialog-updated.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-employees-update',
  templateUrl: './employees-update.component.html',
  styleUrls: ['./employees-update.component.scss'],
})
export class EmployeesUpdateComponent implements OnInit{
  form!: FormGroup;
  subscription: Subscription = new Subscription();

  employee: Employee = {
    id: '',
    registration: '',
    name: '',
    birthday: '',
  };

  @Input() employeeUpdate: Employee = {
    id: '',
    registration: '',
    name: '',
    birthday: '',
  };

  @Output() typeList: EventEmitter<string> = new EventEmitter<string>();
  employeeList: string = 'employeeList';

  constructor(
    private fb: FormBuilder,
    private employeesService: EmployeesService,
    public dialog: MatDialog
  ) {}

  onUpdate() {
    this.employee.id = this.form.value.id;
    this.employee.registration = this.form.value.registration;
    this.employee.name = this.form.value.name;
    this.employee.birthday = this.form.value.birthday;
    if (
      this.employee.registration !== '' &&
      this.employee.name !== ''
    ) {
     this.employeesService
        .update(this.employee, this.employee.id)
        .then(() => {
          this.typeList.emit(this.employeeList);
          const dialogReference = this.dialog.open(DialogUpdatedComponent);
          this.subscription = dialogReference.afterClosed().subscribe();
        })
        .catch(() => console.log('Deu erro'));
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.employeeUpdate.id],
      registration: [this.employeeUpdate.registration, Validators.required],
      name: [this.employeeUpdate.name, Validators.required],
      birthday: [this.employeeUpdate.birthday],
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
