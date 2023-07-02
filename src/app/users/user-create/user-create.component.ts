import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from 'src/app/shared/models/User';

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
    gender: ''
  };

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.form = this.fb.group({
      id: [''],
      username: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }

  onAddUser(){
    this.user = this.form.getRawValue();
    this.userService.addUser(this.user);
  }
  onClear() {}
}
