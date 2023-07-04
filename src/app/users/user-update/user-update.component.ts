import { Component, Input } from '@angular/core';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss'],
})
export class UserUpdateComponent {
  form: FormGroup;

  user: User = {
    id: '',
    username: '',
    name: '',
    password: '',
    gender: '',
  };

  @Input() id: string = '';

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.form = this.fb.group({
      id: [''],
      username: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }

  onUpdate() {
    this.user = this.form.getRawValue();
  //  this.userService.update();

  }

  onClear() {}
}
