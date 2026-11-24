import {
  daysBetweenInclusive,
  formatDateBr,
  formatDurationLong,
  formatDurationShort,
  minutesBetween,
  parseDateValue,
  parseDayMonth,
  parseTimeValue,
} from './date.utils';

describe('parseDateValue', () => {
  it('aceita o formato legado dd/MM/yyyy', () => {
    expect(parseDateValue('25/12/2024')).toBe('2024-12-25');
    expect(parseDateValue(' 05/03/2025 ')).toBe('2025-03-05');
  });

  it('aceita variações digitadas nas telas de alteração antigas', () => {
    expect(parseDateValue('5/3/2025')).toBe('2025-03-05');
    expect(parseDateValue('05-03-2025')).toBe('2025-03-05');
    expect(parseDateValue('05.03.25')).toBe('2025-03-05');
    expect(parseDateValue('05032025')).toBe('2025-03-05');
  });

  it('aceita ISO, Date e Timestamp do Firestore', () => {
    expect(parseDateValue('2025-03-05')).toBe('2025-03-05');
    expect(parseDateValue(new Date(2025, 2, 5))).toBe('2025-03-05');
    expect(parseDateValue({ toDate: () => new Date(2025, 2, 5) })).toBe('2025-03-05');
  });

  it('rejeita datas inexistentes e valores inválidos', () => {
    expect(parseDateValue('31/02/2024')).toBeNull();
    expect(parseDateValue('******************')).toBeNull();
    expect(parseDateValue('')).toBeNull();
    expect(parseDateValue(undefined)).toBeNull();
    expect(parseDateValue('25/12/0024')).toBeNull();
    expect(parseDateValue(12345)).toBeNull();
  });
});

describe('formatDateBr', () => {
  it('formata como dd/MM/yyyy', () => {
    expect(formatDateBr('2024-12-25')).toBe('25/12/2024');
    expect(formatDateBr(null)).toBe('');
  });
});

describe('daysBetweenInclusive', () => {
  it('conta o primeiro e o último dia', () => {
    expect(daysBetweenInclusive('2025-03-05', '2025-03-05')).toBe(1);
    expect(daysBetweenInclusive('2025-02-27', '2025-03-02')).toBe(4);
  });

  it('não é afetado pelo horário de verão', () => {
    expect(daysBetweenInclusive('2018-11-03', '2018-11-05')).toBe(3);
  });
});

describe('parseTimeValue', () => {
  it('normaliza horários em HH:mm', () => {
    expect(parseTimeValue('08:30')).toBe('08:30');
    expect(parseTimeValue('8:30')).toBe('08:30');
    expect(parseTimeValue('0830')).toBe('08:30');
    expect(parseTimeValue('8h30')).toBe('08:30');
    expect(parseTimeValue('8h')).toBe('08:00');
    expect(parseTimeValue(new Date(2025, 0, 1, 14, 5))).toBe('14:05');
  });

  it('rejeita horários inválidos', () => {
    expect(parseTimeValue('24:00')).toBeNull();
    expect(parseTimeValue('10:60')).toBeNull();
    expect(parseTimeValue('******************')).toBeNull();
    expect(parseTimeValue('')).toBeNull();
  });
});

describe('durações', () => {
  it('calcula minutos entre horários', () => {
    expect(minutesBetween('08:00', '10:30')).toBe(150);
    expect(minutesBetween('08:00', null)).toBeNull();
  });

  it('formata por extenso', () => {
    expect(formatDurationLong(150)).toBe('2 horas e 30 minutos');
    expect(formatDurationLong(61)).toBe('1 hora e 1 minuto');
    expect(formatDurationLong(45)).toBe('45 minutos');
    expect(formatDurationLong(120)).toBe('2 horas');
    expect(formatDurationLong(0)).toBe('0 horas');
  });

  it('formata de forma curta', () => {
    expect(formatDurationShort(150)).toBe('2h 30min');
    expect(formatDurationShort(65)).toBe('1h 05min');
    expect(formatDurationShort(45)).toBe('45min');
    expect(formatDurationShort(60)).toBe('1h');
  });
});

describe('parseDayMonth', () => {
  it('normaliza aniversários em dd/MM', () => {
    expect(parseDayMonth('05/03')).toBe('05/03');
    expect(parseDayMonth('5/3')).toBe('05/03');
    expect(parseDayMonth('0503')).toBe('05/03');
    expect(parseDayMonth('05/03/1980')).toBe('05/03');
    expect(parseDayMonth('29/02')).toBe('29/02');
  });

  it('rejeita dias inexistentes', () => {
    expect(parseDayMonth('31/04')).toBeNull();
    expect(parseDayMonth('30/02')).toBeNull();
    expect(parseDayMonth('00/01')).toBeNull();
    expect(parseDayMonth('')).toBeNull();
    expect(parseDayMonth(undefined)).toBeNull();
  });
});
