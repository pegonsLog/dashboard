import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Employee } from '../../core/models/employee.model';
import { CertificatesService } from '../../core/services/certificates.service';
import { EmployeesService } from '../../core/services/employees.service';
import { NotificationService } from '../../core/services/notification.service';
import { dayMonthParts } from '../../core/utils/date.utils';
import { compareText, normalizeText, plural } from '../../core/utils/text.utils';
import { ConfirmService } from '../../shared/confirm/confirm-dialog.component';
import {
  EmployeeDialogComponent,
  EmployeeDialogData,
} from './employee-dialog/employee-dialog.component';

@Component({
  selector: 'app-employees-page',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './employees.page.html',
  styleUrl: './employees.page.scss',
})
export class EmployeesPage {
  private readonly employeesService = inject(EmployeesService);
  private readonly certificatesService = inject(CertificatesService);
  private readonly notifications = inject(NotificationService);
  private readonly confirm = inject(ConfirmService);
  private readonly dialog = inject(MatDialog);

  protected readonly loading = this.employeesService.loading;
  protected readonly failed = this.employeesService.failed;
  protected readonly columns = ['name', 'registration', 'birthday', 'actions'];

  protected readonly search = signal('');
  protected readonly sort = signal<Sort>({ active: 'name', direction: 'asc' });
  protected readonly pageSize = signal(25);
  protected readonly pageIndex = linkedSignal({
    source: () => [this.search(), this.sort(), this.pageSize()],
    computation: () => 0,
  });

  private readonly filtered = computed(() => {
    const text = normalizeText(this.search());
    const employees = this.employeesService.employees();
    return text
      ? employees.filter(
          (e) => normalizeText(e.name).includes(text) || e.registration.startsWith(text),
        )
      : employees;
  });

  private readonly sorted = computed(() => {
    const { active, direction } = this.sort();
    const rows = [...this.filtered()];
    if (!direction) {
      return rows;
    }
    const factor = direction === 'asc' ? 1 : -1;
    const birthdayKey = (e: Employee) => {
      if (!e.birthday) {
        return 9999;
      }
      const { day, month } = dayMonthParts(e.birthday);
      return month * 100 + day;
    };
    return rows.sort((a, b) => {
      switch (active) {
        case 'registration':
          return compareText(a.registration, b.registration) * factor;
        case 'birthday':
          return (birthdayKey(a) - birthdayKey(b)) * factor;
        default:
          return compareText(a.name, b.name) * factor;
      }
    });
  });

  protected readonly total = computed(() => this.sorted().length);
  protected readonly totalText = computed(() =>
    plural(
      this.employeesService.employees().length,
      'funcionário cadastrado',
      'funcionários cadastrados',
    ),
  );
  protected readonly pageRows = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.sorted().slice(start, start + this.pageSize());
  });

  protected onSearch(value: string): void {
    this.search.set(value);
  }

  protected onPage(event: PageEvent): void {
    this.pageSize.set(event.pageSize);
    this.pageIndex.set(event.pageIndex);
  }

  protected create(): void {
    this.open({});
  }

  protected edit(employee: Employee): void {
    this.open({ employee });
  }

  protected async remove(employee: Employee): Promise<void> {
    const linked = this.certificatesService.countByRegistration(employee.registration);
    const confirmed = await this.confirm.ask({
      title: 'Excluir funcionário',
      message: 'Esta ação não pode ser desfeita. Deseja excluir o funcionário abaixo?',
      details: [
        `${employee.name} (matrícula ${employee.registration})`,
        ...(linked
          ? [
              `${plural(linked, 'atestado')} desta matrícula ${linked === 1 ? 'será mantido' : 'serão mantidos'}.`,
            ]
          : []),
      ],
      tone: 'danger',
    });
    if (!confirmed) {
      return;
    }
    try {
      await this.employeesService.remove(employee.id);
      this.notifications.success('Funcionário excluído.');
    } catch (error) {
      this.notifications.error('Não foi possível excluir o funcionário. Tente novamente.', error);
    }
  }

  protected retry(): void {
    this.employeesService.reload();
  }

  private open(data: EmployeeDialogData): void {
    this.dialog.open(EmployeeDialogComponent, {
      data,
      width: '560px',
      autoFocus: data.employee ? 'dialog' : 'first-tabbable',
    });
  }
}
