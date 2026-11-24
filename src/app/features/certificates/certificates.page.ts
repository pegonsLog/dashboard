import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  CERTIFICATE_KINDS,
  CERTIFICATE_KIND_LIST,
  Certificate,
  CertificateKind,
  HOUR_MODES,
  HOUR_STATUSES,
  HourMode,
  HourStatus,
} from '../../core/models/certificate.model';
import { CertificatesService } from '../../core/services/certificates.service';
import { EmployeesService } from '../../core/services/employees.service';
import { formatDurationLong } from '../../core/utils/date.utils';
import {
  FIRST_PERIOD_YEAR,
  Period,
  currentPeriod,
  periodOf,
  periodStartYearOf,
  periodsBetween,
} from '../../core/utils/period.utils';
import { compareText, normalizeText, plural } from '../../core/utils/text.utils';
import { EmployeeAutocompleteComponent } from '../../shared/employee-autocomplete/employee-autocomplete.component';
import { BrDatePipe, DurationPipe } from '../../shared/pipes/format.pipes';
import { CertificateActionsService } from './certificate-actions.service';
import {
  CertificateFilter,
  dayCountOf,
  durationOf,
  earliestDate,
  filterCertificates,
  summarize,
} from './certificate-rules';

/** Valores usados na URL (ex.: /atestados?tipo=hora&matricula=1009&periodo=2025). */
const KIND_PARAM: Record<CertificateKind, string> = {
  day: 'dia',
  hour: 'hora',
  donation: 'doacao',
};

const COLUMNS: Record<CertificateKind, string[]> = {
  day: ['employee', 'date', 'endDate', 'days', 'actions'],
  hour: ['employee', 'date', 'startTime', 'endTime', 'duration', 'mode', 'status', 'actions'],
  donation: ['employee', 'date', 'dayOff', 'actions'],
};

interface Row {
  readonly certificate: Certificate;
  readonly employeeName: string;
  readonly days: number | null;
  readonly minutes: number | null;
}

function fromParam<T extends string>(options: readonly T[], value: string | null): T | null {
  if (!value) {
    return null;
  }
  const wanted = normalizeText(value);
  return options.find((option) => normalizeText(option) === wanted) ?? null;
}

@Component({
  selector: 'app-certificates-page',
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    EmployeeAutocompleteComponent,
    BrDatePipe,
    DurationPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './certificates.page.html',
  styleUrl: './certificates.page.scss',
})
export class CertificatesPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly certificatesService = inject(CertificatesService);
  private readonly employeesService = inject(EmployeesService);
  protected readonly actions = inject(CertificateActionsService);

  protected readonly kinds = CERTIFICATE_KIND_LIST;
  protected readonly modes = HOUR_MODES;
  protected readonly statuses = HOUR_STATUSES;
  protected readonly loading = this.certificatesService.loading;
  protected readonly failed = this.certificatesService.failed;
  protected readonly invalidCount = computed(() => this.certificatesService.invalidIds().length);

  /** A URL guarda os filtros: recarregar a página ou voltar no navegador mantém a consulta. */
  private readonly params = toSignal(this.route.queryParamMap, { requireSync: true });

  protected readonly kind = computed<CertificateKind>(() => {
    const value = this.params().get('tipo');
    const entry = Object.entries(KIND_PARAM).find(([, param]) => param === value);
    return (entry?.[0] as CertificateKind | undefined) ?? 'hour';
  });
  protected readonly kindInfo = computed(() => CERTIFICATE_KINDS[this.kind()]);
  protected readonly registration = computed(() => this.params().get('matricula') ?? '');
  protected readonly period = computed<Period>(() => {
    const year = Number(this.params().get('periodo'));
    return Number.isInteger(year) && year > 1900 ? periodOf(year) : currentPeriod();
  });
  protected readonly mode = computed<HourMode | 'all'>(() => {
    const value = this.params().get('modo');
    return value === 'todos' ? 'all' : (fromParam(HOUR_MODES, value) ?? 'Comparecimento');
  });
  protected readonly status = computed<HourStatus | 'all'>(
    () => fromParam(HOUR_STATUSES, this.params().get('status')) ?? 'all',
  );

  protected readonly employeeControl = new FormControl('', { nonNullable: true });

  protected readonly periods = computed(() => {
    const earliest = earliestDate(this.certificatesService.certificates());
    const current = currentPeriod().startYear;
    const selected = this.period().startYear;
    const first = Math.min(
      FIRST_PERIOD_YEAR,
      earliest ? periodStartYearOf(earliest) : current,
      selected,
    );
    return periodsBetween(first, Math.max(current, selected));
  });

  private readonly filter = computed<CertificateFilter>(() => ({
    kind: this.kind(),
    registration: this.registration(),
    period: this.period(),
    mode: this.mode(),
    status: this.status(),
  }));

  private readonly filtered = computed(() =>
    filterCertificates(this.certificatesService.certificates(), this.filter()),
  );

  protected readonly summary = computed(() => summarize(this.filtered()));
  protected readonly totalText = computed(() => formatDurationLong(this.summary().totalMinutes));
  protected readonly countText = computed(() => plural(this.summary().count, 'atestado'));
  protected readonly invalidTimeText = computed(() => {
    const count = this.summary().invalidTimeCount;
    return count === 1
      ? 'Um atestado com horário inválido não entra no saldo. Altere o registro para corrigir.'
      : `${count} atestados com horário inválido não entram no saldo. Altere os registros para corrigir.`;
  });

  protected readonly columns = computed(() => COLUMNS[this.kind()]);
  protected readonly sort = linkedSignal<CertificateKind, Sort>({
    source: this.kind,
    computation: () => ({ active: 'date', direction: 'desc' }),
  });
  protected readonly pageSize = linkedSignal<CertificateKind, number>({
    source: this.kind,
    computation: (_kind, previous) => previous?.value ?? 25,
  });
  protected readonly pageIndex = linkedSignal({
    source: () => [this.filter(), this.sort(), this.pageSize()],
    computation: () => 0,
  });

  private readonly rows = computed<Row[]>(() =>
    this.filtered().map((certificate) => ({
      certificate,
      employeeName: this.employeesService.displayName(certificate.registration),
      days: certificate.kind === 'day' ? dayCountOf(certificate) : null,
      minutes: certificate.kind === 'hour' ? durationOf(certificate) : null,
    })),
  );

  private readonly sortedRows = computed(() => {
    const { active, direction } = this.sort();
    const rows = [...this.rows()];
    if (!direction) {
      return rows;
    }
    const factor = direction === 'asc' ? 1 : -1;
    const key = (row: Row): string | number => {
      const c = row.certificate;
      switch (active) {
        case 'employee':
          return row.employeeName;
        case 'days':
          return row.days ?? 0;
        case 'duration':
          return row.minutes ?? -1;
        case 'endDate':
          return c.kind === 'day' ? c.endDate : '';
        case 'startTime':
          return c.kind === 'hour' ? (c.startTime ?? '') : '';
        case 'endTime':
          return c.kind === 'hour' ? (c.endTime ?? '') : '';
        case 'mode':
          return c.kind === 'hour' ? (c.mode ?? '') : '';
        case 'status':
          return c.kind === 'hour' ? (c.status ?? '') : '';
        case 'dayOff':
          return c.kind === 'donation' ? (c.dayOff ?? '') : '';
        default:
          return c.date;
      }
    };
    return rows.sort((a, b) => {
      const [x, y] = [key(a), key(b)];
      const result =
        typeof x === 'number' && typeof y === 'number' ? x - y : compareText(String(x), String(y));
      return result * factor || compareText(b.certificate.date, a.certificate.date);
    });
  });

  protected readonly total = computed(() => this.sortedRows().length);
  protected readonly pageRows = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.sortedRows().slice(start, start + this.pageSize());
  });

  constructor() {
    // URL → campo de funcionário.
    effect(() => {
      const registration = this.registration();
      if (this.employeeControl.value !== registration) {
        this.employeeControl.setValue(registration);
      }
    });
    // Campo de funcionário → URL.
    this.employeeControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((registration) => {
      if (registration !== this.registration()) {
        this.updateFilters({ matricula: registration || null });
      }
    });
  }

  protected selectKind(kind: CertificateKind): void {
    this.updateFilters({ tipo: KIND_PARAM[kind] });
  }

  protected selectPeriod(startYear: number): void {
    this.updateFilters({ periodo: startYear });
  }

  protected selectMode(mode: HourMode | 'all'): void {
    this.updateFilters({ modo: mode === 'all' ? 'todos' : normalizeText(mode) });
  }

  protected selectStatus(status: HourStatus | 'all'): void {
    this.updateFilters({ status: status === 'all' ? null : normalizeText(status) });
  }

  protected clearFilters(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tipo: KIND_PARAM[this.kind()] },
    });
  }

  protected onPage(event: PageEvent): void {
    this.pageSize.set(event.pageSize);
    this.pageIndex.set(event.pageIndex);
  }

  protected create(): void {
    const mode = this.mode();
    void this.actions.create(this.kind(), {
      registration: this.registration() || undefined,
      mode: mode === 'all' ? undefined : mode,
    });
  }

  protected retry(): void {
    this.certificatesService.reload();
  }

  private updateFilters(changes: Params): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: changes,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
