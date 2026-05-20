# Démarrer Postgres pour le CMS

Le CMS Payload 2.x nécessite Postgres. Vous avez trois options pour le dev local, par ordre de simplicité :

## Option A — Docker Desktop (recommandé)

1. Télécharger : https://www.docker.com/products/docker-desktop/
2. Installer (le `.dmg` se glisse dans Applications)
3. Lancer Docker Desktop une fois (initialisation)
4. Dans le terminal :
   ```bash
   cd ~/Desktop/UNM-WWW
   docker compose -f docker-compose.dev.yml up -d
   ```
5. Postgres tourne sur `localhost:5432` avec l'utilisateur/mot de passe `unm`/`unm` (déjà dans `apps/cms/.env.example`).

## Option B — Postgres.app (sans Docker)

1. Télécharger : https://postgresapp.com/downloads.html (version arm64)
2. Glisser dans `/Applications`, lancer
3. Cliquer "Initialize" pour créer le serveur par défaut
4. Créer la base UNM :
   ```bash
   /Applications/Postgres.app/Contents/Versions/latest/bin/createdb unm
   ```
5. Adapter `apps/cms/.env` :
   ```
   DATABASE_URI=postgres://$USER@localhost:5432/unm
   ```

## Option C — Postgres hébergé gratuit (zéro install)

**Supabase** (free tier 500 MB, suffisant pour tout le dev) :
1. Compte sur https://supabase.com
2. New project → région `eu-west-3` (Paris)
3. Project Settings → Database → Connection string (URI)
4. Coller dans `apps/cms/.env` :
   ```
   DATABASE_URI=postgres://postgres:<password>@db.<project>.supabase.co:5432/postgres
   ```

**Neon** ou **Railway** offrent des free tiers similaires.

---

## Une fois Postgres prêt

```bash
cd ~/Desktop/UNM-WWW
export PATH="$HOME/.local/node/bin:$PATH"

# 1. Générer un secret
echo "PAYLOAD_SECRET=$(openssl rand -hex 32)" >> apps/cms/.env

# 2. Seeder
pnpm --filter @unm/cms seed

# 3. Lancer le CMS (dans un terminal)
pnpm --filter @unm/cms dev

# 4. Lancer le frontend (dans un autre terminal)
pnpm --filter @unm/web dev
```

- Site : http://localhost:3000
- Admin CMS : http://localhost:3001/admin (compte affiché par le seed)

## MeiliSearch (recherche)

Déjà installé en binaire portable :
```bash
~/.local/meili --db-path ~/.local/meili-data --http-addr 127.0.0.1:7700 \
  --master-key dev-master-key
```
Indexer après seed :
```bash
pnpm --filter @unm/cms reindex
```
