# 19 — Launch Roadmap

## Roadmap Philosophy

This roadmap is **value-first**: every milestone should deliver something real to users, not just internal infrastructure. Ship the most compassionate, highest-quality version of each feature before adding the next one.

- **MVP:** Public website + basic app + core chatbot + seed content
- **Phase 2:** Full personalization + subscription tier + local resource enrichment
- **Phase 3:** Scale, B2B, and community features

---

## Pre-Launch (Weeks 1–6): Foundation

### Goal: Get the infrastructure, brand, and content foundation in place before writing user-facing code.

| Week | Task | Owner | Priority |
|------|------|-------|----------|
| 1–2 | Finalize brand name, domain, logo | Founders + Designer | Critical |
| 1–2 | Set up monorepo (Next.js + Hono + Neon + Sanity) | Lead Engineer | Critical |
| 1–2 | Design system tokens in code (colors, typography, spacing) | Designer + FE | Critical |
| 1–2 | CMS schema setup (recipe, herb, exercise, condition page) | FE + Content | Critical |
| 2–3 | Recruit medical reviewers (2 RDs + 1 MD minimum) | Founder | Critical |
| 2–3 | Content style guide document | Content Lead | High |
| 3–4 | Authentication system (email + Google OAuth) | Backend | Critical |
| 3–4 | Database schema migrations (Drizzle + Neon) | Backend | Critical |
| 4–5 | Onboarding questionnaire (web + app) | FE | High |
| 4–5 | Health profile + conditions storage | Backend | Critical |
| 5–6 | Basic recipe CRUD + CMS → API sync | Full stack | Critical |
| 5–6 | Basic exercise CRUD + CMS sync | Full stack | High |
| 5–6 | Chatbot basic integration (Claude API, streaming) | Backend + FE | Critical |

---

## MVP Launch (Weeks 7–16): Public Website + Core App

### Milestone 1 (Weeks 7–9): Public Content Site

**Goal:** Launch SEO-optimized public website with enough content to start generating organic traffic from day 1.

| Deliverable | Notes |
|------------|-------|
| Home page | Full design, CTA, condition navigator |
| 5 condition pillar pages | All clinician-reviewed, schema markup |
| Diabetes: 4 sub-pages | Nutrition, exercise, emotional, find help |
| Kidney health: 4 sub-pages | Including potassium + phosphorus guides |
| 20 seed recipes | Minimum: 4 per cuisine, all condition-tagged |
| 10 herb pages | Top searched herbs, all clinician reviewed |
| Find Help Near Me (basic) | Zip search, manual resource data, 3 cities |
| 5 blog articles | Targeting high-opportunity keywords |
| FAQ pages (diabetes + kidney) | Schema markup |
| Medical disclaimer infrastructure | Footer, inline, herb pages, condition pages |
| SEO infrastructure | Sitemap, robots.txt, schema, OG tags |
| Email capture (newsletter) | Resend integration |
| Legal pages | Privacy, Terms, Medical Disclaimer, Accessibility |

**SEO Quick Wins to Target at Launch:**
- "diabetes friendly soul food recipes" (low competition, high intent)
- "herbs to avoid with kidney disease" (near-zero competition)
- "seated exercises for people with diabetes" (low competition)
- "low potassium Mexican food" (low competition, high need)

### Milestone 2 (Weeks 10–13): Core App Experience

| Deliverable | Notes |
|------------|-------|
| Onboarding flow (8 screens) | Conditions, goals, cuisines, activity, motivation |
| Personalized home screen | Recipe + exercise of day, mood check-in |
| Recipe browse + save | Personalized feed, condition filters |
| Exercise browse + save | Level + condition filters |
| AI Companion (chatbot) | All 6 tone modes, safety escalation |
| "I'm struggling today" flow | Full flow with safety check |
| Mood check-in | Daily, stored, accessible in Track |
| Basic progress tracking | Goal overview, meal log (manual), movement log |
| Local resource finder (app) | Zip search, basic resource data |
| Push notifications | Daily check-in, movement reminder |
| Profile + settings | Health profile, preferences |

### Milestone 3 (Weeks 14–16): QA, Safety Audit, Soft Launch

| Task | Notes |
|------|-------|
| WCAG 2.2 AA audit | Automated + manual testing |
| Safety system audit | Test all escalation paths, verify crisis resources current |
| Clinical content review | All condition pages + herb pages reviewed before go-live |
| Load testing | Simulate 1,000 concurrent users |
| SEO technical audit | Validate all schema, check Core Web Vitals |
| Beta user testing | 25–50 beta users from target demographics (including Marlene/David/Rosa archetypes) |
| Soft launch | Limited marketing, monitor for issues |
| Bug triage + fix sprint | Prioritize anything that affects safety or core UX |

**MVP Launch Criteria:**
- [ ] All 5 condition pages live and reviewed
- [ ] Safety escalation paths tested and verified working
- [ ] At least 25 recipes live with condition tags
- [ ] Chatbot passes internal safety red-teaming (attempt to get harmful advice → verify it's blocked)
- [ ] WCAG AA automated test passes
- [ ] App store submission approved (iOS + Android via React Native, or PWA at MVP)
- [ ] Legal pages live and linked from footer
- [ ] Medical reviewers listed on About page

---

## Phase 2 (Months 4–9): Personalization + Subscription

### Goal: Deepen the product enough that users have strong reasons to subscribe. Launch VitalRoot+.

| Feature | Month | Notes |
|---------|-------|-------|
| Subscription system (Stripe) | 4 | VitalRoot+ at $9.99/mo |
| Recipe search (full-text + semantic) | 4 | pgvector semantic search |
| Meal planning calendar | 5 | Weekly meal planner, saved recipes |
| Grocery list generator | 5 | From meal plan |
| Workout plans (multi-week) | 5 | Condition-specific multi-week plans |
| Progress charts + visualizations | 5 | Mood chart, movement chart |
| AI companion memory (Phase 2) | 6 | Summarized context from past sessions |
| Proactive check-ins | 6 | AI-triggered based on mood trends + inactivity |
| Local resource enrichment (Google Places) | 6 | Photos, hours, reviews |
| Local SEO city pages (programmatic, 20 metros) | 6 | |
| Programmatic recipe × condition pages | 7 | 40 pages SEO |
| Exercise video demonstrations | 7 | |
| Herb A–Z (full library, 40+ herbs) | 7 | |
| Caregiver mode (basic) | 8 | Secondary profile linked to primary user |
| Spanish language content (20 priority pages) | 8 | Start with kidney + diabetes |
| Guest mode (no account required) | 8 | |
| Email newsletter + weekly digest | 8 | Personalized recipe + tip email |
| B2B interest waitlist | 9 | Employer wellness program pipeline |

---

## Phase 3 (Months 10–18): Scale + Community

### Goal: Platform becomes a community, not just an app. B2B revenue introduced.

| Feature | Priority | Notes |
|---------|----------|-------|
| Community forum | High | Condition-specific, moderated |
| User-submitted recipes (moderated) | High | |
| User-submitted local resources | Medium | |
| Wearable integration (Apple Health, Fitbit) | High | |
| Barcode scanner / food log | Medium | |
| AI-generated weekly meal plan | High | VitalRoot+ feature |
| Full Spanish localization (all pages) | High | |
| Haitian Creole localization | Medium | Caribbean diaspora priority |
| Family multi-user mode | High | |
| Care team sharing + reports | Medium | HIPAA review needed |
| B2B employer portal | High | Revenue |
| Clinician referral network | Medium | Vetted providers only |
| Voice input (chatbot) | Low | |
| Podcast / audio content | Low | |

---

## Content Roadmap

### Month 1–2 (MVP Foundation)
- 5 condition pillar pages
- 25 recipes (diverse cuisines, all condition-tagged)
- 15 herb pages
- 10 exercise descriptions (all levels)
- 5 blog articles

### Month 3–4
- 25 additional recipes (reach 50 total)
- 8 blog articles
- Remaining FAQ pages (all conditions)
- 10 exercise descriptions (reach 30)
- Heart health + obesity pillar pages complete

### Month 5–6
- 50 additional recipes (reach 100 total)
- 15 blog articles
- 20 herb pages (reach 35 total)
- Exercise library (50 exercises)
- First programmatic pages (cuisine × condition)

### Month 7–12
- 100 additional recipes (reach 200 total)
- 2 articles/week cadence
- Full herb library (50+ herbs)
- Programmatic FAQ pages launch
- City resource pages (20 metros)

---

## Team Build Roadmap

| Phase | Roles Needed |
|-------|-------------|
| Pre-launch | Founder(s), 1 full-stack engineer, 1 designer, 1 content lead |
| MVP Launch | + 1 backend engineer, 1 FE engineer, 1 medical reviewer contract |
| Phase 2 | + 1 content writer, 1 community manager, 1 SEO specialist |
| Phase 3 | + Sales (B2B), data engineer, 1 additional medical reviewer, customer support |

---

## Key Risk Milestones

| Risk | Milestone to Watch |
|------|-------------------|
| Safety system failure | Pre-launch: safety red-teaming must pass |
| Content quality | Pre-launch: all condition pages reviewed by clinician |
| SEO traction | Month 3: first 10 keywords ranking in top 20 |
| App retention | Month 3: 30-day retention > 30% |
| Revenue | Month 6: VitalRoot+ conversion rate > 3% of MAU |
| B2B pipeline | Month 9: 5 qualified enterprise conversations |
