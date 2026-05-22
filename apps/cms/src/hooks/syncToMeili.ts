import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload/types';
import { MeiliSearch } from 'meilisearch';

const meili = new MeiliSearch({
  host: process.env.MEILI_HOST ?? 'http://localhost:7700',
  apiKey: process.env.MEILI_MASTER_KEY,
});

const indexFor = (slug: string) => meili.index(slug);

export const syncToMeili: (collectionSlug: string) => CollectionAfterChangeHook =
  (collectionSlug) =>
  async ({ doc }) => {
    try {
      await indexFor(collectionSlug).addDocuments([doc], { primaryKey: 'id' });
    } catch {
      // Fail silently — search is best-effort.
    }
    return doc;
  };

export const removeFromMeili: (collectionSlug: string) => CollectionAfterDeleteHook =
  (collectionSlug) =>
  async ({ id }) => {
    try {
      await indexFor(collectionSlug).deleteDocument(id);
    } catch {
      /* ignore */
    }
  };
