import { ChangeDetectionStrategy, Component, Injectable, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';

export interface ConfirmOptions {
  readonly title: string;
  readonly message: string;
  /** Linhas extras exibidas em destaque (ex.: dados do registro). */
  readonly details?: readonly string[];
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  /** "danger" para exclusões: botão vermelho e foco inicial em "Cancelar". */
  readonly tone?: 'danger' | 'primary';
  readonly icon?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title class="dialog-title">
      <span class="dialog-icon" [class.danger]="danger">
        <mat-icon>{{ data.icon ?? (danger ? 'delete' : 'help') }}</mat-icon>
      </span>
      {{ data.title }}
    </h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
      @if (data.details?.length) {
        <ul class="details">
          @for (line of data.details; track $index) {
            <li>{{ line }}</li>
          }
        </ul>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button matButton [mat-dialog-close]="false" [attr.cdkFocusInitial]="danger ? '' : null">
        {{ data.cancelLabel ?? 'Cancelar' }}
      </button>
      <button
        matButton="filled"
        [class.btn-danger]="danger"
        [mat-dialog-close]="true"
        [attr.cdkFocusInitial]="danger ? null : ''"
      >
        {{ data.confirmLabel ?? (danger ? 'Excluir' : 'Confirmar') }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .details {
      margin: 12px 0 0;
      padding: 10px 14px 10px 30px;
      border-radius: 12px;
      background: #f8fafc;
      color: #334155;
    }
  `,
})
export class ConfirmDialogComponent {
  protected readonly data = inject<ConfirmOptions>(MAT_DIALOG_DATA);
  protected readonly danger = this.data.tone === 'danger';
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private readonly dialog = inject(MatDialog);

  /** Abre a confirmação e resolve true somente se o usuário confirmar. */
  async ask(options: ConfirmOptions): Promise<boolean> {
    const reference = this.dialog.open<ConfirmDialogComponent, ConfirmOptions, boolean>(
      ConfirmDialogComponent,
      { data: options, width: '460px', autoFocus: 'first-tabbable' },
    );
    return (await firstValueFrom(reference.afterClosed())) === true;
  }
}
