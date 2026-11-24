import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { COLLECTIONS, DataStore } from '../data/data-store';
import { toUser } from '../mappers/user.mapper';
import { GENDERS, Gender, User, greeting } from '../models/user.model';

export interface Session {
  readonly userId: string;
  readonly username: string;
  readonly name: string;
  readonly gender: Gender | null;
}

const STORAGE_KEY = 'garbo.session';
/** Chaves gravadas pela versão anterior do sistema. */
const LEGACY_KEYS = ['login', 'user', 'gender'];

function isSession(value: unknown): value is Session {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const session = value as Record<string, unknown>;
  return (
    typeof session['userId'] === 'string' &&
    typeof session['username'] === 'string' &&
    typeof session['name'] === 'string' &&
    (session['gender'] === null || GENDERS.includes(session['gender'] as Gender))
  );
}

function readSession(): Session | null {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    return isSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Login com os mesmos usuários e senhas do sistema original (coleção "users").
 * A busca é feita por usuário e senha no banco, sem baixar a lista inteira de usuários.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly store = inject(DataStore);
  private readonly router = inject(Router);
  private readonly sessionState = signal<Session | null>(readSession());

  readonly session = this.sessionState.asReadonly();
  readonly isAuthenticated = computed(() => this.sessionState() !== null);
  readonly greeting = computed(() => {
    const session = this.sessionState();
    return session ? greeting(session.name, session.gender) : '';
  });

  constructor() {
    // Mantém as abas sincronizadas: sair em uma aba encerra a sessão nas outras.
    window.addEventListener('storage', (event) => {
      if (event.key === STORAGE_KEY) {
        this.sessionState.set(readSession());
        if (!this.sessionState()) {
          void this.router.navigateByUrl('/login');
        }
      }
    });
  }

  async login(username: string, password: string): Promise<boolean> {
    const matches = await this.store.findByFields(COLLECTIONS.users, {
      username: username.trim(),
      password,
    });
    const user = matches.map(toUser)[0];
    if (!user) {
      return false;
    }
    this.startSession(user);
    return true;
  }

  logout(): void {
    this.sessionState.set(null);
    localStorage.removeItem(STORAGE_KEY);
    LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
    void this.router.navigateByUrl('/login');
  }

  /** Atualiza nome e sexo exibidos quando o próprio usuário logado é alterado. */
  refresh(user: User): void {
    if (user.id === this.sessionState()?.userId) {
      this.startSession(user);
    }
  }

  /** Encerra a sessão se o usuário logado tiver sido excluído. Erros de rede mantêm a sessão. */
  async verifySession(): Promise<'valid' | 'removed' | 'unknown'> {
    const session = this.sessionState();
    if (!session) {
      return 'removed';
    }
    try {
      const document = await this.store.getDocument(COLLECTIONS.users, session.userId);
      if (!document) {
        this.logout();
        return 'removed';
      }
      this.refresh(toUser(document));
      return 'valid';
    } catch {
      return 'unknown';
    }
  }

  private startSession(user: User): void {
    const session: Session = {
      userId: user.id,
      username: user.username,
      name: user.name,
      gender: user.gender,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
    this.sessionState.set(session);
  }
}
