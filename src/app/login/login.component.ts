import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription, map } from 'rxjs';
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

  subscription = new Subscription();

  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  authentication(username: string, password: string) {
    if (username !== '' || password !== '') {
      this.subscription = this.authService
        .list()
        .pipe(
          map((user: User[]) =>
            user.filter(
              (data) => data.username === username && data.password === password
            )
          )
        )
        .subscribe((user: User[]) => {
          user[0] ? this.router.navigate(['/home']) : this.onError();
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
