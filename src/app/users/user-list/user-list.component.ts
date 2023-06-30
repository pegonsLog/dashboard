import { Component, EventEmitter, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation/confirmation.component';

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
  subscription: Subscription = new Subscription();
  displayedColumns: string[] = ['username', 'name', 'password', 'actions'];

  constructor(private userService: UserService, public dialog: MatDialog) {
    this.dataSource$ = this.userService.list();
  }

  onCreateUser() {
    this.type.emit(this.userCreate);
  }
  onUpdateUser() {
    this.type.emit(this.userUpdate);
  }

  onDeleteUser(id: string) {
    const dialogReference = this.dialog.open(ConfirmationDialogComponent);
    this.subscription = dialogReference
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.userService.delete(id).then();
        }
      });
  }

}
