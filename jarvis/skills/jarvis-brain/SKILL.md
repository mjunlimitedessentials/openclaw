---
name: jarvis-brain
description: "JARVIS brain visualizer. Use to OPEN, UPDATE, or answer questions from the interactive 3D infrastructure brain — the animated knowledge graph of the operator's business (clients, builds, skill suites, projects, notes). Use when the operator says: show me the brain, open the map, visualize my business, update the brain, what's connected to <X>. Business data only. NOT for: storing facts (use jarvis-crm) — this renders what CRM/sources already hold."
metadata: { "openclaw": { "emoji": "🧠" } }
---

# JARVIS Brain — the 3D infrastructure map

An animated, interactive 3D knowledge graph of the operator's business, rendered
on the OpenClaw **Canvas**. Lives in `jarvis/brain/` (`index.html` + `brain-data.js`).
It is the visual "face" of JARVIS — the operator's second brain, business-only.

## What it shows

Nodes = your business entities, colored by domain:
- **Builds** (cyan) — JARVIS itself, gateway, memory, the brain UI
- **Clients** (sky) — every client/local business
- **Skill Suites** (gold) — comms, content, CRM, research, SEO/GEO/Ads
- **Projects** (violet) — active engagements
- **Business Ops** (mint) — integrations (Gmail, Drive, Gamma, …)
- **Notes** (rose) — people, standing rules, pricing, brand voice

Edges = relationships. Node size = number of connections. Interactions: orbit
(drag), zoom (scroll), click to focus, shift-click to trace a path, search, physics
sliders, and an "Ask JARVIS" command bar.

## Open it (host on Canvas)

Serve `jarvis/brain/index.html` on the OpenClaw Canvas (the live UI channel the
operator controls). Point the Canvas at the folder so `brain-data.js` loads
alongside `index.html`. Then tell the operator it's up. See the `canvas` skill and
`docs.openclaw.ai` for Canvas hosting specifics on this install.

Standalone check: `index.html` also opens directly in a browser (it falls back to a
built-in sample graph if `brain-data.js` is absent).

## Update it (keep the brain current)

The graph is data-driven. Two ways to refresh:

1. **From the CRM (preferred).** Pull the operator's Supabase CRM (via jarvis-crm /
   the Supabase MCP): `people`, `projects`, `commitments`, plus builds/suites. Map
   each row to a record `{ id, label, cat, note, links:[...] }` and write JSON files
   into `jarvis/brain/sources/` (one file per type). Then run:
   ```bash
   node jarvis/brain/build-brain.mjs
   ```
   That regenerates `jarvis/brain/brain-data.js`. Reload the Canvas.

2. **By hand.** Edit the JSON under `jarvis/brain/sources/` (or `brain-data.js`
   directly) and regenerate/reload.

Categories (`cat`): `build`, `client`, `suite`, `project`, `ops`, `note`. Links are
bidirectional; the builder drops links to missing ids automatically.

### Mapping CRM → brain
- `people` → `cat:"note"`, link to their client/company.
- clients/local businesses → `cat:"client"`, link to their suites + projects.
- `projects` → `cat:"project"`, link to the client; put status in `note`
  (include "at risk" in the note so the Ask bar's risk view picks it up).
- `commitments` can be notes linked to their project/person.

## Answer questions from it

For "what's connected to BrightPath?" / "show me clients" you can either read the
graph data (`brain-data.js`) or drive the on-screen map. The Ask bar understands
`good morning`, `show me <domain>`, `what's at risk`, and node/name lookups; in the
live gateway those forward via `postMessage({type:"jarvis.ask"})` so JARVIS can
answer with real tools.

## Rules

- **Business only.** No personal data in the graph. Never put secrets/passwords in
  notes — the map is a shareable surface.
- Keep it truthful: the brain must reflect real CRM state. If you can't verify a
  node, don't invent it.
- After updating, tell the operator what changed ("added 2 clients, 1 project;
  BrightPath flagged at risk").
