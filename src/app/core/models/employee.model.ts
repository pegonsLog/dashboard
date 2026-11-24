import { DayMonth } from '../utils/date.utils';

export interface Employee {
  readonly id: string;
  readonly registration: string;
  readonly name: string;
  /** Aniversário `dd/MM`, ou null quando não informado. */
  readonly birthday: DayMonth | null;
}

export type EmployeeDraft = Omit<Employee, 'id'>;
