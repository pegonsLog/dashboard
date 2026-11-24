export const GENDERS = ['Masculino', 'Feminino'] as const;
export type Gender = (typeof GENDERS)[number];

export interface User {
  readonly id: string;
  /** Login (no sistema original, a matrícula do usuário). */
  readonly username: string;
  readonly name: string;
  readonly password: string;
  readonly gender: Gender | null;
}

export type UserDraft = Omit<User, 'id'>;

/** "Bem-vindo, João", "Bem-vinda, Maria" ou "Olá, Fulano" quando o sexo não foi informado. */
export function greeting(name: string, gender: Gender | null): string {
  const firstName = name.trim().split(/\s+/)[0] ?? '';
  if (gender === 'Masculino') {
    return `Bem-vindo, ${firstName}`;
  }
  if (gender === 'Feminino') {
    return `Bem-vinda, ${firstName}`;
  }
  return `Olá, ${firstName}`;
}
