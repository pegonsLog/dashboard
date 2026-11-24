/** Remove acentos, espaços extras e converte para minúsculas (para buscas). */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** Converte qualquer valor vindo do banco em texto limpo (números viram texto). */
export function cleanString(value: unknown): string {
  if (typeof value === 'string') {
    return value.replace(/\s+/g, ' ').trim();
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  return '';
}

const collator = new Intl.Collator('pt-BR', { sensitivity: 'base', numeric: true });

/** Comparação de textos em português (ignora acentos e ordena números naturalmente). */
export function compareText(a: string, b: string): number {
  return collator.compare(a, b);
}

/** Retorna "1 atestado" / "2 atestados". */
export function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}
