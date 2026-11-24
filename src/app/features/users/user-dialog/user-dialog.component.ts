import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/auth/auth.service';
import { GENDERS, Gender, User, UserDraft } from '../../../core/models/user.model';
import { NotificationService } from '../../../core/services/notification.service';
import { UsersService } from '../../../core/services/users.service';
import { cleanString } from '../../../core/utils/text.utils';
import { notBlankValidator, uniqueValidator } from '../../../shared/forms/validators';

export interface UserDialogData {
  readonly user?: User;
}

@Component({
  selector: 'app-user-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-dialog.component.html',
  styles: `
    .gender {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
    }
    .gender-error {
      margin-top: 4px;
      color: var(--mat-sys-error);
      font-size: 0.75rem;
    }
  `,
})
export class UserDialogComponent {
  private readonly data = inject<UserDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<UserDialogComponent, boolean>);
  private readonly usersService = inject(UsersService);
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationService);

  protected readonly user = this.data.user;
  protected readonly genders = GENDERS;
  protected readonly saving = signal(false);
  protected readonly showPassword = signal(false);

  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly form = this.fb.group({
    username: [
      this.user?.username ?? '',
      [
        Validators.required,
        notBlankValidator,
        uniqueValidator((value) => this.usersService.isUsernameTaken(value, this.user?.id)),
      ],
    ],
    name: [this.user?.name ?? '', [Validators.required, notBlankValidator]],
    gender: this.fb.control<Gender | null>(this.user?.gender ?? null, Validators.required),
    password: [this.user?.password ?? '', Validators.required],
  });

  protected async save(): Promise<void> {
    if (this.saving()) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const draft: UserDraft = {
      username: cleanString(value.username),
      name: cleanString(value.name),
      gender: value.gender,
      password: value.password,
    };
    this.saving.set(true);
    this.dialogRef.disableClose = true;
    try {
      if (this.user) {
        await this.usersService.update(this.user.id, draft);
        this.auth.refresh({ id: this.user.id, ...draft });
        this.notifications.success('Usuário alterado com sucesso.');
      } else {
        await this.usersService.create(draft);
        this.notifications.success('Usuário incluído com sucesso.');
      }
      this.dialogRef.close(true);
    } catch (error) {
      this.notifications.error('Não foi possível salvar o usuário. Tente novamente.', error);
    } finally {
      this.saving.set(false);
      this.dialogRef.disableClose = false;
    }
  }
}
