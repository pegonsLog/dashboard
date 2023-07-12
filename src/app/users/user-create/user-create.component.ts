import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DialogCreatedComponent } from 'src/app/shared/dialogs/dialog-created/dialog-created.component';
import { User } from 'src/app/shared/models/User';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
})
export class UserCreateComponent {
  form: FormGroup;

  user: User = {
    id: '',
    username: '',
    name: '',
    password: '',
    gender: '',
  };

  subscription: Subscription = new Subscription();
  @Output() typeList: EventEmitter<string> = new EventEmitter<string>();
  userList: string = 'userList'; 


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialog: MatDialog
  ) {
    this.form = this.fb.group({
      id: [''],
      username: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }

  addUser() {
    this.user.username = this.form.value.username;
    this.user.name = this.form.value.name;
    this.user.password = this.form.value.password;
    this.user.gender = this.form.value.gender;
    if (
      this.form.value.username !== '' &&
      this.form.value.name !== '' &&
      this.form.value.password !== '' &&
      this.form.value.gender !== ''
    ) {
     this.userService
        .addUser(this.user)
        .then(() => {
          this.typeList.emit(this.userList);
          const dialogReference = this.dialog.open(DialogCreatedComponent);
          this.subscription = dialogReference.afterClosed().subscribe();
        })
        .catch(() => console.log('Deu erro'));
    }
  }
  onClear() {}
}
