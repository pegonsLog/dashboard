import { Signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, catchError, map, of, startWith, switchMap } from 'rxjs';

export type LoadStatus = 'loading' | 'ready' | 'error';

export interface CollectionState<T> {
  readonly status: LoadStatus;
  readonly items: readonly T[];
}

const LOADING: CollectionState<never> = { status: 'loading', items: [] };

/**
 * Lista em tempo real compartilhada pelo app inteiro (um único listener por coleção).
 * Deve ser criada dentro de um contexto de injeção (ex.: campo de um service).
 */
export class LiveCollection<T> {
  private readonly reload$ = new BehaviorSubject<void>(undefined);

  readonly state: Signal<CollectionState<T>>;
  readonly items: Signal<readonly T[]>;
  readonly loading: Signal<boolean>;
  readonly failed: Signal<boolean>;

  constructor(source: () => Observable<readonly T[]>) {
    this.state = toSignal(
      this.reload$.pipe(
        switchMap(() =>
          source().pipe(
            map((items): CollectionState<T> => ({ status: 'ready', items })),
            startWith(LOADING),
            catchError((error: unknown) => {
              console.error('Falha ao carregar dados', error);
              return of<CollectionState<T>>({ status: 'error', items: [] });
            }),
          ),
        ),
      ),
      { initialValue: LOADING },
    );
    this.items = computed(() => this.state().items);
    this.loading = computed(() => this.state().status === 'loading');
    this.failed = computed(() => this.state().status === 'error');
  }

  /** Tenta carregar novamente depois de um erro. */
  reload(): void {
    this.reload$.next();
  }
}
