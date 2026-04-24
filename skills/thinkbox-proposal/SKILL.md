---
name: thinkbox-proposal
description: "ThinkBox Enterprise Proposal Generator — produces a professional AI implementation proposal document for a client organization. Use when: (1) preparing a formal proposal for a church, business, school, or government body, (2) a prospect has completed an audit and needs a document to present to their board or leadership team, (3) generating a scoped statement of work with pricing tiers and ROI projections. NOT for: general AI questions, active engagements already in Phase 2+, or internal ThinkBox planning."
metadata:
  {
    "openclaw":
      {
        "emoji": "📄",
        "requires": { "bins": ["python3"] },
      },
  }
---

# ThinkBox Enterprise Proposal Generator

**ThinkBox AI Operation Systems — Business Development Tool**

Generates a professional, board-ready AI implementation proposal. Pulls audit
data automatically from `thinkbox-audit` output. Takes 5–10 minutes to complete.

## When to Use

✅ **USE this skill when:**

- A prospect completed Phase 1 audit and needs a formal document for their leadership
- Submitting a proposal to a school board, church council, or government committee
- Preparing a statement of work before a paid engagement begins
- Following up after an initial sales conversation with a leave-behind document

❌ **DON'T use this skill when:**

- Client hasn't been audited → run `thinkbox-audit` first (score strengthens the proposal)
- Active engagement already underway → use `thinkbox-casestudy` to track results
- Quick verbal pitch → just use `mjuem-ops` talking points

## Commands

### Generate a new proposal

```bash
# From an existing audit (recommended — auto-fills org data and score)
python3 {baseDir}/scripts/proposal.py --from-audit grace-community-church

# Interactive (no prior audit)
python3 {baseDir}/scripts/proposal.py
```

### List all generated proposals

```bash
python3 {baseDir}/scripts/proposal.py --list
```

### Regenerate an existing proposal

```bash
python3 {baseDir}/scripts/proposal.py --regenerate grace-community-church
```

## Output

Two files written to `~/.thinkbox/proposals/`:

| File | Purpose |
|------|---------|
| `<slug>-proposal.md` | Full proposal document — print, email, or convert to PDF |
| `<slug>-proposal.json` | Source data for future edits |

## What the Proposal Includes

1. **Executive Summary** — who ThinkBox is and what we're proposing
2. **Current State Assessment** — audit score, pain points, readiness band
3. **Proposed Solution** — MJUEM phases with scope per phase
4. **Investment Options** — 3 pricing tiers (Starter, Standard, Enterprise)
5. **ROI Projection** — estimated hours saved and value generated
6. **Timeline** — week-by-week implementation schedule
7. **Why ThinkBox** — differentiators and positioning statement
8. **Next Steps** — clear call to action

## Pricing Tiers (Edit to Match Your Current Rates)

| Tier | Scope | Range |
|------|-------|-------|
| Starter | Phase 1 + one Phase 2 system | $1,500–$3,500 |
| Standard | Phases 1–3 + training | $4,000–$8,500 |
| Enterprise | Full MJUEM (all 4 phases) + ongoing support | $10,000–$25,000+ |

Pricing is editable in the generated proposal and in `scripts/proposal.py`.

## Notes

- Always personalize the Executive Summary before sending — generic proposals lose deals
- Include a case study link if one exists from `thinkbox-casestudy`
- For government or school board submissions, use the Enterprise tier template
- The proposal is intentionally structured for a 10-minute board read — keep it that way
