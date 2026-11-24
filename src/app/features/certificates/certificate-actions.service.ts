import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import {
  CERTIFICATE_KINDS,
  Certificate,
  CertificateKind,
  HourMode,
} from '../../core/models/certificate.model';
import { CertificatesService } from '../../core/services/certificates.service';
import { EmployeesService } from '../../core/services/employees.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConfirmService } from '../../shared/confirm/confirm-dialog.component';
import {
  CertificateDialogComponent,
  CertificateDialogData,
} from './certificate-dialog/certificate-dialog.component';
import { describeCertificate } from './certificate-rules';

/** Ações de atestado usadas pelo menu lateral, pela página inicial e pela consulta. */
@Injectable({ providedIn: 'root' })
export class CertificateActionsService {
  private readonly dialog = inject(MatDialog);
  private readonly confirm = inject(ConfirmService);
  private readonly certificatesService = inject(CertificatesService);
  private readonly employeesService = inject(EmployeesService);
  private readonly notifications = inject(NotificationService);

  /** Abre o modal de inclusão. Resolve true quando o atestado foi salvo. */
  create(
    kind: CertificateKind,
    defaults?: { registration?: string; mode?: HourMode },
  ): Promise<boolean> {
    // Com o funcionário já escolhido, o cursor começa na data (sem abrir a lista de funcionários).
    return this.open(
      { kind, defaults },
      defaults?.registration ? 'input[formcontrolname="date"]' : 'first-tabbable',
    );
  }

  edit(certificate: Certificate): Promise<boolean> {
    return this.open({ kind: certificate.kind, certificate }, 'dialog');
  }

  async remove(certificate: Certificate): Promise<boolean> {
    const confirmed = await this.confirm.ask({
      title: `Excluir ${CERTIFICATE_KINDS[certificate.kind].label.toLowerCase()}`,
      message: 'Esta ação não pode ser desfeita. Deseja excluir o atestado abaixo?',
      details: [
        `${this.employeesService.displayName(certificate.registration)} (mat. ${certificate.registration})`,
        describeCertificate(certificate),
      ],
      tone: 'danger',
    });
    if (!confirmed) {
      return false;
    }
    try {
      await this.certificatesService.remove(certificate.id);
      this.notifications.success('Atestado excluído.');
      return true;
    } catch (error) {
      this.notifications.error('Não foi possível excluir o atestado. Tente novamente.', error);
      return false;
    }
  }

  private async open(data: CertificateDialogData, autoFocus: string): Promise<boolean> {
    const reference = this.dialog.open<CertificateDialogComponent, CertificateDialogData, boolean>(
      CertificateDialogComponent,
      { data, autoFocus },
    );
    return (await firstValueFrom(reference.afterClosed())) === true;
  }
}
