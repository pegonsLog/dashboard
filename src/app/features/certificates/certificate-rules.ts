import {
  Certificate,
  CertificateDraft,
  CertificateKind,
  DayCertificate,
  HourCertificate,
  HourMode,
  HourStatus,
} from '../../core/models/certificate.model';
import {
  daysBetweenInclusive,
  formatDateBr,
  minutesBetween,
  timeToMinutes,
} from '../../core/utils/date.utils';
import { Period, isWithinPeriod } from '../../core/utils/period.utils';

export interface CertificateFilter {
  readonly kind: CertificateKind;
  /** '' = todos os funcionários. */
  readonly registration: string;
  readonly period: Period;
  readonly mode: HourMode | 'all';
  readonly status: HourStatus | 'all';
}

/**
 * Mesma regra do sistema original: o atestado pertence ao período da data de início.
 * Modo e status só se aplicam ao atestado de hora.
 */
export function filterCertificates(
  certificates: readonly Certificate[],
  filter: CertificateFilter,
): Certificate[] {
  return certificates.filter((certificate) => {
    if (certificate.kind !== filter.kind) {
      return false;
    }
    if (filter.registration && certificate.registration !== filter.registration) {
      return false;
    }
    if (!isWithinPeriod(certificate.date, filter.period)) {
      return false;
    }
    if (certificate.kind === 'hour') {
      if (filter.mode !== 'all' && certificate.mode !== filter.mode) {
        return false;
      }
      if (filter.status !== 'all' && certificate.status !== filter.status) {
        return false;
      }
    }
    return true;
  });
}

/** Duração do atestado de hora. Null quando os horários estão ausentes ou invertidos. */
export function durationOf(certificate: HourCertificate): number | null {
  const minutes = minutesBetween(certificate.startTime, certificate.endTime);
  return minutes !== null && minutes > 0 ? minutes : null;
}

export function dayCountOf(certificate: DayCertificate): number {
  return daysBetweenInclusive(certificate.date, certificate.endDate);
}

export interface CertificateSummary {
  readonly count: number;
  /** Soma dos dias (atestados de dia). */
  readonly totalDays: number;
  /** Saldo de horas: soma das durações (atestados de hora). */
  readonly totalMinutes: number;
  readonly pendingMinutes: number;
  readonly pendingCount: number;
  /** Atestados de hora com horário ilegível ou término antes do início. */
  readonly invalidTimeCount: number;
}

export function summarize(certificates: readonly Certificate[]): CertificateSummary {
  let totalDays = 0;
  let totalMinutes = 0;
  let pendingMinutes = 0;
  let pendingCount = 0;
  let invalidTimeCount = 0;
  for (const certificate of certificates) {
    if (certificate.kind === 'day') {
      totalDays += dayCountOf(certificate);
    } else if (certificate.kind === 'hour') {
      const minutes = durationOf(certificate);
      if (minutes === null) {
        invalidTimeCount++;
      } else {
        totalMinutes += minutes;
      }
      if (certificate.status === 'Pendente') {
        pendingCount++;
        pendingMinutes += minutes ?? 0;
      }
    }
  }
  return {
    count: certificates.length,
    totalDays,
    totalMinutes,
    pendingMinutes,
    pendingCount,
    invalidTimeCount,
  };
}

/**
 * Atestados do mesmo funcionário e tipo que coincidem com o novo registro
 * (dias sobrepostos, horários sobrepostos no mesmo dia ou doação na mesma data).
 */
export function findConflicts(
  draft: CertificateDraft,
  certificates: readonly Certificate[],
  ignoreId?: string,
): Certificate[] {
  return certificates.filter((other) => {
    if (other.id === ignoreId || other.kind !== draft.kind) {
      return false;
    }
    if (other.registration !== draft.registration) {
      return false;
    }
    switch (draft.kind) {
      case 'day': {
        const end = (other as DayCertificate).endDate;
        return draft.date <= end && other.date <= draft.endDate;
      }
      case 'hour': {
        const hour = other as HourCertificate;
        if (hour.date !== draft.date) {
          return false;
        }
        if (!draft.startTime || !draft.endTime || !hour.startTime || !hour.endTime) {
          return true;
        }
        return (
          timeToMinutes(draft.startTime) < timeToMinutes(hour.endTime) &&
          timeToMinutes(hour.startTime) < timeToMinutes(draft.endTime)
        );
      }
      case 'donation':
        return other.date === draft.date;
    }
  });
}

/** Descrição curta para confirmações. Ex.: "10/05/2025 · 08:00 às 10:30". */
export function describeCertificate(certificate: Certificate): string {
  switch (certificate.kind) {
    case 'day':
      return certificate.endDate === certificate.date
        ? formatDateBr(certificate.date)
        : `${formatDateBr(certificate.date)} a ${formatDateBr(certificate.endDate)}`;
    case 'hour':
      return `${formatDateBr(certificate.date)} · ${certificate.startTime ?? '?'} às ${certificate.endTime ?? '?'}`;
    case 'donation':
      return certificate.dayOff
        ? `Doação em ${formatDateBr(certificate.date)} · folga em ${formatDateBr(certificate.dayOff)}`
        : `Doação em ${formatDateBr(certificate.date)}`;
  }
}

/** Data mais antiga entre os atestados (para montar a lista de períodos). */
export function earliestDate(certificates: readonly Certificate[]): string | null {
  let earliest: string | null = null;
  for (const certificate of certificates) {
    if (!earliest || certificate.date < earliest) {
      earliest = certificate.date;
    }
  }
  return earliest;
}
