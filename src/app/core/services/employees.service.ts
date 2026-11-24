import { Injectable, computed, inject } from '@angular/core';
import { map } from 'rxjs';
import { COLLECTIONS, DataStore } from '../data/data-store';
import { LiveCollection } from '../data/live-collection';
import { toEmployee, toEmployeeDocument } from '../mappers/employee.mapper';
import { Employee, EmployeeDraft } from '../models/employee.model';
import { compareText } from '../utils/text.utils';

@Injectable({ providedIn: 'root' })
export class EmployeesService {
  private readonly store = inject(DataStore);

  private readonly live = new LiveCollection<Employee>(() =>
    this.store
      .watchCollection(COLLECTIONS.employees)
      .pipe(
        map((documents) => documents.map(toEmployee).sort((a, b) => compareText(a.name, b.name))),
      ),
  );

  /** Funcionários em ordem alfabética. */
  readonly employees = this.live.items;
  readonly loading = this.live.loading;
  readonly failed = this.live.failed;

  readonly byRegistration = computed(
    () => new Map(this.employees().map((employee) => [employee.registration, employee])),
  );

  reload(): void {
    this.live.reload();
  }

  find(registration: string): Employee | undefined {
    return this.byRegistration().get(registration);
  }

  /** Nome para exibição; usa a matrícula quando o funcionário não está mais cadastrado. */
  displayName(registration: string): string {
    return this.find(registration)?.name ?? `Matrícula ${registration}`;
  }

  isRegistrationTaken(registration: string, exceptId?: string): boolean {
    const wanted = registration.trim();
    return this.employees().some((e) => e.registration === wanted && e.id !== exceptId);
  }

  create(draft: EmployeeDraft): Promise<string> {
    return this.store.addDocument(COLLECTIONS.employees, toEmployeeDocument(draft));
  }

  update(id: string, draft: EmployeeDraft): Promise<void> {
    return this.store.setDocument(COLLECTIONS.employees, id, toEmployeeDocument(draft));
  }

  remove(id: string): Promise<void> {
    return this.store.deleteDocument(COLLECTIONS.employees, id);
  }
}
