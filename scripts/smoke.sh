#!/usr/bin/env bash
# ════════════════════════════════════════════════════════════════
# UNM smoke-test
#
# Verifies that every layer is alive AND that the rendered HTML
# contains the *content* we expect (not just a 200 status).
# Exit code != 0 if anything regresses.
#
# Usage:   ./scripts/smoke.sh
# Add to CI / pre-commit / post-deploy.
# ════════════════════════════════════════════════════════════════

set -u
ROOT="${BASE_URL:-http://localhost:3000}"
CMS="${CMS_URL:-http://localhost:3001}"
PG="${PG_HOST:-127.0.0.1}:${PG_PORT:-5432}"
MEILI="${MEILI_URL:-http://127.0.0.1:7700}"

# Colors (skipped when not a TTY)
if [ -t 1 ]; then
  G='\033[32m'; R='\033[31m'; Y='\033[33m'; B='\033[1m'; X='\033[0m'
else
  G=''; R=''; Y=''; B=''; X=''
fi

PASS=0
FAIL=0
SKIP=0
FAILED_CHECKS=()

ok()   { printf "  ${G}✓${X} %s\n" "$1"; PASS=$((PASS+1)); }
ko()   { printf "  ${R}✗${X} %s${R}${X}\n     ${R}↳ %s${X}\n" "$1" "$2"; FAIL=$((FAIL+1)); FAILED_CHECKS+=("$1"); }
warn() { printf "  ${Y}!${X} %s\n" "$1"; SKIP=$((SKIP+1)); }
hdr()  { printf "\n${B}━ %s${X}\n" "$1"; }

# ─── 1. Services up ─────────────────────────────────────────────
hdr "Services"
/usr/bin/nc -z 127.0.0.1 3000 2>/dev/null && ok "Frontend Next.js (3000)" \
  || ko "Frontend Next.js (3000)" "port closed"
/usr/bin/nc -z 127.0.0.1 3001 2>/dev/null && ok "CMS Payload (3001)" \
  || ko "CMS Payload (3001)" "port closed — run: pnpm --filter @unm/cms dev"
/usr/bin/nc -z 127.0.0.1 5432 2>/dev/null && ok "PostgreSQL (5432)" \
  || ko "PostgreSQL (5432)" "Postgres.app stopped?"
/usr/bin/nc -z 127.0.0.1 7700 2>/dev/null && ok "MeiliSearch (7700)" \
  || warn "MeiliSearch (7700) down (search optional)"

# Bail out if frontend or CMS is dead — everything else would cascade fail
if ! /usr/bin/nc -z 127.0.0.1 3000 2>/dev/null \
   || ! /usr/bin/nc -z 127.0.0.1 3001 2>/dev/null; then
  printf "\n${R}Critical service down — aborting deeper checks.${X}\n"
  exit 1
fi

# ─── 2. CMS data integrity ──────────────────────────────────────
hdr "CMS data"
FAC_COUNT=$(/usr/bin/curl -s "$CMS/api/faculties?limit=20" | /usr/bin/grep -oE '"totalDocs":[0-9]+' | /usr/bin/cut -d: -f2)
PRG_COUNT=$(/usr/bin/curl -s "$CMS/api/programs?limit=50"  | /usr/bin/grep -oE '"totalDocs":[0-9]+' | /usr/bin/cut -d: -f2)
[ "${FAC_COUNT:-0}" -ge 4 ] && ok "faculties: $FAC_COUNT (>=4)" || ko "faculties: $FAC_COUNT" "expected >=4"
[ "${PRG_COUNT:-0}" -ge 9 ] && ok "programs: $PRG_COUNT (>=9)"  || ko "programs: $PRG_COUNT"  "expected >=9 (1 DBA + 9 MBA)"

# ─── 3. Page health (HTTP + content) ────────────────────────────
hdr "Frontend pages — HTTP + expected content"

# Each check: URL, expected substring (case-sensitive, first match)
check_page() {
  local path="$1"; local needle="$2"
  local body
  local code
  body=$(/usr/bin/curl -s -o /tmp/smoke.body -w "%{http_code}" "${ROOT}${path}")
  code="$body"
  if [ "$code" != "200" ]; then
    ko "GET $path" "HTTP $code"
    return
  fi
  if /usr/bin/grep -qF "$needle" /tmp/smoke.body; then
    ok "GET $path  (found: \"$needle\")"
  else
    ko "GET $path" "content missing: \"$needle\""
  fi
}

# Home
check_page "/"       "Construisons"             # FR hero
check_page "/en"     "Building African"         # EN hero

# Faculties listing — 1 operational + 3 in preparation must all appear.
check_page "/facultes"                            "UNM Business School"
check_page "/facultes"                            "Governance"
check_page "/facultes"                            "Technology"
check_page "/facultes"                            "Sport Business"
check_page "/facultes"                            "En préparation"
check_page "/en/faculties"                        "UNM Business School"
check_page "/en/faculties"                        "In preparation"

# Operational faculty detail — Business School holds all 10 programmes now
check_page "/facultes/business-school"            "UNM Business School"
check_page "/facultes/business-school"            "MBA Banques"
check_page "/facultes/business-school"            "Fiscalit"
check_page "/facultes/business-school"            "MBA Gouvernance"
check_page "/facultes/business-school"            "Domaines couverts"

# In-preparation faculty detail must render the upcoming page (no program list)
check_page "/facultes/school-of-governance"       "Governance"
check_page "/facultes/school-of-governance"       "En préparation"
check_page "/facultes/school-of-technology"       "School of Technology"
check_page "/facultes/school-of-technology"       "En préparation"
check_page "/facultes/school-of-sport-business"   "Sport Business"
check_page "/facultes/school-of-sport-business"   "En préparation"

# Programs listing
check_page "/programmes"      "MBA Banques"
check_page "/programmes"      "DBA"
check_page "/en/programs"     "Banking"

# Program details (every program slug)
check_page "/programmes/mba-banques-assurances"            "MBA Banques"
check_page "/programmes/mba-comptabilite-controle-audit"   "Comptabilité Contrôle &amp; Audit"
check_page "/programmes/mba-fiscalite-finances-publiques"  "Fiscalité"
check_page "/programmes/mba-marketing-digital-communication" "Marketing Digital"
check_page "/programmes/mba-gouvernance-management-public" "Gouvernance"
check_page "/programmes/mba-management-projets"            "Management de Projets"
check_page "/programmes/mba-tourisme-hospitality"          "Tourisme"
check_page "/programmes/mba-management-strategique-intelligence-economique" "Intelligence Économique"
check_page "/programmes/mba-gouvernance-ressources-minieres" "Ressources Minières"
check_page "/programmes/dba-business-administration"       "Doctorate"

# Other top-level pages
check_page "/admissions"   "Admissions"
check_page "/contact"      "Marrakech"
check_page "/universite"   "EBS Paris"
check_page "/partenaires"  "European Business School"
# /dba now 301-redirects to the canonical programme URL — assert the redirect.
DBA_CODE=$(/usr/bin/curl -s -o /dev/null -w "%{http_code}" "$ROOT/dba")
[ "$DBA_CODE" = "308" ] || [ "$DBA_CODE" = "301" ] && ok "/dba redirects (HTTP $DBA_CODE)" \
  || ko "/dba should redirect" "got HTTP $DBA_CODE"
DBA_TARGET=$(/usr/bin/curl -s -o /dev/null -w "%{redirect_url}" "$ROOT/dba")
echo "$DBA_TARGET" | /usr/bin/grep -q "programmes/dba-business-administration" \
  && ok "/dba points to /programmes/dba-business-administration" \
  || ko "/dba target" "got: $DBA_TARGET"
# The 9 MBA + DBA all surface their curriculum module codes (M1 + S1)
check_page "/programmes/mba-banques-assurances"            "M1"
check_page "/programmes/mba-banques-assurances"            "M12"
check_page "/programmes/dba-business-administration"       "S1"
check_page "/programmes/dba-business-administration"       "Première année"
check_page "/actualites"   "Actualités"

# University sub-pages (new) — both FR slug and EN-prefixed alias
# Manifesto: check the real content (baseline triptych + key sections).
check_page "/universite/manifeste"             "Manifeste"
check_page "/universite/manifeste"             "Former l"
check_page "/universite/manifeste"             "Philosophie UNM"
check_page "/universite/manifeste"             "Excellence"
check_page "/universite/manifeste"             "Ancrage africain"
check_page "/en/university/manifeste"          "Manifesto"
check_page "/en/university/manifeste"          "UNM philosophy"
check_page "/en/university/manifeste"          "African anchoring"
check_page "/universite/mot-du-president"      "Mot du Pr"
check_page "/universite/mot-du-president"      "Balambo"
check_page "/universite/mot-du-president"      "European Business School"
check_page "/universite/mot-du-president"      "Bienvenue"
check_page "/universite/mot-du-president"      "balambo.webp"
check_page "/en/university/mot-du-president"   "President"
check_page "/en/university/mot-du-president"   "Balambo"
check_page "/en/university/mot-du-president"   "Welcome"
check_page "/universite/evenements"            "Portes Ouvertes"
check_page "/en/university/evenements"         "Open Day"
check_page "/universite/newsroom"              "Newsroom"
check_page "/universite/newsroom"              "presse@unm.ma"
check_page "/en/university/newsroom"           "Newsroom"

# Legal pages — 4 documents, each with a FR slug and an EN alias.
check_page "/mentions-legales"          "Mentions légales"
check_page "/mentions-legales"          "Propriété intellectuelle"
check_page "/en/legal-notice"           "Legal Notice"
check_page "/en/legal-notice"           "Intellectual property"
check_page "/cgu"                       "Conditions générales d"
check_page "/cgu"                       "Charte de bonne conduite"
check_page "/en/terms-of-use"           "Terms of Use"
check_page "/en/terms-of-use"           "Code of conduct"
check_page "/cgv"                       "Conditions générales de vente"
check_page "/cgv"                       "Droit de rétractation"
check_page "/en/terms-of-sale"          "Terms"
check_page "/en/terms-of-sale"          "Right of withdrawal"
check_page "/confidentialite"           "Politique de protection des données"
check_page "/confidentialite"           "CNDP"
check_page "/en/privacy"                "Data Protection"
check_page "/en/privacy"                "CNDP"

# Organisations page (new)
check_page "/organisations"             "Programmes pour les organisations"
check_page "/organisations"             "Académies institutionnelles"
check_page "/organisations"             "European Business School"
check_page "/en/organizations"          "Programs for Organizations"
check_page "/en/organizations"          "Institutional Academies"

# Sitemap & robots
check_page "/sitemap.xml"  "<?xml"
check_page "/robots.txt"   "Sitemap:"

# ─── 3b. Navigation structure ───────────────────────────────────
hdr "Navigation structure"
HOME=$(/usr/bin/curl -s "$ROOT/")
# Extract the desktop <nav aria-label="Primary">...</nav> block.
# Next.js minifies HTML to a single line, so a line-based awk would
# capture the entire document. Use Python with a non-greedy DOTALL regex.
TOPNAV=$(printf '%s' "$HOME" | /usr/bin/python3 -c '
import sys, re
html = sys.stdin.read()
m = re.search(r"<nav[^>]*aria-label=\"Primary\"[^>]*>(.*?)</nav>", html, re.DOTALL)
print(m.group(1) if m else "")')
echo "$TOPNAV" | /usr/bin/grep -q 'href="/universite"'     && ok "level-1 contains Université"   || ko "level-1 Université" "missing"
echo "$TOPNAV" | /usr/bin/grep -q 'href="/facultes"'      && ok "level-1 contains Facultés"    || ko "level-1 Facultés" "missing"
echo "$TOPNAV" | /usr/bin/grep -q 'href="/programmes"'    && ok "level-1 contains Programmes"  || ko "level-1 Programmes" "missing"
echo "$TOPNAV" | /usr/bin/grep -q 'href="/admissions"'    && ok "level-1 contains Admissions"  || ko "level-1 Admissions" "missing"
echo "$TOPNAV" | /usr/bin/grep -q 'href="/organisations"' && ok "level-1 contains Organisations" || ko "level-1 Organisations" "missing"
# Contact should now live in the TopBar, NOT in the primary nav.
echo "$TOPNAV" | /usr/bin/grep -q 'href="/contact"'       && ko "level-1 should not contain Contact" "Contact must now live in the TopBar" \
  || ok "Contact removed from level-1 (moved to TopBar)"
# Uppercase enforcement on the primary nav (CSS class signature).
echo "$TOPNAV" | /usr/bin/grep -q 'uppercase tracking-\[0.08em\]' && ok "primary nav uses uppercase + tracking" \
  || ko "primary nav uppercase class" "missing on level-1 links"
# Sub-items must be present in the dropdown markup (rendered server-side too)
echo "$TOPNAV" | /usr/bin/grep -q 'href="/universite/manifeste"'        && ok "submenu has Manifeste"        || ko "submenu Manifeste" "missing in nav"
echo "$TOPNAV" | /usr/bin/grep -q 'href="/universite/mot-du-president"' && ok "submenu has Mot du Président" || ko "submenu Mot du Président" "missing in nav"
echo "$TOPNAV" | /usr/bin/grep -q 'href="/partenaires"'                 && ok "submenu has Partenaires"      || ko "submenu Partenaires" "missing in nav"
echo "$TOPNAV" | /usr/bin/grep -q 'href="/actualites"'                  && ok "submenu has Actualités"       || ko "submenu Actualités" "missing in nav"
echo "$TOPNAV" | /usr/bin/grep -q 'href="/universite/evenements"'       && ok "submenu has Événements"       || ko "submenu Événements" "missing in nav"
echo "$TOPNAV" | /usr/bin/grep -q 'href="/universite/newsroom"'         && ok "submenu has Newsroom"         || ko "submenu Newsroom" "missing in nav"

# Faculties dropdown — 2 clickable + 2 coming-soon
echo "$TOPNAV" | /usr/bin/grep -q 'href="/facultes/business-school"'      && ok "faculties submenu has Business School (link)"    || ko "faculties submenu Business School" "missing link"
echo "$TOPNAV" | /usr/bin/grep -q 'href="/facultes/school-of-governance"' && ok "faculties submenu has Governance (link)"         || ko "faculties submenu Governance" "missing link"
# Coming-soon items must be present but NOT as a clickable <a href>.
# We assert: the label is in TOPNAV AND the matching href is NOT.
echo "$TOPNAV" | /usr/bin/grep -q 'Technology'                            && ok "faculties submenu has Technology label"           || ko "faculties submenu Technology label" "missing"
echo "$TOPNAV" | /usr/bin/grep -q 'href="/facultes/school-of-technology"' && ko "Technology rendered as a link" "expected aria-disabled span" || ok "Technology not a clickable link (coming-soon)"
echo "$TOPNAV" | /usr/bin/grep -q 'Sport Business'                                && ok "faculties submenu has Sport Business label"       || ko "faculties submenu Sport Business label" "missing"
echo "$TOPNAV" | /usr/bin/grep -q 'href="/facultes/school-of-sport-business"'     && ko "Sport Business rendered as a link" "expected aria-disabled span" || ok "Sport Business not a clickable link (coming-soon)"

# ─── TopBar (utility) ────────────────────────────────────────────
# The TopBar lives outside <nav aria-label="Primary">.
HOME_FULL=$(/usr/bin/curl -s "$ROOT/")
echo "$HOME_FULL" | /usr/bin/grep -qE 'href="/contact"[^>]*>Contact'    && ok "TopBar contains Contact link"    || ko "TopBar Contact" "missing"
echo "$HOME_FULL" | /usr/bin/grep -qE 'href="/actualites"[^>]*>Actualit' && ok "TopBar contains Actualités link" || ko "TopBar Actualités" "missing"
echo "$HOME_FULL" | /usr/bin/grep -qE 'aria-label="Rechercher"'         && ok "Search trigger present"          || ko "Search trigger" "missing"

# ─── 3c. Faculty showcase: ordering, counter, and section split ─
hdr "Faculty showcase integrity"
# Strip React HTML comments so regexes match "10 programmes" reliably.
FAC_HTML=$(/usr/bin/curl -s "$ROOT/facultes" | /usr/bin/sed 's/<!--[^>]*-->//g')
# 1) UNM Business School must appear BEFORE School of Governance
BS_POS=$(printf '%s' "$FAC_HTML"  | /usr/bin/awk 'match($0, /UNM Business School/){print NR; exit}')
GV_POS=$(printf '%s' "$FAC_HTML"  | /usr/bin/awk 'match($0, /School of Governance/){print NR; exit}')
if [ -n "$BS_POS" ] && [ -n "$GV_POS" ] && [ "$BS_POS" -le "$GV_POS" ]; then
  ok "UNM Business School appears before School of Governance"
else
  ko "Faculty order" "Business School at line $BS_POS, Governance at line $GV_POS"
fi
# 2) UNM Business School (the only operational faculty) shows 10 programmes
echo "$FAC_HTML" | /usr/bin/grep -qE '>10<'      && ok "Business School shows 10 programmes" \
  || ko "Business School programme count" "expected 10 (DBA + 9 MBA)"
# 3) Section headers — operational vs in preparation
echo "$FAC_HTML" | /usr/bin/grep -q "Facult.* en activit"        && ok "Section 'Faculté en activité' present"        || ko "Active section heading" "missing"
echo "$FAC_HTML" | /usr/bin/grep -q "Facult.*s en pr.*paration"  && ok "Section 'Facultés en préparation' present"    || ko "Upcoming section heading" "missing"
# 4) "Bientôt" and "Ouverture prochaine" should NOT appear anywhere any more.
echo "$FAC_HTML" | /usr/bin/grep -q "Bient"                && ko "Legacy 'Bientôt' wording still present" "replace with 'En préparation'" \
  || ok "Legacy 'Bientôt' wording removed"
echo "$FAC_HTML" | /usr/bin/grep -q "Ouverture prochaine"  && ko "Legacy 'Ouverture prochaine' still present" "replace with 'Lancement à venir'" \
  || ok "Legacy 'Ouverture prochaine' wording removed"

# ─── 4. i18n: FR and EN really differ ───────────────────────────
hdr "Language switch — FR vs EN must differ"
FR_TITLE=$(/usr/bin/curl -s "$ROOT/"     | /usr/bin/grep -oE "<h1[^>]*>[^<]+" | /usr/bin/head -1)
EN_TITLE=$(/usr/bin/curl -s "$ROOT/en"   | /usr/bin/grep -oE "<h1[^>]*>[^<]+" | /usr/bin/head -1)
if [ -n "$FR_TITLE" ] && [ -n "$EN_TITLE" ] && [ "$FR_TITLE" != "$EN_TITLE" ]; then
  ok "Home H1 differs between FR and EN"
else
  ko "Home H1 should differ between FR and EN" "FR: $FR_TITLE  /  EN: $EN_TITLE"
fi

# Static portrait asset must be served with the right Content-Type
PORTRAIT_CT=$(/usr/bin/curl -s -o /dev/null -w "%{content_type}" "$ROOT/images/portraits/balambo.webp")
[ "${PORTRAIT_CT%%;*}" = "image/webp" ] && ok "President portrait /images/portraits/balambo.webp served (image/webp)" \
  || ko "Portrait Content-Type" "got '$PORTRAIT_CT', expected image/webp"

# An English-browser visitor must NOT be auto-redirected to /en —
# the FR root must stay accessible. Catches the localeDetection regression.
EN_BROWSER_CODE=$(/usr/bin/curl -s -o /dev/null -w "%{http_code}" \
  -H "Accept-Language: en-US,en;q=0.9" "$ROOT/")
[ "$EN_BROWSER_CODE" = "200" ] && ok "GET / with Accept-Language=en stays on FR (no auto-redirect)" \
  || ko "Auto-redirect to /en for English browsers" "HTTP $EN_BROWSER_CODE on GET / (expected 200)"

# And the FR HTML must actually contain FR copy, not EN, when requested
# with an English Accept-Language header.
EN_BROWSER_BODY=$(/usr/bin/curl -s -H "Accept-Language: en-US,en;q=0.9" "$ROOT/")
echo "$EN_BROWSER_BODY" | /usr/bin/grep -q 'lang="fr"' \
  && ok "GET / with Accept-Language=en returns <html lang=\"fr\">" \
  || ko "FR HTML not served to EN browser on /" "expected <html lang=\"fr\">"

# ─── 5. SEO smoke ───────────────────────────────────────────────
hdr "SEO essentials"
HOME_HTML=$(/usr/bin/curl -s "$ROOT/")
# Next.js JSX renders hrefLang (camelCase). HTML is case-insensitive so both
# match; we grep the canonical form Next emits.
echo "$HOME_HTML" | /usr/bin/grep -qiE 'hreflang="en"'           && ok "hreflang en present"      || ko "hreflang en" "missing"
echo "$HOME_HTML" | /usr/bin/grep -qiE 'hreflang="fr"'           && ok "hreflang fr present"      || ko "hreflang fr" "missing"
echo "$HOME_HTML" | /usr/bin/grep -qiE 'hreflang="x-default"'    && ok "hreflang x-default"       || ko "hreflang x-default" "missing"
echo "$HOME_HTML" | /usr/bin/grep -q 'rel="canonical"'           && ok "canonical link present"   || warn "no canonical on /"
echo "$HOME_HTML" | /usr/bin/grep -q 'application/ld+json'       && ok "JSON-LD present"          || ko "JSON-LD" "missing"

# ─── Summary ────────────────────────────────────────────────────
printf "\n${B}━ Summary${X}\n"
printf "  ${G}%d passed${X}   ${R}%d failed${X}   ${Y}%d warn${X}\n" "$PASS" "$FAIL" "$SKIP"
if [ "$FAIL" -gt 0 ]; then
  printf "\n${R}Failed checks:${X}\n"
  for c in "${FAILED_CHECKS[@]}"; do printf "  • %s\n" "$c"; done
  exit 1
fi
exit 0
