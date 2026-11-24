import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

/** O menu "Absenteísmo" existia no sistema original, mas a tela nunca foi implementada. */
@Component({
  selector: 'app-absenteeism-page',
  imports: [MatButtonModule, MatIconModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <h1>Absenteísmo</h1>
          <p>Indicadores de ausência dos funcionários.</p>
        </div>
      </header>
      <div class="card">
        <div class="empty-state">
          <mat-icon>construction</mat-icon>
          <strong>Relatório em desenvolvimento</strong>
          <span>
            Esta tela ainda não existe. Enquanto isso, consulte os atestados por funcionário e
            período.
          </span>
          <a matButton="tonal" routerLink="/atestados">
            <mat-icon>manage_search</mat-icon>
            Consultar atestados
          </a>
        </div>
      </div>
    </section>
  `,
})
export class AbsenteeismPage {}
