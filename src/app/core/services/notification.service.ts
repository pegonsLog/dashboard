import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.snackBar.open(message, 'OK', { panelClass: 'snack-success' });
  }

  error(message: string, error?: unknown): void {
    if (error !== undefined) {
      console.error(message, error);
    }
    this.snackBar.open(message, 'Fechar', { panelClass: 'snack-error', duration: 7000 });
  }
}
