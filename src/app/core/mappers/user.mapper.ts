import { DocumentData, StoredDocument } from '../data/data-store';
import { GENDERS, Gender, User, UserDraft } from '../models/user.model';
import { cleanString } from '../utils/text.utils';

function toGender(value: unknown): Gender | null {
  return GENDERS.find((gender) => gender === cleanString(value)) ?? null;
}

export function toUser(document: StoredDocument): User {
  const data = document.data;
  const password = data['password'];
  return {
    id: document.id,
    username: cleanString(data['username']),
    name: cleanString(data['name']),
    password: typeof password === 'string' ? password : cleanString(password),
    gender: toGender(data['gender']),
  };
}

export function toUserDocument(draft: UserDraft): DocumentData {
  return {
    username: cleanString(draft.username),
    name: cleanString(draft.name),
    password: draft.password,
    gender: draft.gender ?? '',
  };
}
