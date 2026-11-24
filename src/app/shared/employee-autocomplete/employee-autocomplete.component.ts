import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule, SubscriptSizing } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { startWith, switchMap } from 'rxjs';
import { Employee } from '../../core/models/employee.model';
import { EmployeesService } from '../../core/services/employees.service';
import { normalizeText } from '../../core/utils/text.utils';

type QueryValue = Employee | string | null;

/**
 * Campo de busca de funcionário por nome ou matrícula.
 * O valor do `control` é a matrícula escolhida ('' quando nenhum funcionário foi escolhido).
 */
@Component({
  selector: 'app-employee-autocomplete',
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './employee-autocomplete.component.html',
  styleUrl: './employee-autocomplete.component.scss',
})
export class EmployeeAutocompleteComponent {
  readonly control = input.required<FormControl<string>>();
  readonly label = input('Funcionário');
  /** Mostra a opção "Todos os funcionários" (usada nos filtros). */
  readonly allowAll = input(false);
  readonly allLabel = input('Todos os funcionários');
  readonly subscriptSizing = input<SubscriptSizing>('fixed');

  private readonly employeesService = inject(EmployeesService);

  protected readonly query = new FormControl<QueryValue>('');
  protected readonly searchText = signal('');
  protected readonly loading = this.employeesService.loading;

  private readonly controlValue = toSignal(
    toObservable(this.control).pipe(
      switchMap((control) => control.valueChanges.pipe(startWith(control.value))),
    ),
    { initialValue: '' },
  );

  protected readonly options = computed(() => {
    const text = normalizeText(this.searchText());
    const employees = this.employeesService.employees();
    if (!text) {
      return employees;
    }
    return employees.filter(
      (employee) =>
        employee.registration.startsWith(text) || normalizeText(employee.name).includes(text),
    );
  });

  protected readonly unknownRegistration = computed(() => {
    const registration = this.controlValue();
    return (
      !!registration &&
      !this.employeesService.loading() &&
      !this.employeesService.byRegistration().has(registration)
    );
  });

  protected readonly hasValue = computed(() => !!this.controlValue() || !!this.searchText());

  protected readonly matcher: ErrorStateMatcher = {
    isErrorState: () => {
      const control = this.control();
      return control.invalid && control.touched;
    },
  };

  protected readonly display = (value: QueryValue): string => {
    if (!value) {
      return '';
    }
    return typeof value === 'string' ? value : `${value.name} · ${value.registration}`;
  };

  constructor() {
    // Mantém o texto do campo em sincronia com a matrícula do formulário.
    effect(() => {
      const registration = this.controlValue();
      const employees = this.employeesService.byRegistration();
      untracked(() => {
        const current = this.query.value;
        if (!registration) {
          if (current && typeof current !== 'string') {
            this.query.setValue('');
          }
          return;
        }
        const employee = employees.get(registration);
        const next: QueryValue = employee ?? registration;
        if (typeof current === 'string' ? current !== next : current?.id !== employee?.id) {
          this.query.setValue(next);
        }
      });
    });
  }

  protected onTyping(text: string): void {
    this.searchText.set(text);
    const control = this.control();
    if (control.value) {
      control.setValue('');
      control.markAsDirty();
    }
  }

  protected onSelected(value: Employee | null): void {
    const control = this.control();
    control.setValue(value?.registration ?? '');
    control.markAsDirty();
    control.markAsTouched();
    this.searchText.set('');
  }

  /** Ao fechar a lista, aceita a matrícula ou o nome digitado por completo. */
  protected onClosed(): void {
    const control = this.control();
    const text = this.query.value;
    if (control.value || typeof text !== 'string' || !text.trim()) {
      return;
    }
    const wanted = normalizeText(text);
    const match = this.employeesService
      .employees()
      .find((e) => e.registration === text.trim() || normalizeText(e.name) === wanted);
    if (match) {
      this.query.setValue(match);
      this.onSelected(match);
    }
  }

  protected onBlur(): void {
    this.control().markAsTouched();
  }

  protected clear(): void {
    this.query.setValue('');
    this.onSelected(null);
  }
}
