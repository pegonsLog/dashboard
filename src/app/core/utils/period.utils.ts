import { IsoDate, isoDateFromParts, isoToDate, toIsoDate } from './date.utils';

/**
 * Os atestados são consultados por período anual que começa em 1º de maio
 * e termina em 30 de abril do ano seguinte (mesma regra do sistema original).
 */
export const PERIOD_START_MONTH: number = 5;

/** Primeiro período oferecido na consulta (o sistema começou a ser usado em 2023). */
export const FIRST_PERIOD_YEAR = 2023;

export interface Period {
  /** Ano em que o período começa. Também é usado como identificador. */
  readonly startYear: number;
  readonly start: IsoDate;
  readonly end: IsoDate;
  /** Ex.: "2025/2026". */
  readonly label: string;
}

export function periodOf(startYear: number): Period {
  const start = isoDateFromParts(startYear, PERIOD_START_MONTH, 1) as IsoDate;
  const nextStart = isoToDate(isoDateFromParts(startYear + 1, PERIOD_START_MONTH, 1) as IsoDate);
  nextStart.setDate(nextStart.getDate() - 1);
  const end = toIsoDate(nextStart);
  const label = PERIOD_START_MONTH === 1 ? `${startYear}` : `${startYear}/${startYear + 1}`;
  return { startYear, start, end, label };
}

/** Ano de início do período que contém a data. */
export function periodStartYearOf(date: IsoDate): number {
  const year = Number(date.slice(0, 4));
  const month = Number(date.slice(5, 7));
  return month >= PERIOD_START_MONTH ? year : year - 1;
}

export function periodContaining(date: IsoDate): Period {
  return periodOf(periodStartYearOf(date));
}

/**
 * Período vigente. Corrige o bug do sistema original, que entre janeiro e abril
 * selecionava o período seguinte em vez do atual.
 */
export function currentPeriod(today: Date = new Date()): Period {
  return periodContaining(toIsoDate(today));
}

export function isWithinPeriod(date: IsoDate, period: Period): boolean {
  return date >= period.start && date <= period.end;
}

/** Lista de períodos do mais recente para o mais antigo. */
export function periodsBetween(fromStartYear: number, toStartYear: number): Period[] {
  const periods: Period[] = [];
  for (let year = toStartYear; year >= fromStartYear; year--) {
    periods.push(periodOf(year));
  }
  return periods;
}
