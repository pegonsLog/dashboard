import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Employee, EmployeeDraft } from '../../../core/models/employee.model';
import { CertificatesService } from '../../../core/services/certificates.service';
import { EmployeesService } from '../../../core/services/employees.service';
import { NotificationService } from '../../../core/services/notification.service';
import { parseDayMonth } from '../../../core/utils/date.utils';
import { cleanString, plural } from '../../../core/utils/text.utils';
import { ConfirmService } from '../../../shared/confirm/confirm-dialog.component';
import { DigitMaskDirective } from '../../../shared/forms/digit-mask.directive';
import {
  dayMonthValidator,
  notBlankValidator,
  uniqueValidator,
} from '../../../shared/forms/validators';

export interface EmployeeDialogData {
  readonly employee?: Employee;
}

@Component({
  selector: 'app-employee-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    DigitMaskDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './employee-dialog.component.html',
})
export class EmployeeDialogComponent {
  private readonly data = inject<EmployeeDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<EmployeeDialogComponent, boolean>);
  private readonly employeesService = inject(EmployeesService);
  private readonly certificatesService = inject(CertificatesService);
  private readonly notifications = inject(NotificationService);
  private readonly confirm = inject(ConfirmService);

  protected readonly employee = this.data.employee;
  protected readonly saving = signal(false);

  protected readonly form = inject(NonNullableFormBuilder).group({
    registration: [
      this.employee?.registration ?? '',
      [
        Validators.required,
        notBlankValidator,
        uniqueValidator((value) =>
          this.employeesService.isRegistrationTaken(value, this.employee?.id),
        ),
      ],
    ],
    name: [this.employee?.name ?? '', [Validators.required, notBlankValidator]],
    birthday: [this.employee?.birthday ?? '', dayMonthValidator],
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
    const draft: EmployeeDraft = {
      registration: cleanString(value.registration),
      name: cleanString(value.name),
      birthday: parseDayMonth(value.birthday),
    };

    const previous = this.employee?.registration;
    const linked =
      previous && previous !== draft.registration
        ? this.certificatesService.countByRegistration(previous)
        : 0;
    if (linked) {
      const proceed = await this.confirm.ask({
        title: 'Alterar matrícula',
        message: `${plural(linked, 'atestado')} da matrícula ${previous} ${
          linked === 1 ? 'passará' : 'passarão'
        } para a matrícula ${draft.registration}.`,
        confirmLabel: 'Alterar matrícula',
        icon: 'badge',
      });
      if (!proceed) {
        return;
      }
    }

    this.saving.set(true);
    this.dialogRef.disableClose = true;
    try {
      if (this.employee) {
        await this.employeesService.update(this.employee.id, draft);
        if (linked && previous) {
          await this.reassign(previous, draft.registration);
        }
        this.notifications.success('Funcionário alterado com sucesso.');
      } else {
        await this.employeesService.create(draft);
        this.notifications.success('Funcionário incluído com sucesso.');
      }
      this.dialogRef.close(true);
    } catch (error) {
      this.notifications.error('Não foi possível salvar o funcionário. Tente novamente.', error);
    } finally {
      this.saving.set(false);
      this.dialogRef.disableClose = false;
    }
  }

  private async reassign(from: string, to: string): Promise<void> {
    try {
      await this.certificatesService.reassignRegistration(from, to);
    } catch (error) {
      this.notifications.error(
        `O funcionário foi salvo, mas os atestados continuam na matrícula ${from}. Tente alterar novamente.`,
        error,
      );
      throw error;
    }
  }
}
