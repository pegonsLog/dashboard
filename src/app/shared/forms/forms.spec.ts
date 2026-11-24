import { FormControl, FormGroup } from '@angular/forms';
import { applyDigitMask } from './digit-mask.directive';
import {
  dateRangeValidator,
  dayMonthValidator,
  timeRangeValidator,
  uniqueValidator,
} from './validators';

describe('applyDigitMask', () => {
  it('insere os separadores enquanto o usuário digita', () => {
    expect(applyDigitMask('0', '00/00')).toBe('0');
    expect(applyDigitMask('05', '00/00')).toBe('05');
    expect(applyDigitMask('050', '00/00')).toBe('05/0');
    expect(applyDigitMask('0503', '00/00')).toBe('05/03');
    expect(applyDigitMask('05/03/1980', '00/00')).toBe('05/03');
    expect(applyDigitMask('ab', '00/00')).toBe('');
  });
});

describe('validadores', () => {
  it('acusa término anterior ao início', () => {
    const form = new FormGroup(
      {
        start: new FormControl(new Date(2025, 2, 10)),
        end: new FormControl(new Date(2025, 2, 9)),
      },
      { validators: dateRangeValidator('start', 'end') },
    );
    expect(form.hasError('dateRange')).toBe(true);
    form.controls.end.setValue(new Date(2025, 2, 10));
    expect(form.hasError('dateRange')).toBe(false);
  });

  it('exige hora de término posterior à de início', () => {
    const form = new FormGroup(
      {
        start: new FormControl(new Date(2025, 2, 10, 10, 0)),
        end: new FormControl(new Date(2025, 2, 10, 10, 0)),
      },
      { validators: timeRangeValidator('start', 'end') },
    );
    expect(form.hasError('timeRange')).toBe(true);
    form.controls.end.setValue(new Date(2025, 2, 10, 10, 15));
    expect(form.hasError('timeRange')).toBe(false);
  });

  it('valida aniversário opcional', () => {
    expect(dayMonthValidator(new FormControl(''))).toBeNull();
    expect(dayMonthValidator(new FormControl('29/02'))).toBeNull();
    expect(dayMonthValidator(new FormControl('31/04'))).toEqual({ dayMonth: true });
  });

  it('acusa valores repetidos', () => {
    const validator = uniqueValidator((value) => value === '1009');
    expect(validator(new FormControl(' 1009 '))).toEqual({ taken: true });
    expect(validator(new FormControl('1010'))).toBeNull();
  });
});
