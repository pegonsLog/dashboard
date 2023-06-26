import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { User } from '../shared/models/User';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  username: string = '';
  password: string = '';

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
    private router: Router
  ) {
    // this.subscription = this.authService
    //   .list(this.username, this.password)
    //   .subscribe((users: User[]) => (this.users = users));
  }

  authentication(username: string, password: string) {
    if (username !== '' || password !== '') {
      this.subscription = this.authService
        .authentication(this.username, this.password)
        .subscribe((user: User) => {
          if (user.username) {
            (this.userAuth = user), this.router.navigate(['/home']);
          } else {
            this.onError();
          }
        });
    } else {
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
    this.subscription.unsubscribe();
  }
}
