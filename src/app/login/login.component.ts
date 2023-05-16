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
  control: FormControl;

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
    this.control = fb.control([
      { user: '564', required: true },
      { password: '564', required: true },
    ]);

    this.subscription = this.authService
      .list()
      .subscribe((users: User[]) => (this.users = users));
  }

  query() {
    for (let usr of this.users) {
      if (
        usr.user === this.control.value.user &&
        usr.password === this.control.value.password
      ) {
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
    if (this.control.value.value === '' || this.control.value.password === '') {
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
