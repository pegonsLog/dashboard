import { differenceInCalendarDays, format, isValid } from 'date-fns';

/** Data sem horário no formato ISO `yyyy-MM-dd` (ordenável e comparável como texto). */
export type IsoDate = string;

/** Horário no formato `HH:mm` (24 horas). */
export type TimeOfDay = string;

/** Dia e mês no formato `dd/MM` (usado no aniversário). */
export type DayMonth = string;

const MIN_YEAR = 1900;
const MAX_YEAR = 2199;

const ISO_DATE = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:T.*)?$/;
const BR_DATE = /^(\d{1,2})\s*[/.-]\s*(\d{1,2})\s*[/.-]\s*(\d{4}|\d{2})$/;
const COMPACT_BR_DATE = /^(\d{2})(\d{2})(\d{4})$/;

const TIME = /^(\d{1,2})(?:\s*[:hH.]\s*(\d{2})?)?\s*(?:min)?$/;
const COMPACT_TIME = /^(\d{2})(\d{2})$/;

const DAY_MONTH = /^(\d{1,2})\s*[/.-]\s*(\d{1,2})(?:\s*[/.-]\s*\d{2,4})?$/;
const COMPACT_DAY_MONTH = /^(\d{2})(\d{2})$/;

const pad = (value: number, size = 2): string => String(value).padStart(size, '0');

/** Monta uma IsoDate validando se o dia existe (ex.: 31/02 é inválido). */
export function isoDateFromParts(year: number, month: number, day: number): IsoDate | null {
  if (year < MIN_YEAR || year > MAX_YEAR) {
    return null;
  }
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return `${pad(year, 4)}-${pad(month)}-${pad(day)}`;
}

/** Converte um Date (horário local) em IsoDate. */
export function toIsoDate(date: Date): IsoDate {
  return format(date, 'yyyy-MM-dd');
}

/** Converte uma IsoDate em Date à meia-noite do horário local. */
export function isoToDate(iso: IsoDate): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function todayIso(): IsoDate {
  return toIsoDate(new Date());
}

function hasToDate(value: object): value is { toDate(): unknown } {
  return 'toDate' in value && typeof (value as { toDate: unknown }).toDate === 'function';
}

/**
 * Interpreta datas no formato legado (`dd/MM/yyyy`, `d/M/yy`, `ddMMyyyy`),
 * ISO (`yyyy-MM-dd`), `Date` ou `Timestamp` do Firestore.
 */
export function parseDateValue(value: unknown): IsoDate | null {
  if (value == null) {
    return null;
  }
  if (value instanceof Date) {
    return isValid(value) ? toIsoDate(value) : null;
  }
  if (typeof value === 'object') {
    return hasToDate(value) ? parseDateValue(value.toDate()) : null;
  }
  if (typeof value !== 'string') {
    return null;
  }
  const text = value.trim();
  const iso = ISO_DATE.exec(text);
  if (iso) {
    return isoDateFromParts(Number(iso[1]), Number(iso[2]), Number(iso[3]));
  }
  const br = BR_DATE.exec(text) ?? COMPACT_BR_DATE.exec(text);
  if (br) {
    const year = br[3].length === 2 ? 2000 + Number(br[3]) : Number(br[3]);
    return isoDateFromParts(year, Number(br[2]), Number(br[1]));
  }
  return null;
}

/** Formata uma IsoDate como `dd/MM/yyyy`. */
export function formatDateBr(iso: IsoDate | null | undefined): string {
  if (!iso) {
    return '';
  }
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}

/** Quantidade de dias entre duas datas, contando o primeiro e o último dia. */
export function daysBetweenInclusive(start: IsoDate, end: IsoDate): number {
  return differenceInCalendarDays(isoToDate(end), isoToDate(start)) + 1;
}

/** Interpreta horários como `08:30`, `8:30`, `0830`, `8h30`, `8h` ou um `Date`. */
export function parseTimeValue(value: unknown): TimeOfDay | null {
  if (value instanceof Date) {
    return isValid(value) ? format(value, 'HH:mm') : null;
  }
  if (typeof value !== 'string') {
    return null;
  }
  const text = value.trim();
  const match = COMPACT_TIME.exec(text) ?? TIME.exec(text);
  if (!match) {
    return null;
  }
  const hours = Number(match[1]);
  const minutes = match[2] ? Number(match[2]) : 0;
  if (hours > 23 || minutes > 59) {
    return null;
  }
  return `${pad(hours)}:${pad(minutes)}`;
}

export function timeToMinutes(time: TimeOfDay): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/** Converte `HH:mm` em um Date de hoje com esse horário (para o timepicker). */
export function timeToDate(time: TimeOfDay, base = new Date()): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date(base);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

/** Duração entre dois horários em minutos. Retorna null se algum horário estiver ausente. */
export function minutesBetween(
  start: TimeOfDay | null | undefined,
  end: TimeOfDay | null | undefined,
): number | null {
  if (!start || !end) {
    return null;
  }
  return timeToMinutes(end) - timeToMinutes(start);
}

/** Ex.: "2 horas e 30 minutos", "45 minutos", "1 hora". */
export function formatDurationLong(totalMinutes: number): string {
  const sign = totalMinutes < 0 ? '-' : '';
  const absolute = Math.abs(totalMinutes);
  const hours = Math.floor(absolute / 60);
  const minutes = absolute % 60;
  const hoursText = `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  const minutesText = `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  if (hours && minutes) {
    return `${sign}${hoursText} e ${minutesText}`;
  }
  if (minutes) {
    return `${sign}${minutesText}`;
  }
  return `${sign}${hoursText}`;
}

/** Ex.: "2h 30min", "45min", "1h". */
export function formatDurationShort(totalMinutes: number): string {
  const sign = totalMinutes < 0 ? '-' : '';
  const absolute = Math.abs(totalMinutes);
  const hours = Math.floor(absolute / 60);
  const minutes = absolute % 60;
  if (hours && minutes) {
    return `${sign}${hours}h ${pad(minutes)}min`;
  }
  if (minutes) {
    return `${sign}${minutes}min`;
  }
  return `${sign}${hours}h`;
}

/** Quantidade de dias do mês (fevereiro considera 29 para aceitar aniversários em ano bissexto). */
export function daysInMonth(month: number): number {
  return new Date(2024, month, 0).getDate();
}

/** Interpreta aniversários como `05/03`, `5/3`, `0503` ou `05/03/1980` (o ano é ignorado). */
export function parseDayMonth(value: unknown): DayMonth | null {
  if (value instanceof Date) {
    return isValid(value) ? format(value, 'dd/MM') : null;
  }
  if (typeof value !== 'string') {
    return null;
  }
  const text = value.trim();
  const match = COMPACT_DAY_MONTH.exec(text) ?? DAY_MONTH.exec(text);
  if (!match) {
    return null;
  }
  const day = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(month)) {
    return null;
  }
  return `${pad(day)}/${pad(month)}`;
}

export function dayMonthParts(value: DayMonth): { day: number; month: number } {
  const [day, month] = value.split('/').map(Number);
  return { day, month };
}

export const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
] as const;

/** Nome do mês (1 a 12). */
export function monthName(month: number): string {
  return MONTH_NAMES[month - 1] ?? '';
}
