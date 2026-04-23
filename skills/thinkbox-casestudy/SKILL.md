---
name: thinkbox-casestudy
description: "ThinkBox Case Study Tracker — records before/after metrics for client engagements at 30, 60, and 90-day intervals and generates shareable case study documents. Use when: (1) checking on a client's progress after AI deployment, (2) recording new metric snapshots at milestone dates, (3) generating a case study document for a completed engagement, (4) viewing a dashboard of all active client engagements. NOT for: running the initial audit (use thinkbox-audit), general AI questions, or non-ThinkBox engagements."
metadata:
  {
    "openclaw":
      {
        "emoji": "📈",
        "requires": { "bins": ["python3"] },
      },
  }
---

# ThinkBox Case Study Tracker

**ThinkBox AI Operation Systems — Proof Library Tool**

Tracks client results over time and produces polished case study documents.
Reads audit data from `thinkbox-audit` automatically — no re-entry of client info.

## When to Use

✅ **USE this skill when:**

- A client has completed Phase 2 (Build) and you need to start tracking results
- It's the 30, 60, or 90-day milestone for an active engagement
- Generating a case study to share with a new prospect
- Reviewing the dashboard of all engagements to see who's due for a check-in

❌ **DON'T use this skill when:**

- Client hasn't been audited yet → run `thinkbox-audit` first
- General progress questions not tied to a tracked engagement

## Commands

### See all tracked engagements

```bash
python3 {baseDir}/scripts/tracker.py dashboard
```

### Start tracking a new client (after their audit)

```bash
# From an existing audit file (recommended)
python3 {baseDir}/scripts/tracker.py new --from-audit grace-community-church

# From scratch (if no audit was run)
python3 {baseDir}/scripts/tracker.py new
```

### Record a metric snapshot (30 / 60 / 90 day check-in)

```bash
python3 {baseDir}/scripts/tracker.py update grace-community-church --day 30
python3 {baseDir}/scripts/tracker.py update grace-community-church --day 60
python3 {baseDir}/scripts/tracker.py update grace-community-church --day 90
```

### Generate the final case study document

```bash
python3 {baseDir}/scripts/tracker.py report grace-community-church
```

### List all client slugs

```bash
python3 {baseDir}/scripts/tracker.py list
```

## Data Storage

All engagement data lives in `~/.thinkbox/engagements/`:

| File | Contents |
|------|----------|
| `<slug>-engagement.json` | Full engagement record (audit baseline + all metric snapshots) |
| `<slug>-case-study.md`   | Generated case study (ready to share) |

## Metric Categories Tracked

At each check-in (30 / 60 / 90 days), the tracker records:

| Metric | Example |
|--------|---------|
| Weekly admin hours before/after | 20 hrs → 8 hrs |
| Average inquiry response time before/after | 2 days → 5 minutes |
| Member/customer satisfaction (1–10) | 6 → 9 |
| Staff morale / ease of work (1–10) | 5 → 8 |
| Custom metric (you define label + value) | "Sunday attendance" 200 → 240 |

## Workflow

```
thinkbox-audit  →  thinkbox-casestudy new  →  deploy AI system
                                         ↓
                              update --day 30
                                         ↓
                              update --day 60
                                         ↓
                              update --day 90  →  report  →  share with prospects
```

## Notes

- The 30-day snapshot is the most important — lock it in on schedule
- Always get a direct quote from leadership at the 90-day mark
- Case studies are your best sales tool — prioritize completing them
- All data is local; share only the generated `.md` report externally
