import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import {
  ApplicationConfig,
  LOCALE_ID,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconRegistry } from '@angular/material/icon';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { TitleStrategy, provideRouter, withComponentInputBinding } from '@angular/router';
import { ptBR } from 'date-fns/locale';
import { routes } from './app.routes';
import { AppTitleStrategy } from './core/app-title.strategy';
import { provideDataStore } from './core/data/data-store.provider';
import {
  APP_DATE_FORMATS,
  PtBrDatepickerIntl,
  PtBrPaginatorIntl,
} from './core/i18n/material-pt-br';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideDataStore(),
    { provide: TitleStrategy, useClass: AppTitleStrategy },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideDateFnsAdapter(APP_DATE_FORMATS),
    { provide: MAT_DATE_LOCALE, useValue: ptBR },
    { provide: MatDatepickerIntl, useClass: PtBrDatepickerIntl },
    { provide: MatPaginatorIntl, useClass: PtBrPaginatorIntl },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        ...new MatDialogConfig(),
        width: '600px',
        maxWidth: '95vw',
        autoFocus: 'first-tabbable',
        restoreFocus: true,
      } satisfies MatDialogConfig,
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 4000, horizontalPosition: 'center', verticalPosition: 'bottom' },
    },
    provideAppInitializer(() => {
      inject(MatIconRegistry).setDefaultFontSetClass('material-symbols-rounded');
    }),
  ],
};
