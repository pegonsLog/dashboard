import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  subscription: Subscription = new Subscription();
  dataSource: any = [];
  displayedColumns: string[] = ['username', 'name', 'password'];

  constructor(private userService: UserService) {
    this.subscription = userService.list()
      .subscribe(
        (users: any) => (this.dataSource = users)
      );
  }


  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
