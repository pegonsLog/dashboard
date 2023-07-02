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
<<<<<<< HEAD
    gender: ''
=======
>>>>>>> f9e8d2e7be0dfa117eb5ad7543dc4311d9f58ce1
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

<<<<<<< HEAD
  onAddUser(){
    this.user = this.form.getRawValue();
    this.userService.addUser(this.user);
=======
  addUser() {
    this.user.username = this.form.value.username;
    this.user.name = this.form.value.name;
    this.user.password = this.form.value.password;

    return this.userService
      .addUser(this.user)
      .then(() => console.log('Deu Certo'))
      .catch(() => console.log('Deu erro'));
>>>>>>> f9e8d2e7be0dfa117eb5ad7543dc4311d9f58ce1
  }
  onClear() {}
}
