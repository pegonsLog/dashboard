import { BreakpointObserver } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { DEMO_MODE } from '../../core/data/data-store';
import { CertificateKind } from '../../core/models/certificate.model';
import { NotificationService } from '../../core/services/notification.service';
import { CertificateActionsService } from '../../features/certificates/certificate-actions.service';
import { NAV_SECTIONS, NavItem } from './nav-items';

@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  private readonly certificateActions = inject(CertificateActionsService);

  protected readonly sections = NAV_SECTIONS;
  protected readonly demoMode = inject(DEMO_MODE);
  protected readonly session = this.auth.session;
  protected readonly greeting = this.auth.greeting;

  /** Em telas pequenas o menu abre por cima do conteúdo. */
  protected readonly compact = toSignal(
    inject(BreakpointObserver)
      .observe('(max-width: 959.98px)')
      .pipe(map((state) => state.matches)),
    { initialValue: false },
  );
  protected readonly menuOpen = signal(true);

  protected readonly initials = computed(() => {
    const parts = (this.session()?.name ?? '').split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
    return (first + last).toUpperCase();
  });

  constructor() {
    // Abre o menu fixo em telas grandes e fechado em telas pequenas.
    effect(() => this.menuOpen.set(!this.compact()));

    // Em telas pequenas, fecha o menu depois de navegar.
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        if (this.compact()) {
          this.menuOpen.set(false);
        }
      });

    void this.auth.verifySession().then((result) => {
      if (result === 'removed') {
        this.notifications.error('Seu usuário não existe mais. Entre novamente.');
      }
    });
  }

  protected run(item: NavItem): void {
    if (item.createKind) {
      void this.certificateActions.create(item.createKind as CertificateKind);
      if (this.compact()) {
        this.menuOpen.set(false);
      }
    }
  }

  protected logout(): void {
    this.auth.logout();
  }
}
