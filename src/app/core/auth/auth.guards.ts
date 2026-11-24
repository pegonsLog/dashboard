import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Exige login. Guarda a página pedida para voltar a ela depois do login. */
export const authGuard: CanActivateFn = (_route, state) => {
  if (inject(AuthService).isAuthenticated()) {
    return true;
  }
  const returnUrl = state.url && state.url !== '/' ? state.url : undefined;
  return inject(Router).createUrlTree(['/login'], {
    queryParams: returnUrl ? { returnUrl } : undefined,
  });
};

/** Quem já está logado não precisa ver a tela de login. */
export const guestGuard: CanActivateFn = () =>
  inject(AuthService).isAuthenticated() ? inject(Router).createUrlTree(['/inicio']) : true;
