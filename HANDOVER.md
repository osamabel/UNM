# UNM Website — Handover

**Bienvenue.** Ce document est ton point d'entrée pour reprendre, déployer et maintenir le site officiel de l'Université Numérique du Maroc (UNM).

Tout ce que tu dois savoir est ici. Pour les détails techniques d'une étape, des liens t'envoient vers les docs spécialisées.

---

## 1. À 30 secondes — qu'est-ce que ce projet ?

Site bilingue (FR primaire, EN secondaire) d'une université Executive marocaine. Stack moderne, CMS headless, optimisé conversion et SEO.

| Item | Valeur |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| CMS | Payload 2.x (PostgreSQL) — admin headless |
| Search | MeiliSearch (FOSS) |
| Email | Resend (transactionnel) |
| Monorepo | pnpm workspaces + Turborepo |
| Hébergement cible | Vercel (frontend) + Railway ou OVH (CMS + DB) |
| Repo | `apps/web` · `apps/cms` · `packages/types` · `scripts` |

Détails complets → [`ARCHITECTURE.md`](./ARCHITECTURE.md)

---

## 2. État du projet à la remise

**Ce qui est fait et fonctionne :**

- ✅ 10 programmes seedés avec contenu réel (DBA + 9 MBA), tous rattachés à UNM Business School. Chaque programme a son curriculum (M1→M12 ou S1→S8), vocation, objectifs, débouchés, compétences, FAQ — en FR + EN.
- ✅ 4 facultés : Business School opérationnelle, 3 en préparation (Governance, Technology, Sport Business).
- ✅ Pages éditoriales complètes : Home, Université, Manifeste, Mot du Président (avec portrait), Organisations, Contact, Admissions, News, Partenaires.
- ✅ Pages légales : Mentions légales, CGU, CGV, Politique de protection des données (FR + EN).
- ✅ Navigation à 2 niveaux : top bar utility (Contact · Actualités · FR/EN · search · Apply) + main nav (L'UNIVERSITÉ ▾ · FACULTÉS ▾ · PROGRAMMES · ADMISSIONS · ORGANISATIONS).
- ✅ Formulaires : candidature 5 étapes, lead generation (sidebar), demande de rappel modal, contact, newsletter.
- ✅ Système de rate-limiting sur les API publiques, validation Zod, envoi e-mail Resend.
- ✅ SEO : `generateMetadata` par page (FR + EN), JSON-LD (Course, EducationalOrganization, Article, FAQPage, BreadcrumbList), sitemap dynamique, robots.txt, hreflang.
- ✅ Smoke-test à 131 vérifications (`./scripts/smoke.sh`) — exécutable en local et en CI.

**Ce qui reste à faire avant la mise en ligne :**

| Tâche | Effort | Priorité |
|---|---|---|
| Souscrire un compte Resend + DNS DKIM/SPF/DMARC | 30 min | Haute |
| Provisionner PostgreSQL prod + MeiliSearch (Railway ou OVH) | 1 h | Haute |
| Configurer le DNS `unm.ma` + `cms.unm.ma` vers Vercel + Railway | 30 min | Haute |
| Vérifier les pages légales avec le service juridique UNM | dépend | Haute |
| Remplacer le logo placeholder de OCP, Bank Al-Maghrib, Ministère des Mines, CGEM (4 partenaires) | éditorial | Moyenne |
| Brancher Plausible Analytics (déjà câblé, juste à activer en prod) | 15 min | Moyenne |
| Préparer la newsletter Brevo / Mailchimp si différent de Resend | éditorial | Basse |

Checklist complète → [`LAUNCH_CHECKLIST.md`](./LAUNCH_CHECKLIST.md)

---

## 3. Commencer le développement local en 10 minutes

Prérequis : Node 20+, pnpm 8+, Docker Desktop (ou Postgres natif).

```bash
# 1. Installer les dépendances
pnpm install

# 2. Démarrer Postgres + MeiliSearch en local
docker compose -f docker-compose.dev.yml up -d
# ou Postgres.app — voir POSTGRES_OPTIONS.md

# 3. Configurer les variables d'environnement
cp apps/web/.env.example apps/web/.env.local
cp apps/cms/.env.example apps/cms/.env

# 4. Générer un secret Payload (≥ 32 chars)
echo "PAYLOAD_SECRET=$(openssl rand -hex 32)" >> apps/cms/.env

# 5. Seeder la base avec le contenu officiel (4 facultés, 10 programmes, etc.)
pnpm --filter @unm/cms seed
# → un mot de passe superadmin est imprimé en stdout, copie-le

# 6. Démarrer tout
pnpm dev           # frontend + CMS en parallèle (Turborepo)
# ou séparément :
pnpm --filter @unm/cms dev   # CMS sur :3001
pnpm --filter @unm/web dev   # Next sur :3000
```

- Site : http://localhost:3000
- Admin CMS : http://localhost:3001/admin
- Détails : [`SETUP.md`](./SETUP.md)

---

## 4. Déployer en production

Le guide complet step-by-step (Vercel + Railway, ou alternatives OVH/Scaleway) :

→ **[`DEPLOYMENT.md`](./DEPLOYMENT.md)**

Résumé express :

1. Pousser le code sur GitHub
2. Connecter Vercel au repo, sous-dossier `apps/web` → déploiement frontend automatique
3. Sur Railway : 3 services — Postgres, MeiliSearch (image officielle), CMS (Dockerfile fourni dans `apps/cms/Dockerfile`)
4. Configurer les variables d'environnement (liste exhaustive dans `DEPLOYMENT.md` §4)
5. Faire pointer le DNS (`unm.ma` → Vercel, `cms.unm.ma` → Railway)
6. Seeder la prod : `pnpm --filter @unm/cms seed` une seule fois (via une console SSH ou un job Railway)
7. Vérifier avec `./scripts/smoke.sh` → 131 checks doivent passer

---

## 5. Gérer le contenu après le lancement

L'équipe communication UNM utilise l'admin CMS (Payload). Guide rédacteur :

→ **[`CONTENT_MANAGEMENT.md`](./CONTENT_MANAGEMENT.md)**

Ce qu'ils peuvent faire sans toi :
- Modifier titres, descriptions, vocations, objectifs des programmes
- Ajouter/retirer des programmes, des facultés
- Publier des articles d'actualités
- Ajouter des partenaires (avec logo)
- Gérer les leads et applications (export CSV inclus : `GET /api/leads/export.csv`)
- Modifier les coordonnées institutionnelles (Site Settings)

Trois rôles définis : `admin`, `editor`, `admissions`. Détails dans `apps/cms/src/access/`.

---

## 6. Tests de régression et qualité

À chaque modification, lance :

```bash
./scripts/smoke.sh
```

131 vérifications couvrant :
- État des 4 services (Next, CMS, Postgres, Meili)
- Compteurs CMS (≥ 4 facultés, ≥ 10 programmes)
- HTTP 200 sur 50+ routes avec **contenu attendu** présent (pas juste le code statut)
- Structure de la navigation (level-1 + sous-menus + TopBar)
- Switch FR ↔ EN
- SEO essentials (hreflang, canonical, JSON-LD)

Le script doit retourner `0 failed`. Sinon, le déploiement est cassé.

```bash
# Aussi disponibles :
pnpm --filter @unm/web typecheck     # type-check TypeScript
pnpm --filter @unm/web lint          # ESLint
pnpm --filter @unm/web build         # build Next.js
pnpm --filter @unm/cms typecheck     # type-check du CMS
```

---

## 7. Comment fonctionne le code — points cruciaux

### 7.1 La couche API (`apps/web/lib/api.ts`)

Toutes les pages SSR lisent le CMS via `fetch`. Cette couche **normalise** les réponses Payload (qui wrappe les arrays localisés en `{ id, name|text: {fr,en} }`) en `LocalizedField[]` propre — c'est invisible pour les composants React, mais critique : si tu changes le seed, vérifie que cette normalisation fonctionne toujours.

### 7.2 Bilinguisme (FR primaire / EN secondaire)

- French URLs unprefixed : `/programmes/dba-business-administration`
- English URLs prefixed : `/en/programs/dba-business-administration`
- `localeDetection: false` dans `apps/web/middleware.ts` — **NE PAS REMETTRE À `true`**, sinon les utilisateurs anglophones se font auto-rediriger vers `/en` et c'est inacceptable (le FR est la langue officielle UNM).
- Contenu CMS : chaque champ texte est en réalité `{ fr, en }` — voir le helper `localizedText()` dans `apps/cms/src/collections/_helpers.ts`.

### 7.3 Cache ISR

Toutes les pages publiques utilisent `revalidate: 300` (5 min). Quand le contenu CMS change, il faut soit attendre 5 min, soit forcer un rebuild Vercel.

### 7.4 Champs CMS personnalisés

La collection `programs` a des champs au-delà du standard : `vocation`, `skillsNarrative`, `careerOutlooks`, `curriculum[]`. Si tu rajoutes des champs, mets à jour aussi `packages/types/src/index.ts` (source de vérité partagée).

---

## 8. Sécurité — à faire impérativement avant la mise en ligne

- [ ] **Rotater le secret Payload** (`PAYLOAD_SECRET`) entre dev et prod.
- [ ] **Changer le mot de passe du superadmin** créé par le seed (visible en stdout lors du seed — donc à régénérer en prod).
- [ ] **Créer les comptes éditeurs et admissions** pour l'équipe UNM.
- [ ] **Restreindre l'accès à `/admin`** :
  - Soit IP allowlist (Cloudflare, Vercel Firewall)
  - Soit déplacer l'admin sur un sous-domaine privé (`cms.unm.ma/studio` au lieu de `/admin`)
- [ ] **HTTPS forcé + HSTS** — déjà configuré dans `next.config.js` mais à vérifier en prod.
- [ ] **Configurer la CSP** définitive (actuellement permissive en dev).
- [ ] **Activer le rate-limiting prod** : la config dev utilise une map en mémoire. Pour la prod, brancher Upstash Redis (variables `UPSTASH_REDIS_REST_URL` et `_TOKEN` dans `.env`).
- [ ] **Backup PostgreSQL automatique** : voir `SETUP.md` §6 pour le script `backup-db.sh`.
- [ ] **Vérifier que `.env.local` et `.env` ne sont JAMAIS commités** (déjà dans `.gitignore`).

---

## 9. Décisions architecturales prises (pour ne pas les défaire par mégarde)

- **Charte typo** : Source Serif 4 (titres) + Inter (UI/body). Pas de Cormorant Garamond ni DM Sans (trop "AI-generated").
- **Couleurs** : `#B5341A` (primary red), `#3D1A0B` (secondary brown), `#FDFAF7` (warm background). Aucune autre couleur de marque autorisée. **Pas de bleu/vert/violet**.
- **Faculty showcase** : 1 active mise en avant + 3 en préparation dans une section visuellement séparée. Wording "En préparation" / "Lancement à venir" — **pas "Bientôt"** (trop marketing).
- **Menu principal en MAJUSCULES** + tracking serré (style HBS / Wharton).
- **localeDetection: false** : pas de redirection auto vers /en pour les anglophones.
- **Programmes** : tous rattachés à UNM Business School pour la rentrée actuelle (Governance/Tech/Sport sont en préparation).
- **`/dba`** : redirect 301 permanent vers `/programmes/dba-business-administration`. Une seule URL canonique pour le SEO.

---

## 10. À qui demander quoi

| Sujet | Personne / Doc |
|---|---|
| Architecture, choix techniques | `ARCHITECTURE.md` |
| Setup local | `SETUP.md`, `POSTGRES_OPTIONS.md` |
| Déploiement prod | `DEPLOYMENT.md` |
| Gestion du contenu | `CONTENT_MANAGEMENT.md` |
| Checklist mise en ligne | `LAUNCH_CHECKLIST.md` |
| Décisions éditoriales (manifeste, textes, photos) | Service communication UNM |
| Validation juridique (CGU, CGV, RGPD, mentions) | Service juridique UNM |
| Comptes Vercel / Railway / Resend / Plausible | Direction informatique UNM |
| DNS `unm.ma` | Direction informatique UNM |

---

## 11. Stack TL;DR pour ton CV de futur prestataire 😉

`Next.js 14 (App Router, RSC, ISR) · TypeScript strict · Tailwind v3 · Payload CMS 2.x · PostgreSQL · MeiliSearch · Resend · next-intl (FR/EN) · React Hook Form + Zod · Turborepo + pnpm · Vercel + Railway · Smoke-test bash · SEO JSON-LD complet · Accessibilité WCAG 2.1 AA`

Bon vol. 🚀
