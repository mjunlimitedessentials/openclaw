# OpenClaw — Claude Standing Instructions
## ThinkBox AI Operation Systems | CEO: Mona Jackson-Ham

---

## Standing Preferences

### HTML File Saving
Whenever an important HTML file is created or updated (proposals, reports, landing pages, client deliverables):
1. Save to the primary location (e.g. `tools/`, `~/.thinkbox/proposals/`)
2. Remind Mona to upload to Google Drive and label it clearly
3. Suggest the Google Drive label format: `[ClientName] — [DocumentType] — [Date]`

**Why:** Mona needs all client-facing HTML files accessible from her iPhone and shareable with clients without email attachment issues.

**Note:** Claude cannot directly access Google Drive. Mona must upload manually OR install Google Drive for Desktop on her HP laptop so files sync automatically from a local folder.

### Google Drive Label Format
Use this naming convention for all saved files:
- `FAIS Reference Labs — Enterprise Proposal — May 2026`
- `ThinkBox — Marketing Landing Page — May 2026`
- `[Client Name] — AI Readiness Report — [Month Year]`

---

## Client Memory

### Client 1: FAIS Reference Labs Inc
- **Also known as:** Envisions Transportation Compliance LLC (ETC)
- **Industry:** DOT/Non-DOT compliance, C/TPA, drug & alcohol testing, training
- **Decision maker:** Leadership Team (confirm name on discovery call)
- **Location:** Maryland / Texas
- **Status:** Proposal sent — Enterprise tier — MJUEM-FAIS-202605
- **Tier:** Enterprise ($10,000 – $25,000+)
- **AI Readiness Score:** 30/50 — Guided Readiness (Enterprise Vision)
- **3 AI Systems to build:**
  1. Employer-facing AI assistant (24/7 compliance FAQ)
  2. Internal operations AI (SOP, RFP prep)
  3. Compliance notification engine (randoms, training expiry, results)
- **Key files:**
  - `tools/fais-proposal.html`
  - `~/.thinkbox/proposals/fais-reference-labs-proposal.html`
  - `skills/thinkbox-proposal/scripts/generate_fais_proposal.py`
- **Google Drive label:** `FAIS Reference Labs — Enterprise Proposal — May 2026`
- **Next step:** Schedule 30-min strategy call after proposal review

### Client 0 (Beta/Demo): Eternal Life In Christ Ministries (ELICM)
- **Contact:** Ken & Tresti Cunningham, Waldorf MD
- **AI Readiness Score:** 8/50 — Foundation Needed
- **Tier:** Starter ($1,500–$3,500)
- **Status:** Proposal delivered (PDF via email)

---

## ThinkBox Contact Info
- **CEO:** Mona Jackson-Ham
- **Email:** ThinkBoxAIStudios@gmail.com
- **Phone:** +1 (203) 943-3579
- **Brand colors:** Navy #1a2744 | Gold #c9a227

## Git Branch
All development: `claude/implement-chatgpt-suggestions-Mz2W4`

---

## File Locations Quick Reference
| File | Location |
|---|---|
| ThinkBox launcher | `tools/thinkbox.bat` |
| Marketing landing page | `tools/landing-page.html` |
| FAIS proposal | `tools/fais-proposal.html` |
| Audit tool | `skills/thinkbox-audit/scripts/audit.py` |
| Proposal tool | `skills/thinkbox-proposal/scripts/proposal.py` |
| Assistant builder | `skills/thinkbox-assistant/scripts/setup.py` |
| Case study tracker | `skills/thinkbox-casestudy/scripts/tracker.py` |
| Main launcher | `skills/thinkbox/scripts/thinkbox.py` |
| HTML export | `skills/thinkbox/scripts/html_export.py` |
