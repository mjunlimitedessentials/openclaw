#!/usr/bin/env python3
"""
ThinkBox AI Readiness Audit — Phase 1 Assessment Tool
MJUEM AI Operations System™ by ThinkBox AI Operation Systems

Conducts an interactive client audit, scores AI readiness (0–50),
and produces a formatted Markdown + JSON report.

Usage:
    audit.py                          # Interactive mode
    audit.py --input profile.json     # Pre-filled from JSON
    audit.py --report-only --input x.json  # Re-generate report only
"""

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

ORG_TYPES = ["church", "small_business", "school", "enterprise", "nonprofit", "government", "other"]

SCORE_BANDS = [
    (0,  15, "Foundation Needed",   "Help the organization build structure before AI. Revisit in 60–90 days."),
    (16, 30, "Guided Readiness",    "Begin Phase 2 with heavy support. Expect a 60-day onboarding timeline."),
    (31, 45, "Strong Candidate",    "Full implementation ready. Move to Phase 2 within 2–4 weeks."),
    (46, 50, "Accelerated Track",   "Fast-track recommended. Phase 2 and 3 can run simultaneously."),
]

PHASE2_RECS = {
    "church":        "Member inquiry assistant (24/7 FAQ + prayer request routing)",
    "small_business":"Customer service AI (FAQ, booking, lead intake)",
    "school":        "Parent communication assistant + enrollment inquiry handler",
    "enterprise":    "Internal knowledge base AI (employee Q&A + document summarizer)",
    "nonprofit":     "Donor communication assistant + grant research agent",
    "government":    "Constituent inquiry handler + document summarization",
    "other":         "Customer/member communication assistant (start with highest-volume channel)",
}

REPORT_DIR = Path.home() / ".thinkbox" / "reports"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def divider(char="─", width=60) -> str:
    return char * width


def heading(text: str) -> str:
    return f"\n{divider()}\n  {text}\n{divider()}"


def prompt(question: str, default: str = "") -> str:
    hint = f" [{default}]" if default else ""
    try:
        answer = input(f"\n{question}{hint}: ").strip()
    except (KeyboardInterrupt, EOFError):
        print("\n\nAudit cancelled.")
        sys.exit(0)
    return answer if answer else default


def prompt_int(question: str, low: int = 0, high: int = 10, default: int = 5) -> int:
    while True:
        raw = prompt(f"{question} ({low}–{high})", str(default))
        try:
            val = int(raw)
            if low <= val <= high:
                return val
        except ValueError:
            pass
        print(f"  Please enter a number between {low} and {high}.")


def prompt_choice(question: str, choices: list[str]) -> str:
    display = " / ".join(f"{i+1}={c}" for i, c in enumerate(choices))
    while True:
        raw = prompt(f"{question}\n  Options: {display}", "").lower()
        if raw in choices:
            return raw
        try:
            idx = int(raw) - 1
            if 0 <= idx < len(choices):
                return choices[idx]
        except ValueError:
            pass
        print(f"  Choose one of: {', '.join(choices)}")


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:40]


def score_band(total: int) -> tuple[str, str]:
    for lo, hi, label, advice in SCORE_BANDS:
        if lo <= total <= hi:
            return label, advice
    return "Unknown", ""


# ---------------------------------------------------------------------------
# Collection
# ---------------------------------------------------------------------------

def collect_profile() -> dict:
    print(heading("SECTION A — Organization Profile"))

    name      = prompt("Organization name")
    org_type  = prompt_choice("Organization type", ORG_TYPES)
    size      = prompt("Number of staff / volunteers / members (estimate)")
    channels  = prompt("Primary communication channels (e.g. email, WhatsApp, Slack)")
    tech      = prompt("Current software / tech stack (e.g. Google Workspace, Salesforce)")
    budget    = prompt_choice(
        "Monthly budget range for AI implementation",
        ["under_500", "500_2000", "2000_5000", "5000_plus", "unknown"],
    )

    return {
        "name":     name,
        "org_type": org_type,
        "size":     size,
        "channels": channels,
        "tech":     tech,
        "budget":   budget,
    }


def collect_pain_points() -> list[str]:
    print(heading("SECTION B — Pain Points Discovery"))
    print("  Answer in your own words. Press Enter to skip a question.")

    questions = [
        "What tasks take the most manual time each week?",
        "What information gets lost or repeated most often?",
        "What inquiries come in from members/customers most often?",
        "Where do staff feel most overwhelmed or bottlenecked?",
        "What would save 10+ hours per week if it were automated?",
    ]

    pain_points = []
    for q in questions:
        answer = prompt(q)
        if answer:
            pain_points.append(answer)

    return pain_points


def collect_scores() -> dict[str, int]:
    print(heading("SECTION C — AI Readiness Score (0–10 each)"))
    print("  0 = very low / not in place   |   10 = excellent / fully in place\n")

    categories = {
        "data_organization":   "Data organization (0=paper/spreadsheets, 10=structured database)",
        "staff_tech_comfort":  "Staff tech comfort (0=resistant, 10=enthusiastic early adopters)",
        "leadership_buy_in":   "Leadership buy-in (0=skeptical, 10=fully committed)",
        "budget_allocation":   "Budget allocation (0=none, 10=dedicated AI budget)",
        "comms_infrastructure":"Communication infrastructure (0=fragmented, 10=unified platform)",
    }

    scores: dict[str, int] = {}
    for key, label in categories.items():
        scores[key] = prompt_int(label)

    return scores


# ---------------------------------------------------------------------------
# Report generation
# ---------------------------------------------------------------------------

def build_report(profile: dict, pain_points: list[str], scores: dict[str, int]) -> tuple[str, dict]:
    total       = sum(scores.values())
    band, advice = score_band(total)
    rec         = PHASE2_RECS.get(profile["org_type"], PHASE2_RECS["other"])
    date_str    = datetime.now(timezone.utc).strftime("%B %d, %Y")
    slug        = slugify(profile["name"])

    # Score bar (visual)
    filled  = round(total / 50 * 20)
    bar     = "█" * filled + "░" * (20 - filled)

    score_rows = "\n".join(
        f"| {k.replace('_', ' ').title():<30} | {v:>5}/10 |"
        for k, v in scores.items()
    )

    pain_list = "\n".join(f"- {p}" for p in pain_points) if pain_points else "- (No pain points recorded)"

    md = f"""# AI Readiness Report
**ThinkBox AI Operation Systems — MJUEM Phase 1 Output**

---

**Organization:** {profile['name']}
**Type:** {profile['org_type'].replace('_', ' ').title()}
**Assessment Date:** {date_str}
**Report Version:** 1.0

---

## Organization Profile

| Field | Value |
|-------|-------|
| Size | {profile['size']} |
| Communication Channels | {profile['channels']} |
| Current Tech Stack | {profile['tech']} |
| Budget Range | {profile['budget'].replace('_', ' ')} |

---

## Pain Points Identified

{pain_list}

---

## AI Readiness Score

```
Score: {total}/50   [{bar}]   {band}
```

| Category | Score |
|----------|-------|
{score_rows}
| **TOTAL** | **{total}/50** |

---

## Score Interpretation

**Band:** {band}

{advice}

---

## Phase 2 Recommendation

Based on this organization's type and readiness score, the recommended first AI system to build is:

> **{rec}**

This is the highest-ROI starting point for a {profile['org_type'].replace('_', ' ')} at this readiness level.

---

## Suggested Next Steps

"""

    if total <= 15:
        md += """1. **Foundation Sprint (30 days)** — Organize data, unify communication channels, and build leadership alignment before returning for a full audit.
2. **Revisit audit in 60–90 days** once foundation is in place.
3. **Optional:** Provide staff with AI literacy training to raise tech comfort score.
"""
    elif total <= 30:
        md += f"""1. **Schedule Phase 2 kickoff** within the next 2–4 weeks.
2. **Start with:** {rec}
3. **Allocate 60 days** for initial build + staff training.
4. **Identify 1–2 internal AI champions** who will manage the system daily.
"""
    elif total <= 45:
        md += f"""1. **Begin Phase 2 immediately** — this organization is ready.
2. **Build:** {rec} as the first system.
3. **Timeline:** 2–3 weeks to deploy, 1 week for training.
4. **Set 30-day check-in** to measure early results for case study.
"""
    else:
        md += f"""1. **Fast-track Phase 2 + 3** simultaneously — this organization can handle it.
2. **Deploy:** {rec} in Week 1.
3. **Begin Tier 1 automation** (auto-replies, scheduled content) in Week 2.
4. **Target case study completion** at 60-day mark.
"""

    md += f"""
---

## Notes for ThinkBox

- All client data stored locally — not shared externally
- Report generated by: ThinkBox AI Operation Systems audit.py
- Follow-up scheduled: _(add date)_

---

*This report was produced using the MJUEM AI Operations System™ by ThinkBox AI Operation Systems.*
"""

    data = {
        "schema_version": "1.0",
        "generated_at":   datetime.now(timezone.utc).isoformat(),
        "slug":           slug,
        "profile":        profile,
        "pain_points":    pain_points,
        "scores":         scores,
        "total_score":    total,
        "band":           band,
        "phase2_rec":     rec,
    }

    return md, data


# ---------------------------------------------------------------------------
# Persistence
# ---------------------------------------------------------------------------

def save_report(slug: str, md: str, data: dict) -> tuple[Path, Path]:
    REPORT_DIR.mkdir(parents=True, exist_ok=True)

    md_path   = REPORT_DIR / f"{slug}-audit.md"
    json_path = REPORT_DIR / f"{slug}-audit.json"

    md_path.write_text(md, encoding="utf-8")
    json_path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")

    return md_path, json_path


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def run_interactive() -> tuple[dict, list[str], dict]:
    print("\n" + "=" * 60)
    print("  ThinkBox AI Readiness Audit")
    print("  MJUEM AI Operations System™ — Phase 1")
    print("=" * 60)
    print("\nThis assessment takes 10–15 minutes.")
    print("All responses are stored locally on this device only.\n")

    profile     = collect_profile()
    pain_points = collect_pain_points()
    scores      = collect_scores()

    return profile, pain_points, scores


def main() -> None:
    parser = argparse.ArgumentParser(description="ThinkBox AI Readiness Audit")
    parser.add_argument("--input",       metavar="FILE", help="Pre-filled JSON profile (skips interactive questions)")
    parser.add_argument("--report-only", action="store_true", help="Re-generate report from existing JSON data")
    args = parser.parse_args()

    if args.input and args.report_only:
        raw = json.loads(Path(args.input).read_text(encoding="utf-8"))
        profile     = raw["profile"]
        pain_points = raw.get("pain_points", [])
        scores      = raw["scores"]
    elif args.input:
        raw = json.loads(Path(args.input).read_text(encoding="utf-8"))
        profile     = raw.get("profile", raw)  # support flat or nested
        pain_points = raw.get("pain_points", [])
        scores      = raw.get("scores", {})
        if not scores:
            _, pain_points, scores = run_interactive()
            pain_points = raw.get("pain_points", pain_points)
    else:
        profile, pain_points, scores = run_interactive()

    md, data  = build_report(profile, pain_points, scores)
    slug      = data["slug"]
    md_path, json_path = save_report(slug, md, data)

    print("\n" + "=" * 60)
    print("  AUDIT COMPLETE")
    print("=" * 60)
    print(f"\n  Score: {data['total_score']}/50 — {data['band']}")
    print(f"\n  Report (share with client):")
    print(f"    {md_path}")
    print(f"\n  Data file (used by Case Study tracker):")
    print(f"    {json_path}")
    print(f"\n  Phase 2 recommendation:")
    print(f"    {data['phase2_rec']}")
    print("\n" + "=" * 60 + "\n")


if __name__ == "__main__":
    main()
