import { DocumentData, StoredDocument } from '../data/data-store';
import {
  Certificate,
  CertificateDraft,
  CertificateKind,
  HOUR_MODES,
  HOUR_STATUSES,
  HourMode,
  HourStatus,
} from '../models/certificate.model';
import { formatDateBr, parseDateValue, parseTimeValue } from '../utils/date.utils';
import { cleanString, normalizeText } from '../utils/text.utils';

/**
 * Valor que o sistema original grava nos campos que não se aplicam ao tipo de atestado.
 * Continuamos gravando igual para que os dados sigam compatíveis com a versão anterior.
 */
export const LEGACY_EMPTY = '******************';

const LEGACY_TYPES: Readonly<Record<CertificateKind, string>> = {
  day: 'Atestado de dia',
  hour: 'Atestado de hora',
  donation: 'Atestado de doação',
};

export function kindFromLegacyType(type: unknown): CertificateKind | null {
  switch (normalizeText(cleanString(type))) {
    case 'atestado de dia':
      return 'day';
    case 'atestado de hora':
      return 'hour';
    case 'atestado de doacao':
      return 'donation';
    default:
      return null;
  }
}

function pickOption<T extends string>(options: readonly T[], value: unknown): T | null {
  const text = normalizeText(cleanString(value));
  return options.find((option) => normalizeText(option) === text) ?? null;
}

/**
 * Converte um documento do Firestore (formato do sistema original) em atestado.
 * Retorna null quando o tipo ou a data principal não podem ser interpretados.
 */
export function toCertificate(document: StoredDocument): Certificate | null {
  const data = document.data;
  const kind = kindFromLegacyType(data['type']);
  const date = parseDateValue(data['startDay']);
  if (!kind || !date) {
    return null;
  }
  const base = { id: document.id, registration: cleanString(data['registration']), date };
  switch (kind) {
    case 'day': {
      const endDate = parseDateValue(data['endDay']);
      return { ...base, kind, endDate: endDate && endDate >= date ? endDate : date };
    }
    case 'hour':
      return {
        ...base,
        kind,
        startTime: parseTimeValue(data['startHour']),
        endTime: parseTimeValue(data['endHour']),
        mode: pickOption<HourMode>(HOUR_MODES, data['mode']),
        status: pickOption<HourStatus>(HOUR_STATUSES, data['status']),
      };
    case 'donation':
      return { ...base, kind, dayOff: parseDateValue(data['dayOff']) };
  }
}

/** Converte um atestado para o formato de documento do sistema original. */
export function toCertificateDocument(draft: CertificateDraft): DocumentData {
  const base: DocumentData = {
    registration: draft.registration,
    type: LEGACY_TYPES[draft.kind],
    startDay: formatDateBr(draft.date),
    endDay: LEGACY_EMPTY,
    startHour: LEGACY_EMPTY,
    endHour: LEGACY_EMPTY,
    dayOff: LEGACY_EMPTY,
    mode: LEGACY_EMPTY,
  };
  switch (draft.kind) {
    case 'day':
      return { ...base, endDay: formatDateBr(draft.endDate) };
    case 'hour':
      return {
        ...base,
        startHour: draft.startTime ?? '',
        endHour: draft.endTime ?? '',
        mode: draft.mode ?? '',
        status: draft.status ?? '',
      };
    case 'donation':
      return { ...base, dayOff: draft.dayOff ? formatDateBr(draft.dayOff) : '' };
  }
}
