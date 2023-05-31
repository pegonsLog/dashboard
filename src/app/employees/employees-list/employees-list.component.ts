import { Component, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { EmployeesService } from '../employees.service';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss'],
})
export class EmployeesListComponent {
  displayedColumns: string[] = ['registration', 'name'];
  subscription: Subscription = new Subscription();
  dataSource$: Observable<any>;

  constructor(private employeeService: EmployeesService) {
    this.dataSource$ = employeeService.list();
  }

  onTest(){
    
  }

  // applyFilter(event: KeyboardEvent) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource$.filter = filterValue.trim().toLowerCase();
  // }

}
