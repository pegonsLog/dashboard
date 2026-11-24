import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { EmployeesService } from '../../core/services/employees.service';
import { MONTH_NAMES, dayMonthParts } from '../../core/utils/date.utils';
import { compareText, plural } from '../../core/utils/text.utils';

@Component({
  selector: 'app-birthdays-page',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatSelectModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './birthdays.page.html',
  styleUrl: './birthdays.page.scss',
})
export class BirthdaysPage {
  /** Mês na URL (?mes=3). Sem mês, mostra o mês atual. */
  readonly mes = input<string>();

  private readonly router = inject(Router);
  private readonly employeesService = inject(EmployeesService);

  protected readonly loading = this.employeesService.loading;
  protected readonly months = MONTH_NAMES.map((name, index) => ({ value: index + 1, name }));

  protected readonly month = computed(() => {
    const month = Number(this.mes());
    return Number.isInteger(month) && month >= 1 && month <= 12 ? month : new Date().getMonth() + 1;
  });
  protected readonly monthName = computed(() => MONTH_NAMES[this.month() - 1]);

  protected readonly people = computed(() => {
    const now = new Date();
    const isCurrentMonth = this.month() === now.getMonth() + 1;
    return this.employeesService
      .employees()
      .filter((e) => e.birthday && dayMonthParts(e.birthday).month === this.month())
      .map((e) => {
        const day = dayMonthParts(e.birthday as string).day;
        return { ...e, day, isToday: isCurrentMonth && day === now.getDate() };
      })
      .sort((a, b) => a.day - b.day || compareText(a.name, b.name));
  });

  protected readonly countText = computed(() => plural(this.people().length, 'aniversariante'));

  protected selectMonth(month: number): void {
    void this.router.navigate([], { queryParams: { mes: month }, replaceUrl: true });
  }

  protected print(): void {
    window.print();
  }
}
