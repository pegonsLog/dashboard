import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  dataSource$: Observable<any>;
  displayedColumns: string[] = ['username', 'name', 'password'];

  constructor(private userService: UserService) {
    this.dataSource$ = userService.list();
  }
}
