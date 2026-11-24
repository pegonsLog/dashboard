import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isValid } from 'date-fns';
import { parseDayMonth, toIsoDate } from '../../core/utils/date.utils';

function asDate(value: unknown): Date | null {
  return value instanceof Date && isValid(value) ? value : null;
}

/** Exige que o campo `end` seja igual ou posterior ao campo `start` (datas). */
export function dateRangeValidator(start: string, end: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const from = asDate(group.get(start)?.value);
    const to = asDate(group.get(end)?.value);
    if (!from || !to) {
      return null;
    }
    return toIsoDate(to) < toIsoDate(from) ? { dateRange: true } : null;
  };
}

/** Exige que o horário `end` seja posterior ao horário `start`. */
export function timeRangeValidator(start: string, end: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const from = asDate(group.get(start)?.value);
    const to = asDate(group.get(end)?.value);
    if (!from || !to) {
      return null;
    }
    const fromMinutes = from.getHours() * 60 + from.getMinutes();
    const toMinutes = to.getHours() * 60 + to.getMinutes();
    return toMinutes <= fromMinutes ? { timeRange: true } : null;
  };
}

/** Aniversário opcional no formato dd/MM, com dia existente no mês. */
export const dayMonthValidator: ValidatorFn = (control) => {
  const value = typeof control.value === 'string' ? control.value.trim() : '';
  if (!value) {
    return null;
  }
  return parseDayMonth(value) ? null : { dayMonth: true };
};

/** Rejeita valores já usados por outro registro (ex.: matrícula repetida). */
export function uniqueValidator(isTaken: (value: string) => boolean): ValidatorFn {
  return (control) => {
    const value = typeof control.value === 'string' ? control.value.trim() : '';
    return value && isTaken(value) ? { taken: true } : null;
  };
}

/** Rejeita textos compostos só por espaços. */
export const notBlankValidator: ValidatorFn = (control) =>
  typeof control.value === 'string' && control.value.length > 0 && !control.value.trim()
    ? { required: true }
    : null;
