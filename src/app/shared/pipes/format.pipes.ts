import { Pipe, PipeTransform } from '@angular/core';
import {
  IsoDate,
  formatDateBr,
  formatDurationLong,
  formatDurationShort,
} from '../../core/utils/date.utils';

/** `'2025-03-05' | brDate` → `05/03/2025`. */
@Pipe({ name: 'brDate' })
export class BrDatePipe implements PipeTransform {
  transform(value: IsoDate | null | undefined, fallback = '—'): string {
    return value ? formatDateBr(value) : fallback;
  }
}

/** `150 | duration` → `2h 30min`; `150 | duration: 'long'` → `2 horas e 30 minutos`. */
@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {
  transform(minutes: number | null | undefined, style: 'short' | 'long' = 'short'): string {
    if (minutes == null) {
      return '—';
    }
    return style === 'long' ? formatDurationLong(minutes) : formatDurationShort(minutes);
  }
}
