# 15 — Recommended Tech Stack

## Stack Philosophy

- **Proven over trendy:** Every choice must have a strong production track record for health/content-heavy applications
- **SEO-native:** SSG/SSR are non-negotiable for public content pages
- **Scalable from day 1:** Architecture should not require a full rewrite when scale increases 10×
- **Accessible by default:** Framework choices should not fight accessibility
- **Rebrandable:** No hard-coded brand names in config — use env vars throughout

---

## Full Stack Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  PUBLIC WEBSITE (SEO)          MEMBER APP                       │
│  Next.js 15 App Router         Next.js 15 (same repo, /app)    │
│  Static + ISR for content      Dynamic RSC + Client Components  │
│  Sanity.io CMS                 API routes                       │
└─────────────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────────────┐
│  API LAYER                                                       │
│  Node.js + Hono (REST API, fast, TypeScript-native)             │
│  AI: Anthropic Claude API (claude-opus-4-7 / claude-sonnet-4-6) │
│  Streaming: SSE for chatbot responses                           │
└─────────────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────────────┐
│  DATA LAYER                                                      │
│  PostgreSQL 16 + pgvector     Redis 7                           │
│  (primary data + semantic     (session, cache, rate limit)      │
│   search)                                                        │
│  Drizzle ORM (type-safe,      S3-compatible storage             │
│  lightweight)                 (Cloudflare R2 or AWS S3)         │
└─────────────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────────────┐
│  INFRASTRUCTURE                                                  │
│  Vercel (Next.js hosting)     Railway / Render (API + DB)       │
│  Cloudflare (CDN + DNS)       Upstash (Redis managed)           │
│  Neon (PostgreSQL serverless) Resend (transactional email)      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Frontend

### Next.js 15 (App Router)

**Why:** Industry-standard React framework with first-class SSG/ISR support, crucial for SEO. Single codebase handles both the public content site and the member app. Server Components reduce client JS bundle.

**Key rendering decisions:**

| Page Type | Rendering Strategy | Reason |
|-----------|-------------------|--------|
| Condition pages | Static (SSG) + ISR (24h revalidation) | SEO-critical, rarely changes |
| Recipe pages | Static + ISR (24h) | SEO + performance |
| Recipe browse/search | Server-side (SSR) | Filter state needs fresh data |
| Herb pages | Static + ISR | SEO content, rarely changes |
| Blog articles | Static + ISR | SEO-critical |
| Local finder | SSR | Geo-dependent, personalized |
| App dashboard | Client-side + RSC | Auth-protected, dynamic |
| Chatbot | Client-side | Streaming SSE, real-time |
| Programmatic SEO pages | Static (build-time, bulk generation) | Performance at scale |

### TypeScript

Strict mode. No `any` escape hatches in production code. Shared types between frontend and API via a `packages/types` workspace package.

### Tailwind CSS v4

Design tokens from `14-design-system.md` implemented as CSS custom properties + Tailwind config. Single source of truth. No CSS-in-JS runtime overhead.

### React Query (TanStack Query) v5

For all client-side data fetching in the app: caching, background refresh, optimistic updates on save/log actions, SSE integration for chatbot streaming.

### Zustand

Lightweight client state for: onboarding flow, chatbot tone selection, local UI state. Avoid Redux overhead for this use case.

---

## CMS: Sanity.io

**Why:** Headless CMS with structured content modeling, real-time collaboration, custom validation, and a GROQ query language that handles complex content relationships. Non-technical staff can manage all content without touching code.

**Key Sanity schemas needed:**
- `recipe` — full recipe with nutrition, condition tags, cuisine, reviewer
- `exercise` — exercise with level, condition tags, modifications
- `herb` — herb with evidence level, drug interactions, kidney risk
- `conditionPage` — condition pillar pages with rich text sections
- `blogPost` — blog articles with SEO fields
- `localResource` — manually curated resource entries
- `motivationPrompt` — chatbot tone module copy (editable by staff)
- `chatbotGuardrail` — safety disclaimer copy (admin editable)
- `faqEntry` — FAQ questions with condition tags

**Custom validation in Sanity:**
- Recipes with kidney-related tags must have potassium + phosphorus values
- Herb pages cannot publish without `reviewedBy` and `reviewedAt` fields
- Condition pages cannot publish without medical disclaimer text
- Blog posts with medical content require `reviewedBy` field

**Sanity → Next.js integration:**
- Webhook on publish → triggers ISR revalidation of affected pages
- Portable Text renderer for rich content sections
- Sanity CDN for image delivery (with next/image integration)

---

## Backend API

### Hono (Node.js)

**Why:** TypeScript-native, extremely fast, lightweight. Better ergonomics than Express with native Web API support. Works well on Cloudflare Workers or traditional Node.js. Zod for validation.

### Authentication: Better Auth

**Why:** Open-source, TypeScript-first auth library. Handles email/password, OAuth (Google, Apple), sessions, and refresh tokens. Avoids vendor lock-in of Auth0/Clerk at early stage.

Alternatives if team prefers managed: Clerk (developer experience is excellent, reasonable cost at scale)

### AI Integration: Anthropic Claude API

**Primary model:** `claude-opus-4-7` for chatbot (highest empathy and safety capability)
**Secondary model:** `claude-sonnet-4-6` for lower-stakes tasks (recipe suggestions, search)

**Why Claude over OpenAI GPT-4:**
- Superior instruction-following for safety-critical prompts
- Better nuance in emotional/empathy contexts
- Better at maintaining character consistency across long conversations
- Anthropic's constitutional AI approach aligns with platform safety values

**Integration pattern:**
```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// Streaming chatbot response
const stream = await client.messages.stream({
  model: "claude-opus-4-7",
  max_tokens: 1024,
  system: buildSystemPrompt(userContext, toneModule),
  messages: conversationHistory,
});

// Stream SSE to client
for await (const chunk of stream) {
  // send chunk via SSE
}
```

**Prompt caching:** Use Anthropic's prompt caching on the static system prompt block to reduce costs (system prompt is 2,000+ tokens, cached = ~90% cost reduction on repeated calls).

### Email: Resend

- Transactional: verification, password reset, weekly summary
- Marketing (newsletter): Resend + React Email templates
- Reason: Best developer experience, React Email for template authoring

---

## Database

### PostgreSQL 16 + pgvector

**Hosted:** Neon (serverless PostgreSQL — scales to zero, branch per environment, generous free tier)

**pgvector** for semantic recipe/content search:
- Recipe embeddings: generated via OpenAI text-embedding-ada-002 or Anthropic equivalent on content creation
- Search flow: embed user query → cosine similarity search → return ranked recipes
- Also used for chatbot memory summarization (Phase 2)

### ORM: Drizzle ORM

**Why:** Type-safe, lightweight, closest-to-SQL of all ORMs. Schema defined in TypeScript, migrations auto-generated. Much faster than Prisma for complex queries. Works excellently with Neon.

### Redis: Upstash

Serverless Redis compatible. Pay-per-use. Perfect for session tokens, rate limiting, personalization cache, and conversation context windows.

---

## Infrastructure

### Hosting

| Service | What | Why |
|---------|------|-----|
| Vercel | Next.js frontend + API routes | First-class Next.js support, global edge network, automatic preview deployments |
| Railway | Background API server, webhooks | Simple deployment, good for long-running services |
| Cloudflare | CDN, DNS, DDoS protection | Performance + security |
| Neon | PostgreSQL | Serverless, branches for dev/staging/prod |
| Upstash | Redis | Serverless Redis, usage-based pricing |
| Cloudflare R2 | File/image storage | Cheaper than S3, zero egress fees |

### Monitoring

| Tool | Use |
|------|-----|
| Sentry | Error tracking (frontend + API) |
| Axiom | Log aggregation |
| Vercel Analytics | Core Web Vitals, page performance |
| PostHog | Product analytics, funnels, feature flags |
| Uptime Robot | Uptime monitoring + alerting |

---

## Third-Party Integrations

| Integration | Use | MVP? |
|-------------|-----|------|
| Stripe | Subscription billing | Phase 2 |
| Google Maps / Places API | Local resource map, distance calc | Phase 2 (basic zip in MVP) |
| Open Food Facts API | Food data, nutrition lookup | Phase 3 |
| Healthgrades API | Provider directory enrichment | Phase 2 |
| Apple Health / Google Fit | Wearable data import | Phase 3 |
| Twilio | SMS notifications | Phase 2 |
| Algolia | Advanced search | Phase 2 (use pgvector in MVP) |

---

## Development Tooling

```
Package manager:    pnpm (workspaces)
Monorepo:          Turborepo
Linting:           ESLint (Next.js config)
Formatting:        Prettier
Type checking:     tsc strict
Testing:           Vitest (unit) + Playwright (E2E)
Git hooks:         Husky + lint-staged
CI/CD:             GitHub Actions
Secrets:           Doppler (env var management)
API docs:          OpenAPI 3.1 (generated from Hono + Zod)
```

---

## Security Posture

| Concern | Implementation |
|---------|---------------|
| SQL injection | Drizzle ORM parameterized queries only; no raw query string interpolation |
| XSS | Next.js escapes by default; Sanity Portable Text sanitized output |
| CSRF | SameSite cookies + CSRF token on state-mutating requests |
| Rate limiting | Upstash rate limiter on all API routes; chatbot 20 req/min |
| Auth tokens | Short-lived JWTs (15min) + rotating refresh tokens |
| Sensitive data | No PHI stored without explicit consent; all PII encrypted at rest |
| API keys | Doppler for secret management; never in code or .env committed |
| Input validation | Zod schema validation on all API inputs |
| Content Security Policy | Strict CSP headers on all pages |
| Dependency scanning | Dependabot + npm audit in CI |
| HTTPS | Always on; HSTS enforced |

---

## Cost Estimate (Monthly, MVP Launch)

| Service | Tier | Est. Cost |
|---------|------|----------|
| Vercel | Pro | $20/mo |
| Neon | Launch | $19/mo |
| Upstash Redis | Pay-per-use | $5–15/mo |
| Anthropic API (Claude) | Usage | $50–200/mo (scales with users) |
| Cloudflare R2 | Free tier | $0–5/mo |
| Sanity.io | Growth | $99/mo |
| Resend | Pro | $20/mo |
| Sentry | Team | $26/mo |
| PostHog | Free tier | $0–20/mo |
| **Total estimate** | | **~$250–400/mo** |

Scales to ~$1,000–2,000/mo at 10,000 active users — entirely sustainable for a paid subscription model.
