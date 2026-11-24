import { toCertificateDocument } from '../mappers/certificate.mapper';
import { toEmployeeDocument } from '../mappers/employee.mapper';
import { toUserDocument } from '../mappers/user.mapper';
import { CertificateDraft } from '../models/certificate.model';
import { toIsoDate } from '../utils/date.utils';
import { DocumentData } from './data-store';
import { DEMO_CREDENTIALS } from './demo-credentials';

const EMPLOYEES: readonly [string, string, string][] = [
  ['1009', 'Ana Paula Ferreira', '14/01'],
  ['737', 'Bruno Carvalho Lima', '03/02'],
  ['1217', 'Carla Mendes Rocha', '22/03'],
  ['1872', 'Daniel Souza Martins', '09/04'],
  ['410', 'Eduarda Nunes Prado', '17/05'],
  ['1107', 'Fábio Ribeiro Alves', '28/06'],
  ['938', 'Gabriela Teixeira', '05/07'],
  ['1170', 'Henrique Batista', '12/08'],
  ['367', 'Isabela Moreira', '30/09'],
  ['705', 'João Pedro Barbosa', '08/10'],
  ['285', 'Larissa Gomes Pinto', '19/11'],
  ['821', 'Marcos Antônio Dias', '25/11'],
  ['842', 'Natália Cardoso', '02/12'],
  ['1111', 'Otávio Freitas', ''],
];

function shiftDays(base: Date, days: number): string {
  const date = new Date(base);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

/** Gera dados fictícios com datas relativas a hoje, para a demonstração sempre ter conteúdo. */
export function createDemoData(today = new Date()): Record<string, Record<string, DocumentData>> {
  const employees: Record<string, DocumentData> = {};
  EMPLOYEES.forEach(([registration, name, birthday], index) => {
    employees[`emp${index + 1}`] = toEmployeeDocument({
      registration,
      name,
      birthday: birthday || null,
    });
  });
  // Um aniversariante no dia de hoje, para destacar na tela.
  const todayBirthday = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}`;
  employees['emp15'] = toEmployeeDocument({
    registration: '1500',
    name: 'Patrícia Lopes',
    birthday: todayBirthday,
  });

  const drafts: CertificateDraft[] = [
    {
      kind: 'day',
      registration: '1009',
      date: shiftDays(today, -40),
      endDate: shiftDays(today, -38),
    },
    {
      kind: 'day',
      registration: '737',
      date: shiftDays(today, -12),
      endDate: shiftDays(today, -12),
    },
    { kind: 'day', registration: '1217', date: shiftDays(today, -3), endDate: shiftDays(today, 1) },
    {
      kind: 'day',
      registration: '1009',
      date: shiftDays(today, -400),
      endDate: shiftDays(today, -396),
    },
    {
      kind: 'hour',
      registration: '1009',
      date: shiftDays(today, -30),
      startTime: '08:00',
      endTime: '10:30',
      mode: 'Comparecimento',
      status: 'Confirmado',
    },
    {
      kind: 'hour',
      registration: '1009',
      date: shiftDays(today, -9),
      startTime: '13:15',
      endTime: '15:00',
      mode: 'Comparecimento',
      status: 'Pendente',
    },
    {
      kind: 'hour',
      registration: '1009',
      date: shiftDays(today, -5),
      startTime: '09:00',
      endTime: '11:00',
      mode: 'Acompanhamento',
      status: 'Confirmado',
    },
    {
      kind: 'hour',
      registration: '938',
      date: shiftDays(today, -2),
      startTime: '14:00',
      endTime: '16:45',
      mode: 'Comparecimento',
      status: 'Pendente',
    },
    {
      kind: 'donation',
      registration: '705',
      date: shiftDays(today, -20),
      dayOff: shiftDays(today, -19),
    },
    { kind: 'donation', registration: '410', date: shiftDays(today, -7), dayOff: null },
  ];
  const certificates: Record<string, DocumentData> = {};
  drafts.forEach((draft, index) => {
    certificates[`cert${index + 1}`] = toCertificateDocument(draft);
  });
  // Registro no estilo antigo: sem status e com data digitada sem zeros à esquerda.
  const legacyDate = new Date(today);
  legacyDate.setDate(legacyDate.getDate() - 60);
  certificates['legacy1'] = {
    id: '',
    registration: '1009',
    startDay: `${legacyDate.getDate()}/${legacyDate.getMonth() + 1}/${legacyDate.getFullYear()}`,
    endDay: '******************',
    startHour: '7:30',
    endHour: '09:00',
    dayOff: '******************',
    type: 'Atestado de hora',
    mode: 'Comparecimento',
  };

  const users: Record<string, DocumentData> = {
    user1: toUserDocument({
      username: DEMO_CREDENTIALS.username,
      name: 'Mariana Demonstração',
      password: DEMO_CREDENTIALS.password,
      gender: 'Feminino',
    }),
    user2: toUserDocument({
      username: '2000',
      name: 'Rafael Teste',
      password: '2000',
      gender: 'Masculino',
    }),
  };

  return { employees, certificates, users };
}
