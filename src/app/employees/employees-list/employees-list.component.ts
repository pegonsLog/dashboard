import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss']
})
export class EmployeesListComponent {
  displayedColumns: string[] = ['registration', 'name'];
  dataSource = new MatTableDataSource([
    { id: '1', registration: '564', name: 'Pedro' },
    { id: '2', registration: '410', name: 'Amauri'}
  ]);

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
