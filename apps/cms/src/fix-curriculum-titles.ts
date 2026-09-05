import 'dotenv/config';
import payload from 'payload';

// ════════════════════════════════════════════════════════════════
// One-off content repair.
//
// Sixteen curriculum modules were authored with the description text
// concatenated onto the title, leaving the description empty — so the
// whole paragraph rendered in the serif title style on the programme
// pages. seed.ts is already corrected; this repairs databases seeded
// before that fix, without re-running the full seed.
//
// Idempotent: a module is only touched when its FR title still starts
// with one of the prefixes below AND it carries no description.
//
//   PAYLOAD_CONFIG_PATH=src/payload.config.ts ts-node src/fix-curriculum-titles.ts
// ════════════════════════════════════════════════════════════════

const PREFIXES = [
  'Les préalables à la gestion fiscale',
  'Gestion fiscale',
  'Environnement juridique et légal',
  'Fiscalité des restructurations',
  'Fiscalité internationale',
  'Optimisation de gestion fiscale',
  'FP & politique budgétaire',
  'Comptabilité & marchés publics',
  'Contrôle des finances publiques',
  'Financement international',
  "Technologies de l'Information et FP",
  'Mémoire / thèse professionnelle',
  'Gouvernance publique : enjeux, modèles et mutations',
  'Méthodologie de recherche et mémoire professionnel',
  'Planification opérationnelle et outils de pilotage',
];

// Longest first, so "Gestion fiscale" never shadows a longer title.
const ORDERED = [...PREFIXES].sort((a, b) => b.length - a.length);

type Bilingual = { fr?: string; en?: string };
interface Module {
  code: string;
  title: Bilingual;
  description?: Bilingual;
  group?: string;
}

function split(title?: string): { title: string; description: string } | null {
  if (!title) return null;
  for (const prefix of ORDERED) {
    if (title.startsWith(prefix + ' ')) {
      return { title: prefix, description: title.slice(prefix.length + 1) };
    }
  }
  return null;
}

const isBlank = (v?: Bilingual) => !v?.fr?.trim() && !v?.en?.trim();

async function run() {
  await payload.init({ secret: process.env.PAYLOAD_SECRET!, local: true });

  const { docs } = await payload.find({
    collection: 'programs',
    limit: 200,
    depth: 0,
  });

  let programsTouched = 0;
  let modulesFixed = 0;

  for (const program of docs as any[]) {
    const curriculum = program.curriculum as Module[] | undefined;
    if (!curriculum?.length) continue;

    let changed = false;
    const next = curriculum.map((m) => {
      if (!isBlank(m.description)) return m;

      const fr = split(m.title?.fr);
      if (!fr) return m;
      // EN mirrors FR in this dataset, but split it on its own so a
      // genuinely different English title is never clobbered.
      const en = split(m.title?.en) ?? fr;

      changed = true;
      modulesFixed++;
      payload.logger.info(`  ${program.slug} ${m.code} → "${fr.title}"`);

      return {
        ...m,
        title: { fr: fr.title, en: en.title },
        description: { fr: fr.description, en: en.description },
      };
    });

    if (!changed) continue;

    await payload.update({
      collection: 'programs',
      id: program.id,
      data: { curriculum: next },
    });
    programsTouched++;
  }

  payload.logger.info(
    `Done — ${modulesFixed} module(s) split across ${programsTouched} programme(s).`,
  );
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
