import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { startWith } from 'rxjs';
import {
  CERTIFICATE_KINDS,
  Certificate,
  CertificateDraft,
  CertificateKind,
  HOUR_MODES,
  HOUR_STATUSES,
  HourMode,
  HourStatus,
} from '../../../core/models/certificate.model';
import { CertificatesService } from '../../../core/services/certificates.service';
import { EmployeesService } from '../../../core/services/employees.service';
import { NotificationService } from '../../../core/services/notification.service';
import { isValid } from 'date-fns';
import {
  daysBetweenInclusive,
  formatDurationLong,
  isoToDate,
  minutesBetween,
  parseTimeValue,
  timeToDate,
  toIsoDate,
} from '../../../core/utils/date.utils';
import { plural } from '../../../core/utils/text.utils';
import { ConfirmService } from '../../../shared/confirm/confirm-dialog.component';
import { EmployeeAutocompleteComponent } from '../../../shared/employee-autocomplete/employee-autocomplete.component';
import { crossFieldMatcher } from '../../../shared/forms/error-matchers';
import { dateRangeValidator, timeRangeValidator } from '../../../shared/forms/validators';
import { describeCertificate, findConflicts } from '../certificate-rules';

export interface CertificateDialogData {
  readonly kind: CertificateKind;
  /** Presente na alteração. */
  readonly certificate?: Certificate;
  /** Valores sugeridos na inclusão (ex.: funcionário escolhido no filtro). */
  readonly defaults?: { readonly registration?: string; readonly mode?: HourMode };
}

/** Datas anteriores a 2000 quase sempre são erro de digitação (ex.: ano "24"). */
const MIN_DATE = new Date(2000, 0, 1);

interface Summary {
  readonly icon: string;
  readonly text: string;
  readonly invalid: boolean;
}

function validDate(value: Date | null | undefined): Date | null {
  return value instanceof Date && isValid(value) ? value : null;
}

@Component({
  selector: 'app-certificate-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTimepickerModule,
    EmployeeAutocompleteComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './certificate-dialog.component.html',
  styleUrl: './certificate-dialog.component.scss',
})
export class CertificateDialogComponent {
  protected readonly data = inject<CertificateDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<CertificateDialogComponent, boolean>);
  private readonly certificatesService = inject(CertificatesService);
  private readonly employeesService = inject(EmployeesService);
  private readonly notifications = inject(NotificationService);
  private readonly confirm = inject(ConfirmService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly kind = this.data.kind;
  protected readonly info = CERTIFICATE_KINDS[this.kind];
  protected readonly editing = !!this.data.certificate;
  protected readonly modes = HOUR_MODES;
  protected readonly statuses = HOUR_STATUSES;
  protected readonly minDate = MIN_DATE;
  protected readonly saving = signal(false);
  protected readonly dateRangeMatcher = crossFieldMatcher('dateRange');
  protected readonly timeRangeMatcher = crossFieldMatcher('timeRange');

  protected readonly form = this.fb.group(
    {
      registration: this.fb.control('', Validators.required),
      date: this.fb.control<Date | null>(null, Validators.required),
      endDate: this.fb.control<Date | null>(null, Validators.required),
      startTime: this.fb.control<Date | null>(null, Validators.required),
      endTime: this.fb.control<Date | null>(null, Validators.required),
      mode: this.fb.control<HourMode | null>(null, Validators.required),
      status: this.fb.control<HourStatus | null>(null, Validators.required),
      dayOff: this.fb.control<Date | null>(null),
    },
    {
      validators: [
        dateRangeValidator('date', 'endDate'),
        timeRangeValidator('startTime', 'endTime'),
      ],
    },
  );

  private readonly value = toSignal(
    this.form.valueChanges.pipe(startWith(this.form.getRawValue())),
    { requireSync: true },
  );

  /** Resumo exibido acima dos botões (dias de afastamento ou duração). */
  protected readonly summary = computed((): Summary | null => {
    const value = this.value();
    if (this.kind === 'day') {
      const start = validDate(value.date);
      const end = validDate(value.endDate);
      if (!start || !end) {
        return null;
      }
      const [from, to] = [toIsoDate(start), toIsoDate(end)];
      return to < from
        ? { icon: 'error', text: 'O término não pode ser antes do início', invalid: true }
        : {
            icon: 'event_busy',
            text: `${plural(daysBetweenInclusive(from, to), 'dia')} de afastamento`,
            invalid: false,
          };
    }
    if (this.kind === 'hour') {
      const minutes = minutesBetween(
        parseTimeValue(validDate(value.startTime)),
        parseTimeValue(validDate(value.endTime)),
      );
      if (minutes === null) {
        return null;
      }
      return minutes > 0
        ? { icon: 'timer', text: `Duração: ${formatDurationLong(minutes)}`, invalid: false }
        : { icon: 'error', text: 'O término deve ser depois do início', invalid: true };
    }
    return null;
  });

  constructor() {
    this.enableFieldsFor(this.kind);
    const certificate = this.data.certificate;
    if (certificate) {
      this.fill(certificate);
    } else {
      this.form.patchValue({
        registration: this.data.defaults?.registration ?? '',
        mode: this.kind === 'hour' ? (this.data.defaults?.mode ?? null) : null,
      });
    }
  }

  private enableFieldsFor(kind: CertificateKind): void {
    const fields: Record<CertificateKind, readonly string[]> = {
      day: ['endDate'],
      hour: ['startTime', 'endTime', 'mode', 'status'],
      donation: ['dayOff'],
    };
    for (const name of ['endDate', 'startTime', 'endTime', 'mode', 'status', 'dayOff'] as const) {
      const control = this.form.controls[name];
      if (fields[kind].includes(name)) {
        control.enable();
      } else {
        control.disable();
      }
    }
  }

  private fill(certificate: Certificate): void {
    const common = { registration: certificate.registration, date: isoToDate(certificate.date) };
    switch (certificate.kind) {
      case 'day':
        this.form.patchValue({ ...common, endDate: isoToDate(certificate.endDate) });
        break;
      case 'hour':
        this.form.patchValue({
          ...common,
          startTime: certificate.startTime ? timeToDate(certificate.startTime) : null,
          endTime: certificate.endTime ? timeToDate(certificate.endTime) : null,
          mode: certificate.mode,
          status: certificate.status,
        });
        break;
      case 'donation':
        this.form.patchValue({
          ...common,
          dayOff: certificate.dayOff ? isoToDate(certificate.dayOff) : null,
        });
        break;
    }
  }

  private toDraft(): CertificateDraft {
    const value = this.form.getRawValue();
    const base = { registration: value.registration, date: toIsoDate(value.date as Date) };
    switch (this.kind) {
      case 'day':
        return { ...base, kind: 'day', endDate: toIsoDate(value.endDate as Date) };
      case 'hour':
        return {
          ...base,
          kind: 'hour',
          startTime: parseTimeValue(value.startTime),
          endTime: parseTimeValue(value.endTime),
          mode: value.mode,
          status: value.status,
        };
      case 'donation':
        return { ...base, kind: 'donation', dayOff: value.dayOff ? toIsoDate(value.dayOff) : null };
    }
  }

  protected async save(): Promise<void> {
    if (this.saving()) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const draft = this.toDraft();
    const conflicts = findConflicts(
      draft,
      this.certificatesService.certificates(),
      this.data.certificate?.id,
    );
    if (conflicts.length) {
      const proceed = await this.confirm.ask({
        title: 'Possível duplicidade',
        message: `${this.employeesService.displayName(draft.registration)} já tem ${
          conflicts.length === 1 ? 'um atestado' : 'atestados'
        } neste mesmo período:`,
        details: conflicts.map(describeCertificate),
        confirmLabel: 'Salvar mesmo assim',
        icon: 'warning',
      });
      if (!proceed) {
        return;
      }
    }

    this.saving.set(true);
    this.dialogRef.disableClose = true;
    try {
      if (this.data.certificate) {
        await this.certificatesService.update(this.data.certificate.id, draft);
        this.notifications.success('Atestado alterado com sucesso.');
      } else {
        await this.certificatesService.create(draft);
        this.notifications.success('Atestado incluído com sucesso.');
      }
      this.dialogRef.close(true);
    } catch (error) {
      this.notifications.error('Não foi possível salvar o atestado. Tente novamente.', error);
    } finally {
      this.saving.set(false);
      this.dialogRef.disableClose = false;
    }
  }
}
