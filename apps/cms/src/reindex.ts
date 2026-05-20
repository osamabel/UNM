import 'dotenv/config';
import payload from 'payload';
import { MeiliSearch } from 'meilisearch';

async function main() {
  await payload.init({ secret: process.env.PAYLOAD_SECRET!, local: true });
  const meili = new MeiliSearch({
    host: process.env.MEILI_HOST!,
    apiKey: process.env.MEILI_MASTER_KEY,
  });

  for (const collection of ['programs', 'faculties', 'articles'] as const) {
    const { docs } = await payload.find({ collection, limit: 1000, depth: 1 });
    const index = meili.index(collection);
    await index.deleteAllDocuments();
    await index.addDocuments(docs as any[], { primaryKey: 'id' });
    payload.logger.info(`Reindexed ${docs.length} ${collection}.`);
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
