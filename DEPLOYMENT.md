# UNM — Production deployment guide

Ce document décrit le déploiement complet du site UNM en production. Suis-le dans l'ordre : chaque étape dépend de la précédente.

Temps total estimé : **2 à 3 heures** pour un dev qui n'a jamais touché à Vercel / Railway.

---

## Vue d'ensemble

```
                   ┌───────────────────────┐
                   │  unm.ma (DNS)         │
                   └───────────┬───────────┘
                               │
                               ▼
                   ┌───────────────────────┐
                   │  Vercel — Frontend    │
                   │  Next.js 14 (SSR/ISR) │
                   └───────────┬───────────┘
                               │  fetch
                               ▼
                   ┌───────────────────────┐
                   │  Railway / OVH        │
                   │  ┌─────────────────┐  │
                   │  │ CMS Payload     │  │ ← cms.unm.ma
                   │  │ Node container  │  │
                   │  └────────┬────────┘  │
                   │           │           │
                   │  ┌────────▼────────┐  │
                   │  │ PostgreSQL 15   │  │
                   │  └─────────────────┘  │
                   │  ┌─────────────────┐  │
                   │  │ MeiliSearch 1.7 │  │
                   │  └─────────────────┘  │
                   └───────────────────────┘
                               │
                  ┌────────────┴────────────┐
                  ▼                         ▼
        ┌──────────────────┐      ┌──────────────────┐
        │ Resend (e-mail)  │      │ Plausible        │
        └──────────────────┘      │ (analytics)      │
                                  └──────────────────┘
```

---

## 1. Pré-requis — comptes à créer

Avant tout, ouvrez et munissez-vous des credentials de :

| Service | Plan | URL | Notes |
|---|---|---|---|
| GitHub | Org "UNM" | github.com | repo privé recommandé |
| Vercel | Pro (~20 €/mois) | vercel.com | gratuit suffit pour démarrer |
| Railway | Hobby (~5 $/mois minimum) | railway.app | OU OVH si data residency MA imposée |
| Resend | Free 3 000 e-mails/mois | resend.com | DKIM/SPF/DMARC à configurer |
| Plausible | Self-hosted ou Cloud | plausible.io | optionnel — RGPD friendly |
| Cloudflare | Free | cloudflare.com | recommandé pour DNS + CDN devant Vercel |

---

## 2. Pousser le code sur GitHub

```bash
cd /chemin/vers/UNM-WWW
git init -b main
git add .
git commit -m "Initial commit — UNM website v1.0"
gh repo create unm/unm-website --private --source=. --push
# ou créez le repo via l'UI GitHub puis :
git remote add origin git@github.com:unm/unm-website.git
git push -u origin main
```

Vérifiez que **aucun `.env`** n'est dans le commit (`git log --all --full-history -- .env` doit être vide).

---

## 3. Déployer le frontend sur Vercel

### 3.1 Créer le projet

1. vercel.com → **Add New → Project**
2. Importer le repo GitHub `unm/unm-website`
3. **Root Directory** : `apps/web` (IMPORTANT)
4. **Framework Preset** : Next.js (auto-détecté)
5. **Install Command** : `cd ../.. && pnpm install --frozen-lockfile`
6. **Build Command** : `cd ../.. && pnpm --filter @unm/web build`
7. **Output Directory** : `.next` (défaut)
8. **Node.js Version** : 20.x

### 3.2 Variables d'environnement Vercel

Aller dans **Settings → Environment Variables**. Cochez **Production**, **Preview** et **Development** sauf indication contraire.

| Variable | Valeur | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.unm.ma` | en prod uniquement |
| `NEXT_PUBLIC_CMS_URL` | `https://cms.unm.ma` | URL publique du CMS |
| `CMS_API_URL` | `https://cms.unm.ma/api` | URL serveur-side du CMS |
| `CMS_API_TOKEN` | (token long, voir §4.3) | secret — production seulement |
| `MEILI_HOST` | `https://meili.unm.ma` ou interne Railway | |
| `MEILI_SEARCH_KEY` | (clé `Search` MeiliSearch) | |
| `RESEND_API_KEY` | (clé Resend) | secret |
| `LEAD_NOTIFICATION_EMAIL` | `admissions@unm.ma` | |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | `unm.ma` | optionnel |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `+212662626219` | |
| `UPSTASH_REDIS_REST_URL` | (Upstash) | pour rate-limit prod |
| `UPSTASH_REDIS_REST_TOKEN` | (Upstash) | secret |

### 3.3 Domaine personnalisé

**Settings → Domains** :
- Ajouter `www.unm.ma` (primaire)
- Ajouter `unm.ma` → redirect vers `www.unm.ma`
- Vercel donne 2 enregistrements DNS à créer (un `A` pour root + un `CNAME` pour www) — voir §6 DNS.

---

## 4. Déployer le CMS + DB sur Railway

### 4.1 Créer le projet Railway

1. railway.app → **New Project → Empty Project**
2. Nommer "unm-cms-prod"

### 4.2 Provisionner les services dans cet ordre

**① PostgreSQL**

- **New → Database → PostgreSQL**
- Note l'URL `DATABASE_URL` générée (sera utilisée par le CMS)
- Aller dans **Settings → Backups → Daily backups : ON**

**② MeiliSearch**

- **New → Empty Service**
- **Settings → Source → Image** : `getmeili/meilisearch:v1.7`
- **Variables** :
  - `MEILI_MASTER_KEY` = `$(openssl rand -hex 32)` (secret long)
  - `MEILI_ENV` = `production`
  - `MEILI_NO_ANALYTICS` = `true`
- **Settings → Networking → Public Networking : ON** → noter l'URL publique
- Volume : monter sur `/meili_data` (1 GB suffit pour démarrer)

**③ CMS (Payload)**

- **New → Empty Service → Deploy from GitHub** → sélectionner le repo
- **Settings → Source → Root Directory** : `apps/cms`
- **Settings → Build** : Dockerfile (déjà fourni dans `apps/cms/Dockerfile`)
- **Settings → Networking → Public Networking : ON**
- **Settings → Custom Domain** : `cms.unm.ma`

### 4.3 Variables d'environnement CMS

| Variable | Valeur | Notes |
|---|---|---|
| `PAYLOAD_SECRET` | `$(openssl rand -hex 32)` | **TRÈS SECRET** — ne jamais commit |
| `DATABASE_URI` | (référencer la var Postgres Railway) | `${{Postgres.DATABASE_URL}}` |
| `PAYLOAD_PUBLIC_SERVER_URL` | `https://cms.unm.ma` | |
| `PAYLOAD_PUBLIC_SITE_URL` | `https://www.unm.ma` | pour CORS |
| `MEILI_HOST` | URL interne Railway de MeiliSearch | |
| `MEILI_MASTER_KEY` | (la même que MeiliSearch) | |
| `RESEND_API_KEY` | (clé Resend) | |
| `S3_ENDPOINT` | (Scaleway/Wasabi/AWS) | pour les backups DB |
| `S3_BUCKET` | `unm-backups` | |
| `S3_ACCESS_KEY` | | |
| `S3_SECRET_KEY` | | |
| `NODE_ENV` | `production` | |
| `PORT` | `3001` | |

### 4.4 Première initialisation de la base prod

Une fois le CMS déployé (premier build OK), il faut **seeder la base une seule fois** :

```bash
# Option A : via Railway CLI
railway run --service cms pnpm --filter @unm/cms seed

# Option B : ouvrir un shell sur le container CMS via UI Railway
> pnpm --filter @unm/cms seed
```

Note le superadmin créé (email + mot de passe imprimés en stdout). **CHANGE LE MOT DE PASSE immédiatement** via http://cms.unm.ma/admin → Users → ton compte → Reset Password.

### 4.5 Générer un API token pour le frontend

Dans l'admin CMS → **Users → Create new** :
- email : `frontend@unm.ma`
- role : `editor` (read-only suffit en réalité, mais `editor` permet le revalidate de cache si besoin)
- copier la clé API générée
- → la coller dans Vercel comme `CMS_API_TOKEN` (§3.2)

---

## 5. Resend — emails transactionnels

### 5.1 Configurer le domaine

1. resend.com → **Domains → Add Domain** : `unm.ma`
2. Resend te donne 3 enregistrements DNS :
   - 1 `MX` pour le routing (optionnel)
   - 1 `TXT` SPF : `v=spf1 include:_spf.resend.com ~all`
   - 1 `TXT` DKIM (long, fourni par Resend)
3. Ajoute aussi un DMARC :
   ```
   _dmarc.unm.ma  TXT  v=DMARC1; p=quarantine; rua=mailto:dmarc@unm.ma
   ```

### 5.2 Générer une API key

**API Keys → Create** : nom `production`, scope `sending`. Coller la clé dans Vercel ET Railway sous `RESEND_API_KEY`.

### 5.3 Tester

```bash
curl -X POST http://cms.unm.ma/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"Test","lastName":"Diallo",
    "email":"toi@test.com","phone":"+212600000000",
    "programSlug":"dba-business-administration",
    "consentGiven":true
  }'
```

Tu dois recevoir un e-mail de notification + un e-mail de confirmation sur l'adresse fournie.

---

## 6. DNS — configuration Cloudflare recommandée

Sur Cloudflare (ou registrar OVH), créer ces enregistrements :

| Type | Nom | Valeur | Proxy |
|---|---|---|---|
| `A` | `unm.ma` (@) | `76.76.21.21` (Vercel) | ☁️ Proxied |
| `CNAME` | `www` | `cname.vercel-dns.com` | ☁️ Proxied |
| `CNAME` | `cms` | (URL Railway) | DNS only |
| `CNAME` | `meili` | (URL Railway) | DNS only |
| `TXT` | `@` | (SPF Resend) | — |
| `TXT` | `_dmarc` | (DMARC) | — |
| `TXT` | `resend._domainkey` | (DKIM Resend) | — |
| `MX` | `@` | (selon ton fournisseur mail) | — |

**Important** : les sous-domaines `cms` et `meili` doivent être **DNS only** (pas Proxied), sinon Cloudflare bloque les uploads de fichiers > 100 MB.

Propagation DNS : 10 min à 48 h selon registrar.

---

## 7. Vérification finale

Une fois tout en ligne, lance le smoke-test contre la prod :

```bash
BASE_URL=https://www.unm.ma CMS_URL=https://cms.unm.ma ./scripts/smoke.sh
```

131 vérifications doivent passer. Sinon, debug ce qui plante.

Test manuel à faire impérativement :
1. **http://www.unm.ma → redirige vers https://www.unm.ma** (HSTS)
2. **https://unm.ma → redirige vers https://www.unm.ma** (canonique)
3. **Soumettre le formulaire callback** sur `/programmes/mba-banques-assurances` → reçoit l'e-mail
4. **Soumettre une candidature complète** sur `/admissions` → reçoit l'e-mail + apparaît dans Leads
5. **Switch FR/EN** sur 3 pages différentes
6. **Vérifier le sitemap** https://www.unm.ma/sitemap.xml
7. **Google Search Console** → ajouter la propriété, soumettre le sitemap

---

## 8. CI/CD — GitHub Actions

Le repo contient déjà 2 workflows dans `.github/workflows/` :
- `ci.yml` : lint + typecheck + build à chaque push
- `lighthouse.yml` : Lighthouse CI sur les PR Vercel previews

Variables à ajouter dans **GitHub → Settings → Secrets and variables → Actions** :
- `VERCEL_TOKEN` (pour Lighthouse CI)
- Aucun autre — Vercel gère son propre déploiement via son intégration GitHub.

---

## 9. Backups et désastre recovery

### 9.1 PostgreSQL

Railway fait des backups **daily automatiques** (vérifier que c'est activé). Pour aller plus loin :

```bash
# Cron job dans le container CMS
0 2 * * * /usr/local/bin/backup-db.sh
```

Voir `apps/cms/scripts/backup-db.sh` (à créer si absent — modèle dans `SETUP.md` §6).

### 9.2 Média

Les uploads sont stockés sur le volume Railway du CMS. **Configurer un plugin S3** sur Payload pour migrer les uploads vers S3 (Scaleway/AWS) :

→ voir `apps/cms/src/payload.config.ts` — ajouter `@payloadcms/plugin-cloud-storage` avec adapter S3 (déjà en dépendances).

### 9.3 Restore drill

Faire un test de restauration une fois par trimestre. Procédure : créer une instance Postgres staging, importer le dernier dump, vérifier que le CMS staging fonctionne, comparer les compteurs.

---

## 10. Rollback en cas de problème

### Frontend

Vercel garde chaque deployment immutable. Dashboard Vercel → **Deployments** → cliquer sur l'ancien deploy → **Promote to Production**. Bascule en < 30 s.

### CMS

Railway garde les déploiements précédents. **Deployments** → ancien build → **Rollback**.

### DB

Backup point-in-time si activé (plan Railway Pro). Sinon, restore depuis le dernier daily dump.

---

## 11. Monitoring post-lancement

Configure les alertes :
- **Vercel** : Slack/email sur build fail
- **Railway** : alerte sur container down ou high memory
- **Resend** : email sur bounce rate > 5%
- **Plausible** : pas d'alerte mais review hebdomadaire des stats
- **Uptime Robot** (gratuit) : ping `/api/leads` (HEAD) toutes les 5 min — alerte SMS si down

---

## 12. Coût mensuel estimé

| Service | Coût |
|---|---|
| Vercel Pro | 20 $ |
| Railway (CMS + Postgres + Meili) | 10–25 $ |
| Resend (free tier) | 0 $ |
| Plausible Cloud | 9 $ (ou self-host : 0 $) |
| S3 backups (Scaleway) | < 1 € |
| Domaine `.ma` | 30 €/an |
| **Total mensuel** | **~50–60 $** |

Largement scalable jusqu'à ~100 000 visites/mois sans changer de plan.

---

Bon déploiement. Pour toute question, le code est annoté en commentaires — commence par `ARCHITECTURE.md` puis le code de `apps/web/lib/api.ts` (la couche de glue).
