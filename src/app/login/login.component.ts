import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../shared/models/User';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  form: FormGroup;

  user = new FormControl('');
  password = new FormControl('');
  isAuth: boolean = false;

  userAuth: User = {
    id: '',
    user: '',
    name: '',
    password: '',
    role: '',
  };

  users: User[] = [];
  subscription = new Subscription();

  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group(
      { user: ['564', Validators.required] },
      { password: ['564', Validators.required] }
      );

    this.subscription = this.authService
      .list()
      .subscribe((users: User[]) => (this.users = users));
  }

  query() {

   const userForm = this.form.getRawValue();
   console.log(userForm)

    for (let usr of this.users) {
      if (usr.user === userForm.user && usr.password === userForm.password) {
        this.userAuth = usr;
      }
    }

    if (this.userAuth) {
      this.router.navigate(['/home'], {
        queryParams: {
          name: this.userAuth.name,
          user: this.userAuth.user,
          role: this.userAuth.role,
        },
      });
    }
    if (userForm.user === '' || userForm.password === '') {
      alert('Usuário e/ou senha inválido(s)!');
      this.router.navigate(['']);
    }
  }

  onError() {
    this.snackBar.open('Usuário ou senha inválidos!', 'X', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe;
  }
}
