# Audit SEO (contenu + technique + CTR) — easyshopbuilder.com

Date : 2026-04-18  
Objectif : **augmenter les impressions** (pages pertinentes) et surtout **remonter le CTR** (snippets + confiance + adéquation requête/intention).

## 0) Snapshot Google Search Console (exports du 2026-04-18)

Périodes exportées :
- **3 mois** (Graphique : **2026-01-17 → 2026-04-16**) : **9 clics**, **9 068 impressions**, **CTR 0,10 %**, **position moyenne 7,13**
- **28 jours** (Graphique : **2026-03-20 → 2026-04-16**) : **2 clics**, **2 039 impressions**, **CTR 0,10 %**, **position moyenne 8,48**

Pages qui portent les impressions (3 mois) :
- `/en/blog-seo-shopify-2026` — **4 613 impr**, **CTR 0,13 %**, pos **6,51**
- `/en/blog-optimiser-conversion-shopify-2026` — **3 085 impr**, **CTR 0 %**, pos **6,56**
- `/en/schema-shopify-2026` — **361 impr**, **CTR 0 %**, pos **6,03**
- `/en/seo-produits-shopify-2026` — **267 impr**, **CTR 0,37 %**, pos **6,16**
- `/en` (home) — **266 impr**, **CTR 0,38 %**, pos **5,38**

Pays / devices (3 mois) :
- **US** : **5 011 impr**, **2 clics**, **CTR 0,04 %**, pos **7,36** → priorité aux pages **EN** + signaux de confiance
- **Desktop** : **7 278 impr**, **CTR 0,08 %**, pos **6,99** ; **Mobile** : **1 725 impr**, **CTR 0,17 %**, pos **7,75**

### 0.1 Opportunités CTR (requêtes déjà en page 1)

**3 mois** (impr ≥ 20, pos ≤ 10, clics = 0) :
- `shopify seo performance evaluation 2025 or 2026` — **152 impr**, pos **4,24**
- `shopify updates march 2026` — **147 impr**, pos **7,85** (probable mismatch d’intention)
- `shopify seo best practices 2026` — **119 impr**, pos **7,04**
- `shopify product page seo best practices 2026` — **57 impr**, pos **5,88**
- `shopify product page seo best practices 2025 2026` — **57 impr**, pos **5,56**

**28 jours** (impr ≥ 10, pos ≤ 10, clics = 0) :
- `shopify product page seo best practices 2026` — **28 impr**, pos **5,00**
- `shopify seo performance evaluation 2025 or 2026` — **21 impr**, pos **8,05**
- `shopify conversion rate optimization 2026` — **18 impr**, pos **5,06**
- `shopify conversion rate optimization checklist 2026` — **13 impr**, pos **7,92**
- `shopify product page conversion best practices 2026` — **11 impr**, pos **2,64** (opportunité forte)

## 1) Diagnostic (pourquoi le CTR est si bas malgré des positions ~4–9)

- **Titles tronqués** : le template ajoutait `| EasyShopBuilder` à toutes les pages → moins de place pour le mot‑clé et les “hooks” (checklist, 2026, plan, etc.).
- **Signaux de langue faibles** : les pages `/en`, `/es`, `/de` sortaient en HTML avec `<html lang="fr">` (car `lang` était mis à jour uniquement côté client).
- **Duplication / canonicalisation** : présence de variantes `/en` vs `/en/` (et idem ES/DE) → dilution + incohérences.
- **SERP Shopify très concurrentielle + features** (résultats “assistés”, gros sites, etc.) : il faut un snippet *ultra clair* + des signaux “trust” pour récupérer des clics.

## 2) Correctifs techniques déployés (impact CTR direct)

### 2.1 `html[lang]` rendu côté serveur (international SEO)

Changement : mise en place de **root layouts par langue** (Next.js App Router) pour servir directement :
- FR : `<html lang="fr">`
- EN : `<html lang="en">`
- ES : `<html lang="es">`
- DE : `<html lang="de">`

Fichiers :
- `app/(fr)/layout.tsx`, `app/en/layout.tsx`, `app/es/layout.tsx`, `app/de/layout.tsx`
- pages associées : `app/(fr)/page.tsx`, `app/(fr)/[...slug]/page.tsx`, `app/en/*`, `app/es/*`, `app/de/*`

### 2.2 Titles non tronqués (suppression du suffixe branding)

Changement : `metadata.title.template = '%s'` dans chaque layout  
Effet : le `<title>` correspond au frontmatter (sans `| EasyShopBuilder`).

### 2.3 Favicon “Google-friendly”

Ajout :
- `public/favicon.ico` (multi‑tailles)
- `public/favicon.png` (96×96)
- `public/apple-touch-icon.png` (180×180)

Et mise à jour `metadata.icons` dans les layouts.

### 2.4 “Site name” / crédibilité : JSON‑LD `Organization` + `WebSite`

Ajout d’un composant unique inclus dans tous les layouts :
- `components/SiteJsonLd.tsx`

### 2.5 Article schema : conformité

Amélioration :
- `mainEntityOfPage` au format `WebPage` + `publisher.logo`  
Fichier : `lib/schema.ts`

### 2.6 Canonicalisation des home multi‑langues (et trailing slash)

Changements :
- Canonical des home : `/en`, `/es`, `/de` (au lieu de `/en/`, `/es/`, `/de/`)
- Redirections Netlify : suppression des trailing slashes pour les pages de langues  
Fichiers :
- `content/en/index.mdx`, `content/es/index.mdx`, `content/de/index.mdx`
- `lib/site.ts`
- `public/_redirects`

## 3) Optimisations “snippets” (titles/meta) appliquées sur les pages à fort volume (EN)

Objectif : **aligner title/H1** (réduire la réécriture Google) + ajouter des hooks “checklist / best practices / schema markup”.

Pages modifiées :
- `content/en/blog-seo-shopify-2026.mdx`
  - Title orienté “**best practices + checklist + plan**”
  - H1 aligné pour limiter la réécriture
- `content/en/blog-optimiser-conversion-shopify-2026.mdx`
  - Title orienté “**conversion rate optimization + CRO checklist**”
  - H1 aligné
- `content/en/schema-shopify-2026.mdx`
  - “**Schema Markup**” (terme plus recherché que “structured data”)
  - H1 aligné
- `content/en/seo-produits-shopify-2026.mdx`
  - Title raccourci (“Titles, variants & schema”) + description plus directe

## 4) Contenu & maillage interne — recommandations (pour impressions + CTR)

### 4.1 Créer 1 page dédiée “SEO performance evaluation”

Raison : la requête `shopify seo performance evaluation 2025 or 2026` fait **152 impressions** (pos **4,24**) avec **0 clic**.  
Action : une page dédiée “How to evaluate Shopify SEO performance (2026)” (KPIs, GSC, GA4, dashboard, audit template) + liens depuis :
- `/en/blog-seo-shopify-2026` (section “Measurement”)
- `/en/blog` (si tu veux, on peut aussi lever le `noindex` plus tard)

### 4.2 Couvrir “product page conversion best practices”

Raison : requête en **pos ~2,64** mais **0 clic** (28 jours).  
Action : soit ajouter une section dédiée dans `/en/blog-optimiser-conversion-shopify-2026`, soit créer une page satellite “product page conversion best practices (2026)” et lier depuis :
- `/en/seo-produits-shopify-2026`
- `/en/blog-optimiser-conversion-shopify-2026`

### 4.3 Renforcer les signaux “trust” sur les pages piliers

Le site a déjà `/about`, `/methodology`, `/sources`, `/contact`.  
Le next step CTR (surtout US) = rendre ces signaux plus visibles sur les pages piliers (ex : petit bloc “Methodology / Sources” au-dessus du contenu, ou en fin d’intro).

## 5) Mesure & itération (GSC)

Workflow (sur 28 jours, après déploiement) :
1. **Performance → Pages** : trier par **Impressions**
2. Filtrer **Position ≤ 10**
3. Pour chaque page prioritaire :
   - noter le CTR actuel
   - attendre **10–14 jours**
   - comparer **CTR à position comparable** (si la position bouge, le CTR bouge mécaniquement)

KPI à suivre :
- CTR pages piliers EN
- CTR sur requêtes “best practices / checklist / schema markup / conversion rate optimization”
- % impressions US (et CTR US)

## 6) Prochaines actions (priorisées)

1. Vérifier en prod (visuel + source HTML) sur 3 URLs : `html[lang]`, `<title>`, favicons, canonical.
2. Attendre 10–14 jours puis re‑lecture GSC : pages EN en pos 1–10 avec CTR faible.
3. Produire la page “SEO performance evaluation (2026)” + maillage interne depuis la pillar SEO.
4. Itération titles (1–2 variantes max) sur `/en/blog-seo-shopify-2026` et `/en/blog-optimiser-conversion-shopify-2026` si CTR ne remonte pas à position stable.

