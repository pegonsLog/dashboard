import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { DEMO_MODE } from '../../core/data/data-store';
import { DEMO_CREDENTIALS } from '../../core/data/demo-credentials';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  /** Página que o usuário tentou abrir antes do login (query param). */
  readonly returnUrl = input<string>();

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly demoMode = inject(DEMO_MODE);
  protected readonly demoCredentials = DEMO_CREDENTIALS;
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly showPassword = signal(false);

  protected readonly form = inject(NonNullableFormBuilder).group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.error.set(null));
  }

  protected async submit(): Promise<void> {
    if (this.loading()) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { username, password } = this.form.getRawValue();
    this.loading.set(true);
    try {
      const ok = await this.auth.login(username, password);
      if (!ok) {
        this.error.set('Usuário ou senha inválidos.');
        return;
      }
      const target = this.returnUrl();
      await this.router.navigateByUrl(target?.startsWith('/') ? target : '/inicio');
    } catch (error) {
      console.error('Falha no login', error);
      this.error.set('Não foi possível entrar. Verifique sua conexão e tente novamente.');
    } finally {
      this.loading.set(false);
    }
  }
}
