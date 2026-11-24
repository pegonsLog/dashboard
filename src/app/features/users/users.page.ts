import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../core/models/user.model';
import { NotificationService } from '../../core/services/notification.service';
import { UsersService } from '../../core/services/users.service';
import { plural } from '../../core/utils/text.utils';
import { ConfirmService } from '../../shared/confirm/confirm-dialog.component';
import { UserDialogComponent, UserDialogData } from './user-dialog/user-dialog.component';

@Component({
  selector: 'app-users-page',
  imports: [MatButtonModule, MatIconModule, MatProgressBarModule, MatTableModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './users.page.html',
  styles: `
    .password {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-family: ui-monospace, 'Cascadia Code', Consolas, monospace;
    }
  `,
})
export class UsersPage {
  private readonly usersService = inject(UsersService);
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationService);
  private readonly confirm = inject(ConfirmService);
  private readonly dialog = inject(MatDialog);

  protected readonly users = this.usersService.users;
  protected readonly loading = this.usersService.loading;
  protected readonly failed = this.usersService.failed;
  protected readonly columns = ['username', 'name', 'gender', 'password', 'actions'];
  protected readonly currentUserId = computed(() => this.auth.session()?.userId);
  protected readonly totalText = computed(() =>
    plural(this.users().length, 'usuário com acesso', 'usuários com acesso'),
  );

  /** Senhas ficam ocultas; o administrador pode revelar uma por vez. */
  protected readonly revealed = signal<ReadonlySet<string>>(new Set());

  protected toggleReveal(user: User): void {
    this.revealed.update((current) => {
      const next = new Set(current);
      if (next.has(user.id)) {
        next.delete(user.id);
      } else {
        next.add(user.id);
      }
      return next;
    });
  }

  /** Motivo pelo qual o usuário não pode ser excluído (ou null). */
  protected deleteBlockedReason(user: User): string | null {
    if (user.id === this.currentUserId()) {
      return 'Você não pode excluir o próprio usuário';
    }
    if (this.users().length <= 1) {
      return 'O último usuário não pode ser excluído';
    }
    return null;
  }

  protected create(): void {
    this.open({});
  }

  protected edit(user: User): void {
    this.open({ user });
  }

  protected async remove(user: User): Promise<void> {
    if (this.deleteBlockedReason(user)) {
      return;
    }
    const confirmed = await this.confirm.ask({
      title: 'Excluir usuário',
      message: 'O usuário abaixo não poderá mais entrar no sistema. Deseja continuar?',
      details: [`${user.name} (usuário ${user.username})`],
      tone: 'danger',
    });
    if (!confirmed) {
      return;
    }
    try {
      await this.usersService.remove(user.id);
      this.notifications.success('Usuário excluído.');
    } catch (error) {
      this.notifications.error('Não foi possível excluir o usuário. Tente novamente.', error);
    }
  }

  protected retry(): void {
    this.usersService.reload();
  }

  private open(data: UserDialogData): void {
    this.dialog.open(UserDialogComponent, {
      data,
      width: '560px',
      autoFocus: data.user ? 'dialog' : 'first-tabbable',
    });
  }
}
