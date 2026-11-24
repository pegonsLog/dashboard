import { CertificateKind } from '../../core/models/certificate.model';

export interface NavItem {
  readonly label: string;
  readonly icon: string;
  /** Link para uma página. */
  readonly route?: string;
  /** Abre o modal de inclusão do tipo de atestado. */
  readonly createKind?: CertificateKind;
}

export interface NavSection {
  readonly title: string | null;
  readonly items: readonly NavItem[];
}

/** Menu lateral com as mesmas seções do sistema original. */
export const NAV_SECTIONS: readonly NavSection[] = [
  {
    title: null,
    items: [{ label: 'Início', icon: 'space_dashboard', route: '/inicio' }],
  },
  {
    title: 'Inclusão',
    items: [
      { label: 'Atestado de dia', icon: 'calendar_month', createKind: 'day' },
      { label: 'Atestado de hora', icon: 'schedule', createKind: 'hour' },
      { label: 'Atestado de doação', icon: 'volunteer_activism', createKind: 'donation' },
    ],
  },
  {
    title: 'Consultas',
    items: [
      { label: 'Atestados', icon: 'manage_search', route: '/atestados' },
      { label: 'Aniversariantes', icon: 'cake', route: '/aniversariantes' },
    ],
  },
  {
    title: 'Manutenção',
    items: [
      { label: 'Funcionários', icon: 'group', route: '/funcionarios' },
      { label: 'Usuários', icon: 'manage_accounts', route: '/usuarios' },
      { label: 'Absenteísmo', icon: 'medical_information', route: '/absenteismo' },
    ],
  },
];
