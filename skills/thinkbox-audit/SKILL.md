---
name: thinkbox-audit
description: "ThinkBox AI Readiness Audit — conducts an interactive Phase 1 assessment for an organization and produces a scored AI Readiness Report. Use when: (1) starting a new client engagement, (2) a church, business, school, or enterprise wants to know where to begin with AI, (3) you need to generate a formal AI Readiness Report with scores and recommendations. NOT for: general AI questions, already-audited clients moving to Phase 2+, or personal use cases."
metadata:
  {
    "openclaw":
      {
        "emoji": "📋",
        "requires": { "bins": ["python3"] },
      },
  }
---

# ThinkBox AI Readiness Audit

**ThinkBox AI Operation Systems — Phase 1 Tool**

Conducts the MJUEM Phase 1 (Audit) assessment interactively with a client and produces a formatted AI Readiness Report with scoring and Phase 2 recommendations.

## When to Use

✅ **USE this skill when:**

- Starting a new client engagement (always run audit first)
- A client asks "where do we even begin with AI?"
- You need a formal report to share with leadership or a board
- Qualifying a prospect before scoping a project

❌ **DON'T use this skill when:**

- Client has already completed Phase 1 → go to `mjuem-ops` for Phase 2
- Quick general AI question → answer directly
- Internal ThinkBox operations → use other skills

## How to Run the Audit

### Option A — Interactive (Recommended)

Run the audit script directly. It walks through all sections, scores automatically, and writes a report file:

```bash
python3 {baseDir}/scripts/audit.py
```

The script will:
1. Ask for the organization profile (name, type, size, channels, tech stack, budget)
2. Ask the pain points discovery questions
3. Ask for scores on 5 readiness categories (0–10 each)
4. Calculate the total score and interpret it
5. Write a formatted Markdown report to `~/.thinkbox/reports/`
6. Print the report path and a summary to the terminal

### Option B — Pre-filled (For Repeat Clients or Fast Sessions)

Pass a JSON profile file to skip the interactive questions:

```bash
python3 {baseDir}/scripts/audit.py --input /path/to/client-profile.json
```

### Option C — Report Only (Re-generate from existing data)

```bash
python3 {baseDir}/scripts/audit.py --report-only --input ~/.thinkbox/reports/org-name.json
```

## Output

The audit produces two files in `~/.thinkbox/reports/`:

| File | Contents |
|------|----------|
| `<org-slug>-audit.md` | Human-readable AI Readiness Report (share with client) |
| `<org-slug>-audit.json` | Machine-readable data (used by Case Study tracker in Step 3) |

## Score Interpretation

| Score | Band | Action |
|-------|------|--------|
| 0–15 | Foundation Needed | Help org structure first; revisit AI in 60–90 days |
| 16–30 | Guided Readiness | Begin Phase 2 with heavy support and training |
| 31–45 | Strong Candidate | Full implementation — move within 2–4 weeks |
| 46–50 | Accelerated Track | Fast-track — can run Phase 2 and 3 simultaneously |

## After the Audit

1. Share the `.md` report with the client's leadership
2. Schedule a follow-up to walk through the recommendations
3. If score ≥ 16, transition to `mjuem-ops` Phase 2 (Build)
4. Store the `.json` file — the Case Study tracker will use it later

## Notes

- Always conduct the audit in person or on a call — not via async email
- The pain points section often reveals the best Phase 2 starting point
- If a client scores below 16, offer a 30-day "Foundation Sprint" before the full audit
- All data is stored locally — nothing leaves the device without the client's consent
