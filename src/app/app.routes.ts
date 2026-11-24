import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guards';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Entrar',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      {
        path: 'inicio',
        title: 'Início',
        loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'atestados',
        title: 'Atestados',
        loadComponent: () =>
          import('./features/certificates/certificates.page').then((m) => m.CertificatesPage),
      },
      {
        path: 'aniversariantes',
        title: 'Aniversariantes',
        loadComponent: () =>
          import('./features/birthdays/birthdays.page').then((m) => m.BirthdaysPage),
      },
      {
        path: 'funcionarios',
        title: 'Funcionários',
        loadComponent: () =>
          import('./features/employees/employees.page').then((m) => m.EmployeesPage),
      },
      {
        path: 'usuarios',
        title: 'Usuários',
        loadComponent: () => import('./features/users/users.page').then((m) => m.UsersPage),
      },
      // Endereço usado pela versão anterior do sistema.
      { path: 'home', redirectTo: 'inicio' },
    ],
  },
  { path: '**', redirectTo: '' },
];
