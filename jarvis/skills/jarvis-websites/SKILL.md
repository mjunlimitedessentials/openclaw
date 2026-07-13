---
name: jarvis-websites
description: "JARVIS website builder. Use to generate cinematic 3D-scroll websites with the Higgsfield MCP (Seedance video), following the saved prompt packs in jarvis/websites/. Use when the operator says: build the JARVIS site, build my ThinkBox portfolio, make a landing page / product / portfolio site, run the website pack. Generates a hero/identity image first, then reference-locked video clips, then a scroll site. NOT for: static one-pagers/decks (use jarvis-content → Gamma) or editing existing sites."
metadata: { "openclaw": { "emoji": "🎬" } }
---

# JARVIS Website Builder

Turns a one-line brief into a cinematic, scroll-driven website using the
**Higgsfield MCP** (image + Seedance video + `create_website` / `deploy_website`).
Ready-made, tailored briefs live in `jarvis/websites/`.

## Saved packs
- `jarvis/websites/prompt-01-jarvis.md` — J.A.R.V.I.S. 2 landing page (no photo).
- `jarvis/websites/prompt-02-thinkbox.md` — ThinkBox AI Operation Systems founder
  portfolio (business automation + AI assistants; needs a front-facing photo).
- `jarvis/websites/README.md` — run steps, rules, credit/deploy notes.

When the operator names one of these, open the file and run the block inside it.
For a new subject, adapt the same structure (below) into a fresh block.

## The rules that make it work (never skip)
1. **Hero/identity image FIRST.** Generate one hero image (or, for a portrait
   site, use the operator's uploaded photo) and pass it as a **reference** to every
   video clip — that's what keeps the subject identical across shots.
2. **Credit-smart defaults.** Seedance 1.0, `std` mode, 1080p, 16:9, no audio,
   ~8s per clip. Only render higher for a final showpiece. Preflight with
   `get_cost: true` before a big batch.
3. **Chain clips** for continuous journeys: each clip's final frame = the next
   clip's start frame, so they scrub like one camera move on scroll.

## Workflow
1. **Brief** — subject, audience, 3 shot ideas, brand tone. Reuse a saved pack if
   it matches.
2. **Local media** — if the site stars the operator or a product photo, call the
   Higgsfield upload widget for the photo; use it as the identity reference. (Do
   not ask for chat attachments — remote tools can't read them.)
3. **Hero** — generate the hero/identity image. **Show it to the operator** before
   spending on clips.
4. **Clips** — generate each shot referencing the hero; re-roll weak takes.
5. **Assemble** — build the scroll-scrub site (`create_website`), pinned sections,
   momentum scroll, subtle cursor interactions.
6. **Preview, then deploy** — build on localhost / preview first. **Publishing a
   live URL is an outward action → confirm with the operator before `deploy_website`.**
7. **Direct it** — take feeling-based notes ("slow the orbit," "bigger headline,"
   "swap the font") and iterate.

## Cost & safety
- Generation spends the operator's Higgsfield credits and is subject to daily
  limits. If a call returns a limit/credits error, tell the operator plainly and
  offer to wait for reset or open `show_plans_and_credits` — don't silently retry.
- Never deploy or publish without explicit confirmation. Show what goes live and where.

## Reporting
"Hero's ready → [image]. Want me to spend ~N credits on the 3 clips, or tweak the
hero first?" Lead with the asset and the next decision, not the tool calls.
