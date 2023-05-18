import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  loginForm: FormGroup;

  isAuth: boolean = false;

  userAuth: User = {
    id: '',
    username: '',
    name: '',
    password: '',
  };

  users: User[] = [];
  subscription = new Subscription();

  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      user: ['564', Validators.required],
      password: ['564', Validators.required],
    });

    this.subscription = this.authService
      .list()
      .subscribe((users: User[]) => (this.users = users));
  }

  query() {
    for (let usr of this.users) {
      if (
        usr.username === this.loginForm.value.user &&
        usr.password === this.loginForm.value.password
      ) {
        this.userAuth = usr;
        this.isAuth = true;
      }
    }

    if (this.isAuth) {
      this.router.navigate(['home'], {
        queryParams: {
          name: this.userAuth.name,
          user: this.userAuth.username,
          role: this.userAuth.role,
        },
      });
    } else {
      this.router.navigate(['']);
      this.onError();
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
