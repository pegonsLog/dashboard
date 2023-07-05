import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/models/User';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss'],
})
export class UserUpdateComponent implements OnInit, OnDestroy {
  form: FormGroup;
subscription: Subscription = new Subscription();
  user: User = {
    id: '',
    username: '',
    name: '',
    password: '',
    gender: '',
  };

  username: string = 'teste';

  @Input() id: string = '';

  constructor(private fb: FormBuilder, private userService: UserService) {
 
    this.form = this.fb.group({
      id: [''],
      username: [this.username, Validators.required],
      name: [this.user.name, Validators.required],
      password: [this.user.password, Validators.required],
      gender: [this.user.gender, Validators.required],
    });
  }
  
  onUpdate() {
    // this.user = this.form.getRawValue();
    //  this.userService.update();
    
  }
  
  onClear() {}
  
  ngOnInit(): void {
    this.subscription = this.userService.findOne(this.id).subscribe((user: User) => {
      this.user.username = user.username,
      this.user.name = user.name;
    });
    
  }
  ngOnDestroy(): void {
  this.subscription.unsubscribe();
  }
}
