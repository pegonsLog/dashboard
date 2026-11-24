import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AuthService } from '../../core/auth/auth.service';
import {
  CERTIFICATE_KINDS,
  CERTIFICATE_KIND_LIST,
  Certificate,
  CertificateKind,
} from '../../core/models/certificate.model';
import { CertificatesService } from '../../core/services/certificates.service';
import { EmployeesService } from '../../core/services/employees.service';
import { dayMonthParts, formatDurationLong, monthName } from '../../core/utils/date.utils';
import { currentPeriod, isWithinPeriod } from '../../core/utils/period.utils';
import { plural } from '../../core/utils/text.utils';
import { CertificateActionsService } from '../certificates/certificate-actions.service';
import { describeCertificate, summarize } from '../certificates/certificate-rules';

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

@Component({
  selector: 'app-home-page',
  imports: [MatButtonModule, MatIconModule, MatProgressBarModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {
  private readonly certificatesService = inject(CertificatesService);
  private readonly employeesService = inject(EmployeesService);
  protected readonly actions = inject(CertificateActionsService);
  protected readonly greeting = inject(AuthService).greeting;

  protected readonly kinds = CERTIFICATE_KIND_LIST;
  protected readonly loading = computed(
    () => this.certificatesService.loading() || this.employeesService.loading(),
  );
  protected readonly today = capitalize(
    format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR }),
  );
  protected readonly period = currentPeriod();
  protected readonly monthName = monthName(new Date().getMonth() + 1);

  private readonly inPeriod = computed(() =>
    this.certificatesService.certificates().filter((c) => isWithinPeriod(c.date, this.period)),
  );

  protected readonly stats = computed(() => {
    const byKind = (kind: CertificateKind) => this.inPeriod().filter((c) => c.kind === kind);
    const day = summarize(byKind('day'));
    const hour = summarize(byKind('hour'));
    const donation = summarize(byKind('donation'));
    return [
      {
        kind: 'day' as const,
        param: 'dia',
        value: day.count,
        detail: `${plural(day.totalDays, 'dia')} de afastamento`,
      },
      {
        kind: 'hour' as const,
        param: 'hora',
        value: hour.count,
        detail: `${formatDurationLong(hour.totalMinutes)} no total`,
      },
      {
        kind: 'donation' as const,
        param: 'doacao',
        value: donation.count,
        detail: donation.count === 1 ? 'doação registrada' : 'doações registradas',
      },
    ].map((stat) => ({ ...stat, info: CERTIFICATE_KINDS[stat.kind] }));
  });

  protected readonly pendingCount = computed(() => summarize(this.inPeriod()).pendingCount);

  protected readonly birthdays = computed(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    return this.employeesService
      .employees()
      .filter((e) => e.birthday && dayMonthParts(e.birthday).month === month)
      .map((e) => ({ ...e, day: dayMonthParts(e.birthday as string).day }))
      .sort((a, b) => a.day - b.day)
      .map((e) => ({ ...e, isToday: e.day === now.getDate(), isPast: e.day < now.getDate() }));
  });

  protected readonly recent = computed(() =>
    [...this.certificatesService.certificates()]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 6)
      .map((certificate) => ({
        certificate,
        info: CERTIFICATE_KINDS[certificate.kind],
        employeeName: this.employeesService.displayName(certificate.registration),
        description: describeCertificate(certificate),
      })),
  );

  protected edit(certificate: Certificate): void {
    void this.actions.edit(certificate);
  }
}
