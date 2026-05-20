# UNM — VPS Deployment Guide (Hostinger)

**Status:** Ready to execute  
**Last updated:** 2026-05-20  
**Web app:** https://unm-web-nine.vercel.app (Vercel — already deployed)  
**VPS IP:** `147.79.100.45`  
**SSH alias:** `ssh meducate-stage`

---

## Context and constraints

| Fact | Impact on plan |
|---|---|
| No domain name yet | CMS and MeiliSearch are reached by IP:port, not a hostname |
| VPS already runs Meducate staging | We create a fully isolated stack — zero changes to Meducate |
| Meducate nginx owns `:80` and `:443` | UNM services use dedicated host ports: **`:3001`** (CMS) and **`:7700`** (MeiliSearch) |
| UFW inactive on the host | Docker port bindings work immediately; only Hostinger's panel firewall may need updating |

---

## Target architecture

```
Internet
├── https://unm-web-nine.vercel.app   →  Vercel (apps/web) — already live
├── http://147.79.100.45:3001         →  Payload CMS + admin (/studio)
└── http://147.79.100.45:7700         →  MeiliSearch

Inside VPS — network: unm_network (isolated from Meducate):
┌──────────────┐     ┌───────────────────┐     ┌──────────────────┐
│  unm_postgres│ ←── │     unm_cms       │ ──→ │    unm_meili     │
│  port 5432   │     │  port 3001 (host) │     │  port 7700 (host)│
│  internal    │     └───────────────────┘     └──────────────────┘
└──────────────┘
```

> **Note — adding HTTPS later:** When you get a domain (e.g., `cms.unm.ma`),
> see [Phase 9 — Future: Add domain + HTTPS](#phase-9--future-add-domain--https).
> Everything in this guide is designed to migrate cleanly.

---

## Phase 0 — Open ports in Hostinger firewall

Hostinger VPS has a panel-level firewall independent of the OS.

1. Log in to **hPanel** → **VPS** → your server → **Firewall**
2. Add two inbound rules:

| Port | Protocol | Source | Description |
|------|----------|--------|-------------|
| 3001 | TCP | 0.0.0.0/0 | UNM Payload CMS |
| 7700 | TCP | 0.0.0.0/0 | UNM MeiliSearch |

3. Save and apply.

Verify from your local machine once the rules are saved:

```bash
nc -zv 147.79.100.45 3001   # should say "succeeded" after the CMS is up
nc -zv 147.79.100.45 7700   # same for MeiliSearch
```

---

## Phase 1 — Prepare the VPS

```bash
ssh meducate-stage

# Create the UNM project root
sudo mkdir -p /opt/unm
sudo chown $USER:$USER /opt/unm
```

---

## Phase 2 — Clone the repository

```bash
cd /opt/unm
git clone https://github.com/osamabel/UNM.git repo
```

---

## Phase 3 — Generate secrets

Run each command separately and **save all three outputs** — you will need them in the next step:

```bash
openssl rand -hex 32   # → POSTGRES_PASSWORD
openssl rand -hex 32   # → PAYLOAD_SECRET
openssl rand -hex 32   # → MEILI_MASTER_KEY
```

---

## Phase 4 — Create `.env`

```bash
nano /opt/unm/.env
```

Paste the block below, replacing every `<…>` with the values you generated above:

```dotenv
# ── PostgreSQL ─────────────────────────────────────────────────────
POSTGRES_USER=unm
POSTGRES_PASSWORD=<PASTE_GENERATED_POSTGRES_PASSWORD>
POSTGRES_DB=unm_prod

# ── Payload CMS ────────────────────────────────────────────────────
DATABASE_URI=postgres://unm:<PASTE_SAME_POSTGRES_PASSWORD>@unm_postgres:5432/unm_prod
PAYLOAD_SECRET=<PASTE_GENERATED_PAYLOAD_SECRET>

# VPS IP — the CMS is accessed directly by IP:port (no domain yet)
PAYLOAD_PUBLIC_SERVER_URL=http://147.79.100.45:3001
PAYLOAD_PUBLIC_SITE_URL=https://unm-web-nine.vercel.app

# ── MeiliSearch ────────────────────────────────────────────────────
# Internal URL — CMS talks to Meili inside the Docker network
MEILI_HOST=http://unm_meili:7700
MEILI_MASTER_KEY=<PASTE_GENERATED_MEILI_MASTER_KEY>

# ── Email (fill in when Resend account is ready) ───────────────────
RESEND_API_KEY=
LEAD_NOTIFICATION_EMAIL=admissions@unm.ma

# ── Runtime ────────────────────────────────────────────────────────
NODE_ENV=production
PORT=3001
```

---

## Phase 5 — Create `docker-compose.yml`

```bash
nano /opt/unm/docker-compose.yml
```

```yaml
services:

  postgres:
    image: postgres:15-alpine
    container_name: unm_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER:     ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB:       ${POSTGRES_DB}
    volumes:
      - unm_postgres_data:/var/lib/postgresql/data
    networks:
      - network
    # No host port — PostgreSQL stays internal

  meili:
    image: getmeili/meilisearch:v1.7
    container_name: unm_meili
    restart: unless-stopped
    environment:
      MEILI_MASTER_KEY: ${MEILI_MASTER_KEY}
      MEILI_ENV: production
    volumes:
      - unm_meili_data:/meili_data
    ports:
      - "7700:7700"   # Public — Vercel's search route calls this
    networks:
      - network
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:7700/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  cms:
    image: unm-cms:prod   # Built in Phase 6
    container_name: unm_cms
    restart: unless-stopped
    env_file: .env
    depends_on:
      postgres:
        condition: service_started
      meili:
        condition: service_healthy
    ports:
      - "3001:3001"   # Public — Vercel fetches content + admin access
    networks:
      - network
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 90s

volumes:
  unm_postgres_data:
    name: unm_postgres_data
  unm_meili_data:
    name: unm_meili_data

networks:
  network:
    name: unm_network   # Explicit name — no auto-prefix
    driver: bridge
```

---

## Phase 6 — Build the CMS Docker image

The Dockerfile copies workspace files, so it must be built from the **monorepo root**:

```bash
cd /opt/unm/repo
docker build -f apps/cms/Dockerfile -t unm-cms:prod .
```

This takes ~5 minutes on first run (installs ~400 packages, then runs `payload build`).  
You will see `=> exporting to image` at the end when it succeeds.

---

## Phase 7 — Start the stack

```bash
cd /opt/unm

# Start Postgres and MeiliSearch first
docker compose up -d postgres meili

# Wait for Postgres to finish initializing (~15 s)
sleep 20

# Start the CMS
docker compose up -d cms

# Check everything is up
docker compose ps
```

Expected output — all three should show `Up` or `healthy`:

```
NAME           STATUS
unm_postgres   Up (healthy)  or  Up X seconds
unm_meili      Up (healthy)
unm_cms        Up (healthy)  — takes ~90 s to reach healthy
```

Tail the CMS logs to confirm startup:

```bash
docker logs -f unm_cms
```

Look for this line before proceeding:
```
info: UNM CMS started — admin at http://147.79.100.45:3001/admin
info: Listening on :3001
```

Press `Ctrl+C` to exit the log tail.

Quick connectivity check from VPS:

```bash
wget -qO- http://localhost:3001/health && echo   # → {"ok":true}
wget -qO- http://localhost:7700/health && echo   # → {"status":"available",...}
```

---

## Phase 8 — Seed the database

```bash
docker exec -it unm_cms pnpm --filter @unm/cms seed
```

> **⚠️ The superadmin password is printed once to stdout — copy it immediately.**  
> It is not stored anywhere else. If you miss it, you must reseed or reset manually.

Then index all seeded content into MeiliSearch:

```bash
docker exec -it unm_cms pnpm --filter @unm/cms reindex
```

---

## Phase 9a — Create a Payload API token (for Vercel)

The Next.js app authenticates to the CMS using a Payload API key.

1. Open **http://147.79.100.45:3001/studio** in your browser
2. Log in with the superadmin credentials from the seed output
3. Go to **Users** → click your admin user
4. Find the **API Key** toggle → enable it → click **Save**
5. Copy the generated key — this is `CMS_API_TOKEN`

---

## Phase 9b — Get the MeiliSearch search-only key (for Vercel)

```bash
curl -s "http://147.79.100.45:7700/keys" \
  -H "Authorization: Bearer <YOUR_MEILI_MASTER_KEY>" \
  | python3 -m json.tool
```

Find the object with `"description": "Default Search API Key"`.  
Copy its `"key"` value — this is `MEILI_SEARCH_KEY`.  
This key only allows searches, never admin operations.

---

## Phase 10 — Configure Vercel environment variables

Vercel dashboard → **UNM project** → **Settings** → **Environment Variables**  
Add all variables below. Set scope to: **Production ✓ Preview ✓ Development ✓**

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://unm-web-nine.vercel.app` |
| `NEXT_PUBLIC_CMS_URL` | `http://147.79.100.45:3001` |
| `CMS_API_URL` | `http://147.79.100.45:3001/api` |
| `CMS_API_TOKEN` | *(from Phase 9a)* |
| `MEILI_HOST` | `http://147.79.100.45:7700` |
| `MEILI_SEARCH_KEY` | *(from Phase 9b)* |
| `RESEND_API_KEY` | *(leave empty until Resend account is ready)* |
| `LEAD_NOTIFICATION_EMAIL` | `admissions@unm.ma` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `+212600000000` |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | *(leave empty for now)* |

Then **redeploy**: Vercel dashboard → **Deployments** → latest deployment → **⋯ → Redeploy**.

---

## Phase 11 — Verify

From your local machine:

```bash
# CMS health
curl http://147.79.100.45:3001/health
# → {"ok":true}

# MeiliSearch health
curl http://147.79.100.45:7700/health
# → {"status":"available",...}

# Vercel site loads content from CMS
curl -s https://unm-web-nine.vercel.app | grep -i "université"
```

Run the smoke test (from the repo root on your local machine):

```bash
SITE_URL=https://unm-web-nine.vercel.app ./scripts/smoke.sh
```

Target: `0 failed`.

---

## Day-2 operations cheat sheet

```bash
# ── Logs ──────────────────────────────────────────────────────────
docker logs -f unm_cms                          # live CMS logs
docker logs --tail 50 unm_meili                 # MeiliSearch

# ── Restart ───────────────────────────────────────────────────────
docker compose -f /opt/unm/docker-compose.yml restart cms

# ── Redeploy after a code change ──────────────────────────────────
cd /opt/unm/repo && git pull
cd /opt/unm/repo && docker build -f apps/cms/Dockerfile -t unm-cms:prod .
docker compose -f /opt/unm/docker-compose.yml up -d cms

# ── Re-index MeiliSearch (after bulk CMS edits) ───────────────────
docker exec -it unm_cms pnpm --filter @unm/cms reindex

# ── PostgreSQL shell ──────────────────────────────────────────────
docker exec -it unm_postgres psql -U unm unm_prod

# ── Backup Postgres manually ──────────────────────────────────────
docker exec unm_postgres pg_dump -U unm unm_prod > /opt/unm/backup_$(date +%Y%m%d).sql
```

---

## Phase 9 — Future: Add domain + HTTPS

When you have a domain (e.g., `unm.ma`) and want to serve the CMS at `https://cms.unm.ma`:

### Step A — DNS

```
cms.unm.ma.     A   147.79.100.45   TTL 300
search.unm.ma.  A   147.79.100.45   TTL 300
```

### Step B — Deploy a dedicated Caddy container for UNM

Add a `caddy` service to `/opt/unm/docker-compose.yml`:

```yaml
  caddy:
    image: caddy:2-alpine
    container_name: unm_caddy
    restart: unless-stopped
    ports:
      - "3001:3001"   # replace the current direct CMS port binding
      - "7700:7700"   # replace the current direct Meili port binding
      # 80 and 443 are taken by Meducate — Caddy uses non-standard ports here
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - unm_caddy_data:/data
      - unm_caddy_config:/config
    networks:
      - network
```

Create `/opt/unm/Caddyfile`:

```
cms.unm.ma {
    reverse_proxy unm_cms:3001
}

search.unm.ma {
    reverse_proxy unm_meili:7700
}
```

> Caddy handles Let's Encrypt automatically. No certbot config needed.

> ⚠️ Caddy needs ports 80 and 443 for ACME challenges. At that point you will
> need to either (a) stop Meducate temporarily to get the first cert, or (b)
> use DNS-01 challenge in Caddy to avoid needing port 80.

### Step C — Update `.env` and Vercel

```dotenv
PAYLOAD_PUBLIC_SERVER_URL=https://cms.unm.ma
PAYLOAD_PUBLIC_SITE_URL=https://unm.ma
MEILI_HOST=http://unm_meili:7700   # internal stays the same
```

Vercel env vars:

```
NEXT_PUBLIC_SITE_URL   = https://unm.ma
NEXT_PUBLIC_CMS_URL    = https://cms.unm.ma
CMS_API_URL            = https://cms.unm.ma/api
MEILI_HOST             = https://search.unm.ma
```

### Step D — Remove the direct host port bindings

Once Caddy is serving HTTPS, remove the `ports:` entries from the `cms` and `meili`
services in `docker-compose.yml` so they are no longer directly reachable by IP:port.

```bash
docker compose -f /opt/unm/docker-compose.yml up -d
```

### Step E — Point `unm.ma` to Vercel

In Vercel: **Settings → Domains** → add `unm.ma` and follow the CNAME/A record instructions.

---

## Security checklist (before real launch)

- [ ] Rotate `PAYLOAD_SECRET` — use a fresh `openssl rand -hex 32`, rebuild image
- [ ] Change the superadmin password from the seed default
- [ ] Create separate `editor` and `admissions` accounts for UNM staff (do not share the superadmin)
- [ ] Remove direct port access (`:3001`, `:7700`) once Caddy + domain is in place
- [ ] Switch rate-limiting from in-memory to Upstash Redis: add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to Vercel env vars
- [ ] Verify `.env` is never committed: `git status` should never show `/opt/unm/.env`
- [ ] Enable automated Postgres backups (add a `backup` service to the compose file — see Meducate's `backup` service as a template)
