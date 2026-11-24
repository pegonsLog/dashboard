import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { COLLECTIONS, DataStore } from '../data/data-store';
import { LiveCollection } from '../data/live-collection';
import { toUser, toUserDocument } from '../mappers/user.mapper';
import { User, UserDraft } from '../models/user.model';
import { compareText } from '../utils/text.utils';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly store = inject(DataStore);

  private readonly live = new LiveCollection<User>(() =>
    this.store
      .watchCollection(COLLECTIONS.users)
      .pipe(map((documents) => documents.map(toUser).sort((a, b) => compareText(a.name, b.name)))),
  );

  readonly users = this.live.items;
  readonly loading = this.live.loading;
  readonly failed = this.live.failed;

  reload(): void {
    this.live.reload();
  }

  isUsernameTaken(username: string, exceptId?: string): boolean {
    const wanted = username.trim();
    return this.users().some((user) => user.username === wanted && user.id !== exceptId);
  }

  create(draft: UserDraft): Promise<string> {
    return this.store.addDocument(COLLECTIONS.users, toUserDocument(draft));
  }

  update(id: string, draft: UserDraft): Promise<void> {
    return this.store.setDocument(COLLECTIONS.users, id, toUserDocument(draft));
  }

  remove(id: string): Promise<void> {
    return this.store.deleteDocument(COLLECTIONS.users, id);
  }
}
