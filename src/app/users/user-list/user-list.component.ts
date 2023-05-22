import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  displayedColumns: string[] = ['username', 'name', 'password'];
  dataSource = new MatTableDataSource([
    { id: '1', username: '564', name: 'Pedro', password: '564' },
    { id: '2', username: '410', name: 'Amauri', password: '410' }
  ]);

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
