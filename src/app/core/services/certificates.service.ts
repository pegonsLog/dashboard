import { Injectable, computed, inject } from '@angular/core';
import { COLLECTIONS, DataStore } from '../data/data-store';
import { LiveCollection } from '../data/live-collection';
import { toCertificate, toCertificateDocument } from '../mappers/certificate.mapper';
import { Certificate, CertificateDraft } from '../models/certificate.model';
import { cleanString } from '../utils/text.utils';

@Injectable({ providedIn: 'root' })
export class CertificatesService {
  private readonly store = inject(DataStore);

  private readonly live = new LiveCollection(() =>
    this.store.watchCollection(COLLECTIONS.certificates),
  );

  private readonly parsed = computed(() => {
    const valid: Certificate[] = [];
    const invalidIds: string[] = [];
    for (const document of this.live.items()) {
      const certificate = toCertificate(document);
      if (certificate) {
        valid.push(certificate);
      } else {
        invalidIds.push(document.id);
      }
    }
    if (invalidIds.length) {
      console.warn('Atestados com tipo ou data ilegível (não aparecem nas consultas):', invalidIds);
    }
    return { valid, invalidIds };
  });

  readonly certificates = computed(() => this.parsed().valid);
  /** Documentos que não puderam ser interpretados (tipo ou data ilegível). */
  readonly invalidIds = computed(() => this.parsed().invalidIds);
  readonly loading = this.live.loading;
  readonly failed = this.live.failed;

  reload(): void {
    this.live.reload();
  }

  create(draft: CertificateDraft): Promise<string> {
    return this.store.addDocument(COLLECTIONS.certificates, toCertificateDocument(draft));
  }

  update(id: string, draft: CertificateDraft): Promise<void> {
    return this.store.setDocument(COLLECTIONS.certificates, id, toCertificateDocument(draft));
  }

  remove(id: string): Promise<void> {
    return this.store.deleteDocument(COLLECTIONS.certificates, id);
  }

  /** Ids de todos os documentos ligados à matrícula (inclusive os ilegíveis). */
  private idsForRegistration(registration: string): string[] {
    return this.live
      .items()
      .filter((document) => cleanString(document.data['registration']) === registration)
      .map((document) => document.id);
  }

  countByRegistration(registration: string): number {
    return this.idsForRegistration(registration).length;
  }

  /** Atualiza a matrícula dos atestados quando a matrícula do funcionário muda. */
  async reassignRegistration(from: string, to: string): Promise<number> {
    const ids = this.idsForRegistration(from);
    if (ids.length) {
      await this.store.updateMany(COLLECTIONS.certificates, ids, { registration: to });
    }
    return ids.length;
  }
}
