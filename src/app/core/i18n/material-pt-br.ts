import { Injectable } from '@angular/core';
import { MatDateFormats } from '@angular/material/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { MatPaginatorIntl } from '@angular/material/paginator';

/**
 * Formatos de data/hora (date-fns) aceitos nos campos.
 * A ordem importa: anos com 2 dígitos são testados antes dos de 4 dígitos.
 */
export const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: ['dd/MM/yy', 'dd/MM/yyyy', 'ddMMyy', 'ddMMyyyy'],
    timeInput: ['HH:mm', 'HHmm', "H'h'mm", "H'h'"],
  },
  display: {
    dateInput: 'dd/MM/yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'PPP',
    monthYearA11yLabel: 'MMMM yyyy',
    timeInput: 'HH:mm',
    timeOptionLabel: 'HH:mm',
  },
};

@Injectable()
export class PtBrPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Itens por página';
  override nextPageLabel = 'Próxima página';
  override previousPageLabel = 'Página anterior';
  override firstPageLabel = 'Primeira página';
  override lastPageLabel = 'Última página';

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    const start = page * pageSize;
    const end = Math.min(start + pageSize, length);
    return `${start + 1} – ${end} de ${length}`;
  };
}

@Injectable()
export class PtBrDatepickerIntl extends MatDatepickerIntl {
  override calendarLabel = 'Calendário';
  override openCalendarLabel = 'Abrir calendário';
  override closeCalendarLabel = 'Fechar calendário';
  override prevMonthLabel = 'Mês anterior';
  override nextMonthLabel = 'Próximo mês';
  override prevYearLabel = 'Ano anterior';
  override nextYearLabel = 'Próximo ano';
  override prevMultiYearLabel = 'Anos anteriores';
  override nextMultiYearLabel = 'Próximos anos';
  override switchToMonthViewLabel = 'Escolher data';
  override switchToMultiYearViewLabel = 'Escolher mês e ano';
  override startDateLabel = 'Data inicial';
  override endDateLabel = 'Data final';
  override comparisonDateLabel = 'Período de comparação';
}
