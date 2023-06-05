import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { EmployeesService } from '../employees.service';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss'],
})
export class EmployeesListComponent {

  employeeCreate: string = 'employeeCreate';
  employeeUpdate: string = 'employeeUpdate';

  @Output() type: EventEmitter<string> = new EventEmitter<string>();

  displayedColumns: string[] = ['registration', 'name', 'birthday', 'actions'];
  subscription: Subscription = new Subscription();
  dataSource$: Observable<any>;

  constructor(private employeeService: EmployeesService) {
    this.dataSource$ = employeeService.list();
  }

  onCreateUser() {
    this.type.emit(this.employeeCreate);
  }
  
  onUpdateUser() {
    this.type.emit(this.employeeUpdate);
  }
  // applyFilter(event: KeyboardEvent) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource$.filter = filterValue.trim().toLowerCase();
  // }

}
