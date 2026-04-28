# VitalRoot Health — Platform Architecture

> **Rebrand note:** All references to "VitalRoot" are token-swappable. Search-replace `VitalRoot` for name, `vitalroot` for slugs/domains, and `#2D6A4F` (primary green) for brand color to fully rebrand.

This directory contains the complete production-grade architecture for the VitalRoot Health platform — a compassionate, personalized digital health companion for people managing chronic conditions.

## Document Index

| # | File | Deliverable |
|---|------|-------------|
| 01 | [product-strategy.md](./01-product-strategy.md) | Product strategy, positioning, principles |
| 02 | [information-architecture.md](./02-information-architecture.md) | Website IA + App IA |
| 03 | [feature-matrix.md](./03-feature-matrix.md) | MVP / Phase 2 / Phase 3 feature matrix |
| 04 | [user-personas.md](./04-user-personas.md) | Six detailed user personas |
| 05 | [user-journeys.md](./05-user-journeys.md) | End-to-end user journeys |
| 06 | [sitemap.md](./06-sitemap.md) | Full sitemap (public + app) |
| 07 | [database-schema.md](./07-database-schema.md) | Full relational + document schema |
| 08 | [api-schema.md](./08-api-schema.md) | REST + streaming API endpoint plan |
| 09 | [prompt-architecture.md](./09-prompt-architecture.md) | AI chatbot prompt system + safety logic |
| 10 | [safety-rules.md](./10-safety-rules.md) | Safety, escalation, and disclaimer rules |
| 11 | [seo-strategy.md](./11-seo-strategy.md) | Full SEO strategy + keyword clusters |
| 12 | [content-clusters.md](./12-content-clusters.md) | Pillar pages + content cluster map |
| 13 | [wireframes.md](./13-wireframes.md) | Wireframe descriptions for key screens |
| 14 | [design-system.md](./14-design-system.md) | Design system tokens + component direction |
| 15 | [tech-stack.md](./15-tech-stack.md) | Recommended tech stack + rationale |
| 16 | [component-list.md](./16-component-list.md) | Full UI + logic component list |
| 17 | [admin-cms.md](./17-admin-cms.md) | CMS structure + admin panel design |
| 18 | [local-resource-finder.md](./18-local-resource-finder.md) | Local finder architecture + data model |
| 19 | [launch-roadmap.md](./19-launch-roadmap.md) | Prioritized launch roadmap |
| 20 | [risks-and-gaps.md](./20-risks-and-gaps.md) | Risks, gaps, and recommendations |

## Quick Architecture Summary

- **Public website:** Content-rich, SEO-first, condition-specific pillar pages + recipe hub + local finder
- **Member app:** Personalized dashboard driven by health profile + AI companion + progress tracking
- **AI layer:** Multi-tone chatbot with mood detection, safety escalation, and personalization engine
- **Data layer:** PostgreSQL (structured health data) + pgvector (semantic search) + Redis (session/cache)
- **CMS:** Sanity.io (headless, non-technical staff friendly)
- **Rendering:** Next.js 15 App Router — static for SEO pages, dynamic for app
- **Safety:** Hard-coded guardrails, clinician-review flags, crisis escalation paths

---

*All architecture is designed to be immediately actionable for design and engineering teams.*
