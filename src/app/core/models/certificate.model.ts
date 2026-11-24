import { IsoDate, TimeOfDay } from '../utils/date.utils';

export type CertificateKind = 'day' | 'hour' | 'donation';

export const HOUR_MODES = ['Comparecimento', 'Acompanhamento'] as const;
export type HourMode = (typeof HOUR_MODES)[number];

export const HOUR_STATUSES = ['Confirmado', 'Pendente'] as const;
export type HourStatus = (typeof HOUR_STATUSES)[number];

interface CertificateBase {
  readonly id: string;
  readonly registration: string;
  /** Data do atestado (início, no atestado de dia). */
  readonly date: IsoDate;
}

export interface DayCertificate extends CertificateBase {
  readonly kind: 'day';
  readonly endDate: IsoDate;
}

export interface HourCertificate extends CertificateBase {
  readonly kind: 'hour';
  /** Null quando o registro antigo tem um horário ilegível. */
  readonly startTime: TimeOfDay | null;
  readonly endTime: TimeOfDay | null;
  readonly mode: HourMode | null;
  /** Null em registros criados antes de o status existir. */
  readonly status: HourStatus | null;
}

export interface DonationCertificate extends CertificateBase {
  readonly kind: 'donation';
  readonly dayOff: IsoDate | null;
}

export type Certificate = DayCertificate | HourCertificate | DonationCertificate;

type DraftOf<T> = T extends Certificate ? Omit<T, 'id'> : never;
export type CertificateDraft = DraftOf<Certificate>;

export interface CertificateKindInfo {
  readonly kind: CertificateKind;
  readonly label: string;
  readonly pluralLabel: string;
  readonly shortLabel: string;
  readonly icon: string;
}

export const CERTIFICATE_KINDS: Readonly<Record<CertificateKind, CertificateKindInfo>> = {
  day: {
    kind: 'day',
    label: 'Atestado de dia',
    pluralLabel: 'Atestados de dia',
    shortLabel: 'Dia',
    icon: 'calendar_month',
  },
  hour: {
    kind: 'hour',
    label: 'Atestado de hora',
    pluralLabel: 'Atestados de hora',
    shortLabel: 'Hora',
    icon: 'schedule',
  },
  donation: {
    kind: 'donation',
    label: 'Atestado de doação',
    pluralLabel: 'Atestados de doação',
    shortLabel: 'Doação',
    icon: 'volunteer_activism',
  },
};

export const CERTIFICATE_KIND_LIST: readonly CertificateKindInfo[] = [
  CERTIFICATE_KINDS.day,
  CERTIFICATE_KINDS.hour,
  CERTIFICATE_KINDS.donation,
];

export function isCertificateKind(value: unknown): value is CertificateKind {
  return value === 'day' || value === 'hour' || value === 'donation';
}
