import { Certificate } from '../../core/models/certificate.model';
import { periodOf } from '../../core/utils/period.utils';
import {
  CertificateFilter,
  filterCertificates,
  findConflicts,
  summarize,
} from './certificate-rules';

const hour = (
  id: string,
  date: string,
  startTime: string | null,
  endTime: string | null,
  overrides: Partial<Extract<Certificate, { kind: 'hour' }>> = {},
): Certificate => ({
  id,
  kind: 'hour',
  registration: '1009',
  date,
  startTime,
  endTime,
  mode: 'Comparecimento',
  status: 'Confirmado',
  ...overrides,
});

const certificates: Certificate[] = [
  hour('h1', '2025-05-10', '08:00', '10:30'),
  hour('h2', '2025-06-01', '13:00', '14:15', { status: 'Pendente' }),
  hour('h3', '2025-06-02', '09:00', '10:00', { mode: 'Acompanhamento' }),
  hour('h4', '2025-04-30', '08:00', '09:00'),
  hour('h5', '2025-07-01', '08:00', '09:00', { registration: '737' }),
  { id: 'd1', kind: 'day', registration: '1009', date: '2025-08-01', endDate: '2025-08-03' },
  { id: 'n1', kind: 'donation', registration: '1009', date: '2025-09-01', dayOff: null },
];

const filter: CertificateFilter = {
  kind: 'hour',
  registration: '1009',
  period: periodOf(2025),
  mode: 'Comparecimento',
  status: 'all',
};

describe('filterCertificates', () => {
  it('filtra por tipo, funcionário, período e modo', () => {
    expect(filterCertificates(certificates, filter).map((c) => c.id)).toEqual(['h1', 'h2']);
  });

  it('permite consultar todos os funcionários, modos e status', () => {
    const all = filterCertificates(certificates, { ...filter, registration: '', mode: 'all' });
    expect(all.map((c) => c.id)).toEqual(['h1', 'h2', 'h3', 'h5']);
  });

  it('filtra por status', () => {
    const pending = filterCertificates(certificates, { ...filter, status: 'Pendente' });
    expect(pending.map((c) => c.id)).toEqual(['h2']);
  });
});

describe('summarize', () => {
  it('soma o saldo de horas e destaca pendentes', () => {
    const summary = summarize(filterCertificates(certificates, filter));
    expect(summary.totalMinutes).toBe(150 + 75);
    expect(summary.pendingMinutes).toBe(75);
    expect(summary.pendingCount).toBe(1);
  });

  it('não deixa horários inválidos ou invertidos deixarem o saldo negativo', () => {
    const summary = summarize([
      hour('a', '2025-05-10', '10:00', '08:00'),
      hour('b', '2025-05-11', null, '09:00'),
      hour('c', '2025-05-12', '08:00', '09:00'),
    ]);
    expect(summary.totalMinutes).toBe(60);
    expect(summary.invalidTimeCount).toBe(2);
  });

  it('conta os dias de afastamento incluindo início e término', () => {
    expect(summarize(certificates.filter((c) => c.kind === 'day')).totalDays).toBe(3);
  });
});

describe('findConflicts', () => {
  it('encontra horários sobrepostos no mesmo dia', () => {
    const draft = {
      kind: 'hour' as const,
      registration: '1009',
      date: '2025-05-10',
      startTime: '10:00',
      endTime: '11:00',
      mode: 'Comparecimento' as const,
      status: 'Confirmado' as const,
    };
    expect(findConflicts(draft, certificates).map((c) => c.id)).toEqual(['h1']);
    expect(findConflicts({ ...draft, startTime: '10:30' }, certificates)).toEqual([]);
    expect(findConflicts(draft, certificates, 'h1')).toEqual([]);
  });

  it('encontra dias sobrepostos', () => {
    const draft = {
      kind: 'day' as const,
      registration: '1009',
      date: '2025-08-03',
      endDate: '2025-08-05',
    };
    expect(findConflicts(draft, certificates).map((c) => c.id)).toEqual(['d1']);
    expect(findConflicts({ ...draft, registration: '737' }, certificates)).toEqual([]);
  });
});
