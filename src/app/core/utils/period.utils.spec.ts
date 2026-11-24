import {
  currentPeriod,
  isWithinPeriod,
  periodContaining,
  periodOf,
  periodsBetween,
} from './period.utils';

describe('períodos de consulta (maio a abril)', () => {
  it('monta o período a partir do ano inicial', () => {
    expect(periodOf(2025)).toEqual({
      startYear: 2025,
      start: '2025-05-01',
      end: '2026-04-30',
      label: '2025/2026',
    });
  });

  it('janeiro a abril pertencem ao período iniciado no ano anterior', () => {
    expect(periodContaining('2026-01-15').startYear).toBe(2025);
    expect(periodContaining('2026-04-30').startYear).toBe(2025);
    expect(periodContaining('2026-05-01').startYear).toBe(2026);
  });

  it('o período vigente em fevereiro é o do ano anterior (bug do sistema original)', () => {
    expect(currentPeriod(new Date(2026, 1, 10)).label).toBe('2025/2026');
    expect(currentPeriod(new Date(2026, 10, 24)).label).toBe('2026/2027');
  });

  it('verifica se a data está dentro do período, incluindo os extremos', () => {
    const period = periodOf(2024);
    expect(isWithinPeriod('2024-05-01', period)).toBe(true);
    expect(isWithinPeriod('2025-04-30', period)).toBe(true);
    expect(isWithinPeriod('2024-04-30', period)).toBe(false);
    expect(isWithinPeriod('2025-05-01', period)).toBe(false);
  });

  it('lista períodos do mais recente para o mais antigo', () => {
    expect(periodsBetween(2023, 2025).map((p) => p.label)).toEqual([
      '2025/2026',
      '2024/2025',
      '2023/2024',
    ]);
  });
});
