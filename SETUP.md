# UNM — Setup & Operations

This document covers local development, staging, production deployment, and backups for the UNM website.

---

## 1. Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | 20.x LTS | https://nodejs.org |
| pnpm | 8.x | `npm i -g pnpm@8` |
| Docker | 24.x | https://docker.com |
| PostgreSQL | 15.x | via Docker (recommended) |
| MeiliSearch | 1.7.x | via Docker (recommended) |
| Git | latest | system |

---

## 2. Local development

### 2.1 Clone and install

```bash
git clone git@github.com:unm-ma/unm-website.git
cd unm-website
pnpm install
```

### 2.2 Bring up dependencies (Postgres + MeiliSearch)

A `docker-compose.dev.yml` is provided at the repo root:

```bash
docker compose -f docker-compose.dev.yml up -d
```

This launches:
- `postgres` on `localhost:5432` (user `unm`, password `unm`, db `unm`)
- `meilisearch` on `localhost:7700` (master key `dev-master-key`)

### 2.3 Environment variables

Copy each app's example file:

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/cms/.env.example apps/cms/.env
```

#### `apps/web/.env.local`

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL | `http://localhost:3000` |
| `NEXT_PUBLIC_CMS_URL` | Public CMS URL (for media) | `http://localhost:3001` |
| `CMS_API_URL` | Server-only CMS API URL | `http://localhost:3001/api` |
| `CMS_API_TOKEN` | Long-lived API token for SSR fetches | `xxxxxxxxxxxxxxxx` |
| `MEILI_HOST` | MeiliSearch host | `http://localhost:7700` |
| `MEILI_SEARCH_KEY` | Public search key | `public-search-key` |
| `RESEND_API_KEY` | Resend transactional email | `re_xxxxxxx` |
| `LEAD_NOTIFICATION_EMAIL` | Where new-lead alerts go | `admissions@unm.ma` |
| `NOTION_WEBHOOK_URL` | Optional CRM webhook | `https://api.notion.com/...` |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible domain | `unm.ma` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp click-to-chat number | `+212600000000` |
| `UPSTASH_REDIS_REST_URL` | Rate-limit store (prod) | `https://...upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | Rate-limit token | `xxxxxxx` |

#### `apps/cms/.env`

| Variable | Description | Example |
|---|---|---|
| `PAYLOAD_SECRET` | JWT signing secret (≥ 32 chars) | `openssl rand -hex 32` |
| `DATABASE_URI` | Postgres URI | `postgres://unm:unm@localhost:5432/unm` |
| `PAYLOAD_PUBLIC_SERVER_URL` | Public CMS URL | `http://localhost:3001` |
| `PAYLOAD_PUBLIC_SITE_URL` | Public site URL (for previews) | `http://localhost:3000` |
| `MEILI_HOST` | MeiliSearch host | `http://localhost:7700` |
| `MEILI_MASTER_KEY` | Master key (server-only) | `dev-master-key` |
| `RESEND_API_KEY` | Email | `re_xxxxxxx` |
| `S3_ENDPOINT` | Backup storage | `https://s3.fr-par.scw.cloud` |
| `S3_BUCKET` | Backup bucket | `unm-backups` |
| `S3_ACCESS_KEY` | — | — |
| `S3_SECRET_KEY` | — | — |

### 2.4 Seed the database

```bash
pnpm --filter cms seed
```

This populates 4 faculties, 8 sample programs, 3 articles, 5 testimonials, 10 partners, and creates a `superadmin@unm.ma` account (password printed to stdout — change it immediately).

### 2.5 Run the dev servers

```bash
pnpm dev
```

Turborepo starts both apps in parallel:
- Frontend: http://localhost:3000
- CMS admin: http://localhost:3001/studio

To run individually:

```bash
pnpm --filter web dev
pnpm --filter cms dev
```

### 2.6 Smoke test

```bash
# Frontend
curl -I http://localhost:3000          # 200 OK
curl -I http://localhost:3000/en       # 200 OK

# CMS
curl http://localhost:3001/api/programs # JSON list

# Search
curl "http://localhost:3001/api/search?q=management&locale=fr"
```

---

## 3. Staging

### 3.1 Topology

- **Frontend:** Vercel preview environment, deployed from `staging` branch.
- **CMS + DB + Meili:** Railway "staging" project, isolated from production.

### 3.2 Pipeline

1. Open a PR against `main`.
2. Vercel automatically deploys the PR's branch to a preview URL.
3. GitHub Actions runs Lighthouse CI against the preview URL.
4. Designated reviewers approve.
5. Merge to `main` triggers production deploy.

### 3.3 Staging-specific env

`STAGING=true` enables `noindex` headers and a banner identifying the environment.

---

## 4. Production

### 4.1 Hosting

| Service | Provider | Region |
|---|---|---|
| Next.js frontend | Vercel | Global edge |
| Payload CMS | Railway | EU-West (Amsterdam) |
| PostgreSQL | Railway managed | EU-West |
| MeiliSearch | Railway | EU-West |
| Backups | Scaleway S3 | fr-par (Paris) |

(OVH Casablanca is the preferred fallback once available, for full Moroccan data residency.)

### 4.2 Deployment checklist (per release)

1. Confirm `main` is green in CI.
2. Verify Lighthouse CI passed on the merge PR.
3. Tag the release: `git tag -a v1.x.x -m "..."` and push tags.
4. Vercel auto-deploys; watch the deployment log.
5. Run post-deploy smoke tests (see §2.6) against `https://unm.ma`.
6. Validate sitemap submission in Search Console.
7. Run `lighthouse https://unm.ma --view` for a final spot-check.

### 4.3 DNS

| Record | Value | TTL |
|---|---|---|
| `unm.ma` (A) | Vercel anycast | 300 |
| `www.unm.ma` (CNAME) | `cname.vercel-dns.com` | 300 |
| `cms.unm.ma` (CNAME) | Railway app domain | 300 |
| `_dmarc.unm.ma` (TXT) | `v=DMARC1; p=quarantine; rua=mailto:dmarc@unm.ma` | 3600 |
| `unm.ma` (TXT) | `v=spf1 include:_spf.resend.com ~all` | 3600 |
| `resend._domainkey.unm.ma` (TXT) | provided by Resend | 3600 |

HTTPS is automatic on both Vercel and Railway. HSTS is forced via response headers in `next.config.js`.

### 4.4 Production environment variables

Mirror the `.env.local` keys from §2.3 with production values. Required additions:

| Variable | Description |
|---|---|
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_SITE_URL` | `https://unm.ma` |
| `NEXT_PUBLIC_CMS_URL` | `https://cms.unm.ma` |
| `SENTRY_DSN` | Error tracking |
| `CSP_REPORT_URI` | CSP violations endpoint |

Secrets are managed in Vercel and Railway dashboards — never committed to the repo.

---

## 5. Backups

### 5.1 PostgreSQL

A cron job runs inside the CMS container:

```bash
# Daily 02:00 UTC
0 2 * * * /usr/local/bin/backup-db.sh
```

`backup-db.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail
TS=$(date -u +%Y-%m-%dT%H-%M-%SZ)
FILE=/tmp/unm-${TS}.sql.gz
pg_dump "${DATABASE_URI}" | gzip > "${FILE}"
aws s3 cp "${FILE}" "s3://${S3_BUCKET}/postgres/unm-${TS}.sql.gz" \
  --endpoint-url "${S3_ENDPOINT}"
rm "${FILE}"
# Retention: lifecycle rule on the bucket deletes objects > 30 days old
```

WAL archiving runs continuously (5-minute lag) to the same bucket under `postgres-wal/`.

### 5.2 Media

Payload's media folder is mounted on a Railway volume and snapshotted nightly to the same bucket under `media/`.

### 5.3 Restore drill

Run quarterly:

```bash
# 1. Spin up a fresh staging Postgres
# 2. Pull the latest dump
aws s3 cp s3://unm-backups/postgres/unm-LATEST.sql.gz .
# 3. Restore
gunzip -c unm-LATEST.sql.gz | psql "${STAGING_DATABASE_URI}"
# 4. Verify counts match production within tolerance
```

A successful restore is signed off and recorded in the ops log.

---

## 6. Common operations

### 6.1 Add a CMS user

```bash
pnpm --filter cms exec payload create-user \
  --email editor@unm.ma --role editor
```

### 6.2 Re-index search

```bash
pnpm --filter cms reindex
```

### 6.3 Rotate the Payload secret

1. Generate a new secret: `openssl rand -hex 32`
2. Set it in Railway → CMS service env.
3. Redeploy. All existing sessions are invalidated (expected).

### 6.4 Emergency rollback

Vercel keeps every deployment immutable. To roll back:

```
Vercel dashboard → Deployments → select previous → Promote to Production
```

For the CMS, Railway provides one-click rollback to the previous container image.
