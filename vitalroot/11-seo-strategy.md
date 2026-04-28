# 11 — SEO Strategy

## SEO Philosophy

VitalRoot's SEO strategy is built on **trust architecture** — content that genuinely earns ranking through depth, accuracy, and cultural specificity that competitors don't have. We're not chasing volume keywords; we're dominating high-intent, underserved niches (culturally-specific condition content, local resource searches) that have real users behind them.

---

## SEO Goals (Year 1)

| Metric | Target |
|--------|--------|
| Organic sessions (Month 12) | 150,000/month |
| Keywords ranked in top 10 (Month 12) | 500+ |
| Organic to app signup conversion rate | 3–5% |
| Featured snippet captures | 50+ |
| Recipe rich result appearances | 200+ |
| Local SEO ranking for resource finder | Top 3 in 20 target metros |
| Domain Rating (Ahrefs) | 35+ by end of Year 1 |

---

## Keyword Strategy

### Priority 1: High-Intent Condition + Action Keywords

These users are searching for solutions. Conversion potential is highest.

| Keyword | Monthly Volume Est. | Difficulty | Page Target |
|---------|-------------------|------------|------------|
| diabetes friendly soul food recipes | 2,400 | Low | /recipes/cuisine/soul-food (+ diabetes filter) |
| what can i eat with kidney disease | 8,100 | Medium | /conditions/kidney-health/nutrition |
| heart healthy caribbean recipes | 1,300 | Low | /recipes/cuisine/caribbean (+ heart filter) |
| exercises for diabetics at home | 5,400 | Medium | /move/by-condition/diabetes |
| seated exercises for elderly with diabetes | 1,900 | Low | /move/by-level/seated-bedside |
| prediabetes what to eat | 12,100 | Medium-High | /conditions/diabetes/prediabetes |
| is fenugreek safe with metformin | 1,600 | Low | /natural-support/herbs/fenugreek |
| low potassium foods for kidney disease | 9,900 | Medium | /conditions/kidney-health/potassium-guide |
| how to lower A1C naturally | 40,500 | High | /conditions/diabetes/blood-sugar-management |
| diabetes support groups near me | 3,600 | Medium | /find-help |
| caregiver resources for diabetes | 1,200 | Low | /emotional-wellness/caregiver-support |
| post stroke recovery diet | 4,400 | Medium | /conditions/brain-recovery/stroke-recovery |

### Priority 2: Cultural Cuisine + Health Keywords

Competitors have almost no presence here. High opportunity.

| Keyword | Volume Est. | Page Target |
|---------|------------|------------|
| healthy soul food recipes for diabetics | 1,900 | /recipes/cuisine/soul-food |
| kidney friendly mexican food | 1,100 | /recipes/cuisine/latin + kidney filter |
| diabetes friendly jerk chicken | 590 | Individual recipe page |
| heart healthy collard greens | 880 | Individual recipe page |
| African food for diabetes | 720 | /recipes/cuisine/african |
| plant based Caribbean diet | 1,400 | /recipes/cuisine/caribbean + plant_forward |
| healthy gumbo recipe for high blood pressure | 480 | Individual recipe page |
| low sodium soul food | 2,900 | /recipes/cuisine/soul-food + low_sodium |

### Priority 3: Herb/Supplement Safety Keywords (Near Zero Competition)

| Keyword | Volume Est. | Page Target |
|---------|------------|------------|
| herbs to avoid with kidney disease | 3,600 | /natural-support/kidney-disease-caution |
| is [herb] safe with metformin | varies | /natural-support/herbs/[herb] |
| fenugreek blood sugar side effects | 2,400 | /natural-support/herbs/fenugreek |
| berberine vs metformin | 8,100 | /natural-support/herbs/berberine |
| turmeric kidney disease safety | 1,900 | /natural-support/herbs/turmeric |
| cinnamon for diabetes does it work | 5,400 | /natural-support/herbs/cinnamon |

### Priority 4: Local + Programmatic SEO (Phase 2)

| Pattern | Example | Volume Signal |
|---------|---------|--------------|
| dietitian for diabetes [city] | dietitian for diabetes Houston | High local intent |
| diabetes support group [city] | diabetes support group Atlanta | High local intent |
| farmers market [zip/city] | farmers market 77001 | Location intent |
| kidney disease dietitian near me | — | High intent |
| free diabetes classes [city] | — | High intent |

---

## On-Page SEO Standards

### Title Tag Templates

```
[Condition] + [Cuisine] Recipes — VitalRoot Health
e.g.: "Diabetes-Friendly Soul Food Recipes — VitalRoot Health"

[Keyword Question] — Answered by a Registered Dietitian | VitalRoot
e.g.: "Is Fenugreek Safe with Metformin? A Dietitian Answers | VitalRoot Health"

[Number] [Condition] Recipes for [Cuisine] Lovers | VitalRoot Health
e.g.: "15 Kidney-Friendly Mexican Recipes | VitalRoot Health"
```

### Meta Description Template

```
[Answer the search intent directly in 1 sentence.] [Secondary hook: culturally aware, reviewed by, etc.] [CTA: Join free.]

Example:
"Looking for kidney-friendly recipes that work with Mexican and Latin cooking?
These 15 dishes are reviewed by a renal dietitian and designed around the
flavors you love — not around giving them up. Join VitalRoot free."
```

### H1 / Heading Hierarchy Rules

- H1: Exact or close match to primary keyword (one H1 per page)
- H2: Supporting keyword targets + logical sections
- H3: FAQ format ("Can people with diabetes eat beans?") — captures featured snippets
- H4: Subsections within H3 content

### Content Length Guidelines

| Page Type | Target Word Count |
|-----------|-----------------|
| Condition pillar pages | 2,500–4,000 words |
| Condition sub-pages | 1,200–2,000 words |
| Recipe pages | 400–800 words (+ schema) |
| Blog articles | 1,500–2,500 words |
| FAQ pages | 800–1,500 words |
| Herb pages | 800–1,500 words |
| Exercise pages | 400–600 words |

---

## Schema Markup Strategy

### Recipe Pages
```json
{
  "@context": "https://schema.org/",
  "@type": "Recipe",
  "name": "Braised Collard Greens (Diabetes-Friendly)",
  "image": "https://cdn.vitalroot.health/collard-greens-hero.jpg",
  "author": {
    "@type": "Organization",
    "name": "VitalRoot Health"
  },
  "datePublished": "2025-11-01",
  "description": "A comforting soul food classic made diabetes-friendly with less sodium and no added sugar. Reviewed by a registered dietitian.",
  "prepTime": "PT10M",
  "cookTime": "PT25M",
  "totalTime": "PT35M",
  "recipeYield": "4 servings",
  "nutrition": {
    "@type": "NutritionInformation",
    "calories": "95 calories",
    "carbohydrateContent": "12 g",
    "sodiumContent": "210 mg",
    "fiberContent": "5 g"
  },
  "recipeIngredient": ["1 bunch collard greens", "..."],
  "recipeInstructions": [{"@type": "HowToStep", "text": "..."}],
  "keywords": "diabetes friendly, soul food, collard greens, low sodium",
  "recipeCategory": "Side Dish",
  "recipeCuisine": "Southern"
}
```

### FAQ Pages
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can people with diabetes eat soul food?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — many traditional soul food dishes can be adapted to be diabetes-friendly. The keys are reducing added sugar, managing sodium, choosing lean proteins, and including more fiber-rich vegetables. Dishes like collard greens, bean-based dishes, and baked (not fried) proteins can all fit into a diabetes-friendly eating pattern."
      }
    }
  ]
}
```

### Medical Article Schema
```json
{
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "name": "Chronic Kidney Disease and Diet: What to Eat and Avoid",
  "description": "...",
  "medicalAudience": {
    "@type": "MedicalAudience",
    "audienceType": "Patient"
  },
  "reviewedBy": {
    "@type": "Person",
    "name": "Dr. Sarah Chen, RD",
    "jobTitle": "Registered Dietitian"
  },
  "lastReviewed": "2025-11-15",
  "url": "https://vitalroot.health/conditions/kidney-health/nutrition"
}
```

### Local Business Schema (Find Help pages)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Community Health Advocates",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1234 Main St",
    "addressLocality": "Los Angeles",
    "addressRegion": "CA",
    "postalCode": "90022"
  },
  "telephone": "323-555-0100",
  "openingHoursSpecification": [...]
}
```

---

## Internal Linking Strategy

### Hub-and-Spoke Model

Every condition page links to:
- Its nutrition sub-page
- Its exercise sub-page
- Its emotional wellness sub-page
- Relevant recipe category
- Find Help Near Me (with condition filter pre-set)
- 3+ blog articles on related topics

Every recipe page links to:
- The condition pages it's tagged for
- Related recipes (same cuisine or condition)
- The local resource finder ("Find a dietitian who can help you plan meals")

Every herb page links to:
- Herb Safety overview page
- Relevant condition pages (where the herb is used)
- Drug interaction resources

### Footer-Level Linking

A sitewide footer includes:
- All condition pages (direct links)
- Recipe categories (top 6)
- Cuisine categories (top 6)
- Find Help Near Me
- Key blog posts (rotates quarterly)

---

## Technical SEO Requirements

| Requirement | Implementation |
|-------------|---------------|
| Core Web Vitals: LCP < 2.5s | Next.js image optimization, CDN |
| Core Web Vitals: CLS < 0.1 | Reserved image space, no layout shift |
| Core Web Vitals: INP < 200ms | Minimal client-side JS on content pages |
| Mobile-first indexing | Mobile design is primary |
| SSL (HTTPS) | Always on |
| XML sitemap | Auto-generated from Next.js; submitted to Google Search Console |
| robots.txt | Block /app/*, /admin/*, /auth/* from crawl |
| Canonical tags | All paginated/filtered pages have canonical to main page |
| 301 redirects | Any URL changes get proper permanent redirects |
| Structured data validation | Test with Google Rich Results Test on every schema type |
| Page speed < 3s on 3G | Critical for users in lower-bandwidth areas |
| Open Graph + Twitter Card meta | All pages for social sharing |

---

## Programmatic SEO Plan (Phase 2)

### Pattern 1: Cuisine × Condition
`/recipes/[cuisine]/[condition]`
- 8 cuisines × 5 conditions = 40 auto-generated category pages
- Each page: curated recipe grid + condition-specific intro copy + CTA
- Unique intro copy per combination (no duplicate content)

### Pattern 2: Local Resource City Pages
`/find-help/[state]/[city]`
- Generated for 500+ cities with populated resource data
- Each page: embedded resource finder pre-filtered to city + SEO intro
- Schema: LocalBusiness for each resource

### Pattern 3: FAQ by Condition + Topic
`/learn/faq/[condition]/[question-slug]`
- Generated from structured FAQ database
- Each question becomes a standalone URL targeting long-tail queries
- Answer minimum 200 words; FAQPage schema on every page

### Pattern 4: Herb by Condition Use
`/natural-support/herbs/[condition-use]`
- e.g., `/natural-support/herbs/blood-sugar-support`
- Lists herbs with evidence for that condition use
- Each page gets Condition + evidence-rating content

---

## Content Calendar (First 6 Months SEO Focus)

### Month 1–2: Authority Foundation
- All 5 condition pillar pages (published, reviewed, schema)
- All 4 condition sub-pages (nutrition, exercise, emotional, find help)
- 15 hero recipes (culturally diverse, schema-marked)
- 10 herb pages (top searched)

### Month 3–4: Keyword Cluster Expansion
- 25 blog articles targeting long-tail cluster keywords
- Cuisine category pages (8 cuisines)
- Exercise library (50 exercises)
- FAQ pages for each condition

### Month 5–6: Programmatic + Local
- Cuisine × Condition recipe category pages (40 pages)
- Local resource city pages (top 20 metros)
- FAQ programmatic pages launch
- Link building outreach (diabetes education orgs, community health orgs)

---

## Link Building Strategy

| Tactic | Target | Effort |
|--------|--------|--------|
| Guest posts on diabetes/nutrition blogs | DR 30–60 health sites | Medium |
| HARO / journalist queries for health topics | National health media | Medium |
| Partner with diabetes educator organizations | .org + .edu links | High effort, high value |
| Local listings: Google Business, Yelp, Healthgrades | Local SEO signals | Low |
| Cultural community organization partnerships | NAACP Health, LULAC Health | High effort, high value |
| Recipe roundups: pitch to food + health blogs | Food media sites | Medium |
| Free resource offers (downloadable guides) | Link magnet strategy | Medium |
