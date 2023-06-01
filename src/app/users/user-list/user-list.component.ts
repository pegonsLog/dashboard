import { Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  userCreate: string = 'userCreate';
  userUpdate: string = 'userUpdate';

  @Output() type: EventEmitter<string> = new EventEmitter<string>();

  dataSource$: Observable<any>;
  displayedColumns: string[] = ['username', 'name', 'password', 'actions'];

  constructor(private userService: UserService) {
    this.dataSource$ = userService.list();
  }

  onCreateUser() {
    console.log('Teste');
    this.type.emit(this.userCreate);
  }
  onUpdateUser() {
    this.type.emit(this.userUpdate);
  }

}
