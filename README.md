# UNM — Université Numérique du Maroc

Site officiel de l'**Université Numérique du Maroc**, bilingue (FR primaire + EN), mobile-first, optimisé conversion et SEO.

> **🎯 Tu reprends ce projet ?** Commence par [`HANDOVER.md`](./HANDOVER.md) — il te guide dans tout ce que tu dois savoir.

---

## Documentation

| Document | Pour qui | Contenu |
|---|---|---|
| **[HANDOVER.md](./HANDOVER.md)** | Le dev qui reprend | Point d'entrée unique — état du projet, ce qui marche, ce qu'il reste à faire, décisions architecturales |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Tech lead | Stack, schéma, API, CI/CD, sécurité, performance |
| **[SETUP.md](./SETUP.md)** | Tout dev | Setup local complet, env vars, seed, backups |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | DevOps | Déploiement step-by-step Vercel + Railway, DNS, monitoring |
| **[CONTENT_MANAGEMENT.md](./CONTENT_MANAGEMENT.md)** | Équipe contenu UNM | Guide rédacteur de l'admin CMS |
| **[LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md)** | Project manager | Checklist exhaustive avant mise en ligne |
| **[POSTGRES_OPTIONS.md](./POSTGRES_OPTIONS.md)** | Dev | Alternatives pour Postgres en local (Docker / Postgres.app / Supabase) |

---

## Quick start (10 min)

```bash
# 1. Dépendances
pnpm install

# 2. DB + Search en local (ou voir POSTGRES_OPTIONS.md pour les alternatives)
docker compose -f docker-compose.dev.yml up -d

# 3. Variables d'environnement
cp apps/web/.env.example apps/web/.env.local
cp apps/cms/.env.example apps/cms/.env
echo "PAYLOAD_SECRET=$(openssl rand -hex 32)" >> apps/cms/.env

# 4. Seed (contenu réel : 4 facultés, 10 programmes, etc.)
pnpm --filter @unm/cms seed
# → un mot de passe superadmin s'imprime — copie-le

# 5. Démarrer
pnpm dev
```

- **Site** → http://localhost:3000
- **Admin CMS** → http://localhost:3001/admin

---

## Stack en une ligne

`Next.js 14 (App Router, SSR, ISR) · TypeScript · Tailwind v3 · Payload CMS 2.x · PostgreSQL · MeiliSearch · Resend · next-intl · Turborepo + pnpm · Vercel + Railway`

---

## Marque

| Token | Hex | Usage |
|---|---|---|
| Primary red | `#B5341A` | CTAs, liens, états actifs |
| Dark brown | `#3D1A0B` | Titres, nav, footer |
| Warm background | `#FDFAF7` | Fonds (jamais de blanc pur) |
| Ink text | `#1A0A05` | Corps de texte (jamais de noir pur) |

Typographie : **Source Serif 4** (titres) · **Inter** (UI/body) · **IBM Plex Mono** (rare).

⚠️ **Pas de bleu, vert, violet, ou autres couleurs hors charte.**

---

## Scripts utiles

```bash
./scripts/smoke.sh                       # 131 vérifications de non-régression
pnpm --filter @unm/web typecheck         # type-check TypeScript
pnpm --filter @unm/web build             # build de production
pnpm --filter @unm/cms seed              # seed la base
pnpm --filter @unm/cms reindex           # ré-indexer MeiliSearch
```

---

## Tests de non-régression

Avant chaque déploiement : `./scripts/smoke.sh` doit retourner **0 failed**. Voir [HANDOVER.md §6](./HANDOVER.md).

---

## Licence

Code propriétaire — Université Numérique du Maroc. Tous droits réservés.
