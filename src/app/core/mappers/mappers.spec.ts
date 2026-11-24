import { LEGACY_EMPTY, toCertificate, toCertificateDocument } from './certificate.mapper';
import { toEmployee, toEmployeeDocument } from './employee.mapper';
import { toUser } from './user.mapper';

describe('toCertificate (documentos do sistema original)', () => {
  it('lê um atestado de dia', () => {
    const certificate = toCertificate({
      id: 'a1',
      data: {
        id: '',
        registration: '1009',
        startDay: '10/03/2025',
        endDay: '12/03/2025',
        startHour: LEGACY_EMPTY,
        endHour: LEGACY_EMPTY,
        dayOff: LEGACY_EMPTY,
        type: 'Atestado de dia',
        mode: LEGACY_EMPTY,
      },
    });
    expect(certificate).toEqual({
      id: 'a1',
      kind: 'day',
      registration: '1009',
      date: '2025-03-10',
      endDate: '2025-03-12',
    });
  });

  it('lê um atestado de hora, inclusive sem status (registros antigos)', () => {
    const certificate = toCertificate({
      id: 'h1',
      data: {
        registration: 737,
        startDay: '5/3/2025',
        startHour: '8:00',
        endHour: '10:30',
        type: 'Atestado de hora',
        mode: 'Acompanhamento',
      },
    });
    expect(certificate).toEqual({
      id: 'h1',
      kind: 'hour',
      registration: '737',
      date: '2025-03-05',
      startTime: '08:00',
      endTime: '10:30',
      mode: 'Acompanhamento',
      status: null,
    });
  });

  it('lê um atestado de doação com folga opcional', () => {
    expect(
      toCertificate({
        id: 'd1',
        data: { registration: '1', startDay: '01/06/2025', dayOff: '', type: 'Atestado de doação' },
      }),
    ).toEqual({ id: 'd1', kind: 'donation', registration: '1', date: '2025-06-01', dayOff: null });
  });

  it('ignora documentos com tipo desconhecido ou sem data válida', () => {
    expect(toCertificate({ id: 'x', data: { type: 'Outro', startDay: '01/01/2025' } })).toBeNull();
    expect(
      toCertificate({ id: 'y', data: { type: 'Atestado de dia', startDay: 'abc' } }),
    ).toBeNull();
  });

  it('corrige atestado de dia com término anterior ao início', () => {
    const certificate = toCertificate({
      id: 'a2',
      data: { type: 'Atestado de dia', startDay: '10/03/2025', endDay: '01/03/2025' },
    });
    expect(certificate).toMatchObject({ date: '2025-03-10', endDate: '2025-03-10' });
  });
});

describe('toCertificateDocument', () => {
  it('grava no mesmo formato do sistema original', () => {
    expect(
      toCertificateDocument({
        kind: 'hour',
        registration: '1009',
        date: '2025-03-05',
        startTime: '08:00',
        endTime: '10:30',
        mode: 'Comparecimento',
        status: 'Pendente',
      }),
    ).toEqual({
      registration: '1009',
      type: 'Atestado de hora',
      startDay: '05/03/2025',
      endDay: LEGACY_EMPTY,
      startHour: '08:00',
      endHour: '10:30',
      dayOff: LEGACY_EMPTY,
      mode: 'Comparecimento',
      status: 'Pendente',
    });
  });

  it('faz o caminho de ida e volta sem perder dados', () => {
    const draft = {
      kind: 'donation' as const,
      registration: '42',
      date: '2025-06-01',
      dayOff: '2025-06-02',
    };
    expect(toCertificate({ id: 'z', data: toCertificateDocument(draft) })).toEqual({
      id: 'z',
      ...draft,
    });
  });
});

describe('funcionários e usuários', () => {
  it('normaliza matrícula numérica e aniversário', () => {
    expect(
      toEmployee({ id: 'e1', data: { registration: 1009, name: ' Ana  Souza ', birthday: '5/3' } }),
    ).toEqual({ id: 'e1', registration: '1009', name: 'Ana Souza', birthday: '05/03' });
  });

  it('grava aniversário vazio como texto vazio (igual ao original)', () => {
    expect(toEmployeeDocument({ registration: '1', name: 'Ana', birthday: null })).toEqual({
      registration: '1',
      name: 'Ana',
      birthday: '',
    });
  });

  it('lê usuários com sexo desconhecido como null', () => {
    expect(toUser({ id: 'u1', data: { username: '564', name: 'Pedro', password: '564' } })).toEqual(
      {
        id: 'u1',
        username: '564',
        name: 'Pedro',
        password: '564',
        gender: null,
      },
    );
  });
});
