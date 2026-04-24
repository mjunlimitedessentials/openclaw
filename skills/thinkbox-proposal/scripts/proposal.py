#!/usr/bin/env python3
"""
ThinkBox Enterprise Proposal Generator
MJUEM AI Operations System™ by ThinkBox AI Operation Systems

Produces a professional, board-ready AI implementation proposal.
Auto-populates from thinkbox-audit output when available.

Usage:
    proposal.py                              # Interactive
    proposal.py --from-audit <slug>          # Load from audit JSON
    proposal.py --regenerate <slug>          # Rebuild from saved proposal data
    proposal.py --list                       # List all proposals
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path


# ---------------------------------------------------------------------------
# Paths & constants
# ---------------------------------------------------------------------------

REPORT_DIR   = Path.home() / ".thinkbox" / "reports"
PROPOSAL_DIR = Path.home() / ".thinkbox" / "proposals"

PRICING = {
    "starter": {
        "label":   "Starter",
        "scope":   "Phase 1 Audit + one Phase 2 AI system + staff training session",
        "range":   "$1,500 – $3,500",
        "timeline":"4–6 weeks",
        "support": "30-day email support post-launch",
    },
    "standard": {
        "label":   "Standard",
        "scope":   "Phases 1–3 (Audit, Build, Automate) + 2 AI systems + 3 training sessions",
        "range":   "$4,000 – $8,500",
        "timeline":"8–12 weeks",
        "support": "90-day support + monthly check-in calls",
    },
    "enterprise": {
        "label":   "Enterprise",
        "scope":   "Full MJUEM (all 4 phases) + unlimited AI systems + quarterly strategy sessions",
        "range":   "$10,000 – $25,000+",
        "timeline":"12–24 weeks",
        "support": "Dedicated account manager + priority support + annual renewal",
    },
}

ROI_ESTIMATES = {
    "church":        {"hours_saved": 15, "value_per_hour": 25,  "other": "Increased member engagement and 24/7 pastoral availability"},
    "small_business":{"hours_saved": 20, "value_per_hour": 50,  "other": "Faster lead response times and reduced missed opportunities"},
    "school":        {"hours_saved": 12, "value_per_hour": 35,  "other": "Improved parent satisfaction and reduced administrative burden"},
    "enterprise":    {"hours_saved": 40, "value_per_hour": 75,  "other": "Standardized operations and measurable staff efficiency gains"},
    "nonprofit":     {"hours_saved": 10, "value_per_hour": 30,  "other": "More time for mission-critical work and donor engagement"},
    "government":    {"hours_saved": 25, "value_per_hour": 55,  "other": "Improved constituent response rates and compliance documentation"},
    "other":         {"hours_saved": 15, "value_per_hour": 40,  "other": "Reduced manual workload and improved response capacity"},
}

PHASE2_SYSTEMS = {
    "church":        ["Member inquiry assistant (24/7 FAQ + prayer request routing)", "Event announcement broadcaster"],
    "small_business":["Customer service AI (FAQ, appointment booking, lead intake)", "Social media content assistant"],
    "school":        ["Parent communication assistant", "Enrollment inquiry handler"],
    "enterprise":    ["Internal knowledge base AI", "Document summarizer and meeting notes extractor"],
    "nonprofit":     ["Donor communication assistant", "Grant research and alert agent"],
    "government":    ["Constituent inquiry handler", "Document summarization and compliance assistant"],
    "other":         ["Communication assistant", "Workflow automation system"],
}


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
        val = input(f"\n{question}{hint}: ").strip()
    except (KeyboardInterrupt, EOFError):
        print("\n\nCancelled.")
        sys.exit(0)
    return val if val else default


def prompt_choice(question: str, choices: list[str]) -> str:
    print(f"\n{question}")
    for i, c in enumerate(choices):
        print(f"  {i+1}. {c}")
    while True:
        raw = prompt("Enter number", "1")
        try:
            idx = int(raw) - 1
            if 0 <= idx < len(choices):
                return choices[idx]
        except ValueError:
            pass
        print(f"  Please enter 1–{len(choices)}.")


def slugify(text: str) -> str:
    import re
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:40]


# ---------------------------------------------------------------------------
# Data collection
# ---------------------------------------------------------------------------

def collect_from_audit(slug: str) -> dict:
    path = REPORT_DIR / f"{slug}-audit.json"
    if not path.exists():
        print(f"\nAudit file not found: {path}")
        print("Run the audit first: thinkbox-audit scripts/audit.py")
        sys.exit(1)
    return json.loads(path.read_text(encoding="utf-8"))


def collect_interactive() -> dict:
    print(heading("Organization Details"))
    name     = prompt("Organization name")
    org_type = prompt_choice("Organization type", ["church", "small_business", "school", "enterprise", "nonprofit", "government", "other"])
    location = prompt("City, State")
    contact  = prompt("Primary decision-maker name and title (e.g. 'Pastor James Williams, Senior Pastor')")
    pain     = []
    print("\n  List up to 3 key pain points (press Enter to skip):")
    for i in range(3):
        p = prompt(f"  Pain point {i+1}", "")
        if p:
            pain.append(p)
    return {
        "profile":     {"name": name, "org_type": org_type},
        "location":    location,
        "contact":     contact,
        "pain_points": pain,
        "total_score": None,
        "band":        None,
        "phase2_rec":  PHASE2_SYSTEMS.get(org_type, PHASE2_SYSTEMS["other"])[0],
        "slug":        slugify(name),
    }


def enrich_interactive(data: dict) -> dict:
    """Ask proposal-specific questions not in the audit."""
    print(heading("Proposal Details"))

    data["contact"] = data.get("contact") or prompt(
        "Primary decision-maker (name and title)",
        "Leadership Team",
    )
    data["location"] = data.get("location") or prompt("City, State", "")
    data["thinkbox_contact"] = prompt(
        "Your name and title (as ThinkBox representative)",
        "ThinkBox AI Operation Systems",
    )
    data["recommended_tier"] = prompt_choice(
        "Recommended pricing tier for this client",
        ["starter", "standard", "enterprise"],
    )
    data["custom_note"] = prompt(
        "Any custom note to include in the Executive Summary? (optional)",
        "",
    )
    return data


# ---------------------------------------------------------------------------
# Proposal document generation
# ---------------------------------------------------------------------------

def build_proposal(data: dict) -> str:
    profile      = data.get("profile", {})
    org_name     = profile.get("name", data.get("name", "Your Organization"))
    org_type     = profile.get("org_type", "other")
    location     = data.get("location", "")
    contact      = data.get("contact", "Leadership Team")
    tb_contact   = data.get("thinkbox_contact", "ThinkBox AI Operation Systems")
    tier_key     = data.get("recommended_tier", "standard")
    tier         = PRICING[tier_key]
    pain_points  = data.get("pain_points", [])
    score        = data.get("total_score")
    band         = data.get("band")
    phase2_rec   = data.get("phase2_rec", "")
    custom_note  = data.get("custom_note", "")
    date_str     = datetime.now(timezone.utc).strftime("%B %d, %Y")

    roi          = ROI_ESTIMATES.get(org_type, ROI_ESTIMATES["other"])
    monthly_value = roi["hours_saved"] * roi["value_per_hour"] * 4
    annual_value  = monthly_value * 12

    pain_block = "\n".join(f"- {p}" for p in pain_points) if pain_points else "- Identified during initial consultation"

    systems = PHASE2_SYSTEMS.get(org_type, PHASE2_SYSTEMS["other"])
    systems_block = "\n".join(f"  - {s}" for s in systems)

    score_block = ""
    if score is not None:
        filled  = round(score / 50 * 20)
        bar     = "█" * filled + "░" * (20 - filled)
        score_block = f"""
### AI Readiness Assessment Results

```
Score: {score}/50   [{bar}]   {band}
```

This score places {org_name} in the **{band}** band — meaning the organization
has the foundational elements needed to begin AI implementation with guided support.
"""

    doc = f"""# AI Implementation Proposal
## Prepared for {org_name}

---

**Prepared by:** {tb_contact}
**Prepared for:** {contact}, {org_name}
**Location:** {location}
**Date:** {date_str}
**Proposal Reference:** MJUEM-{data.get('slug', slugify(org_name)).upper()[:12]}-{datetime.now(timezone.utc).strftime('%Y%m')}

---

## Executive Summary

ThinkBox AI Operation Systems specializes in bridging the gap between AI capability
and real-world organizational use. We don't teach AI theory — we install AI operations
into your organization using the **MJUEM AI Operations System™**: a structured,
4-phase methodology trusted by churches, businesses, schools, and institutions.

This proposal outlines a tailored AI implementation plan for **{org_name}** designed
to reduce administrative burden, improve member and customer response times, and free
your team to focus on the work that matters most.
{f"{chr(10)}{custom_note}" if custom_note else ""}

---

## Current State Assessment

### Challenges Identified

{pain_block}
{score_block}
These challenges represent significant hours of recoverable staff time every week —
time that could be redirected toward mission-critical activities.

---

## Proposed Solution: The MJUEM Framework

We will implement AI in four structured phases — never skipping steps, never
overpromising, and always leaving your team in control.

### Phase 1 — AUDIT *(Included in all tiers)*
Map your current operations, identify the highest-ROI automation opportunities,
and score your AI readiness. You receive a formal AI Readiness Report.

### Phase 2 — BUILD *(Core Deliverable)*
Deploy the AI systems your organization actually needs:

{systems_block}

Every system is built to ThinkBox security standards:
- Data stays within your controlled infrastructure
- Human escalation is always available
- AI always identifies itself as AI
- All interactions are logged for your review

### Phase 3 — AUTOMATE *(Standard & Enterprise)*
Connect AI to your daily workflows — auto-replies, scheduled broadcasts,
intake pipelines, and reporting — so the systems run without manual effort.

### Phase 4 — SCALE *(Enterprise)*
Replicate proven systems across departments or locations, deepen metrics
collection, and produce case studies that demonstrate measurable ROI.

---

## Investment Options

| | Starter | Standard | Enterprise |
|---|---------|----------|------------|
| **Scope** | {PRICING['starter']['scope']} | {PRICING['standard']['scope']} | {PRICING['enterprise']['scope']} |
| **Investment** | {PRICING['starter']['range']} | {PRICING['standard']['range']} | {PRICING['enterprise']['range']} |
| **Timeline** | {PRICING['starter']['timeline']} | {PRICING['standard']['timeline']} | {PRICING['enterprise']['timeline']} |
| **Support** | {PRICING['starter']['support']} | {PRICING['standard']['support']} | {PRICING['enterprise']['support']} |

**Recommended for {org_name}: {tier['label']} Package** ({tier['range']})

---

## Projected Return on Investment

Based on organizations similar to {org_name}, we project:

| Metric | Estimate |
|--------|----------|
| Staff hours recovered per week | ~{roi['hours_saved']} hours |
| Estimated value per recovered hour | ${roi['value_per_hour']}/hr |
| Projected monthly value generated | ~${monthly_value:,} |
| Projected annual value generated | ~${annual_value:,} |
| Additional impact | {roi['other']} |

*Projections are conservative estimates based on ThinkBox engagement data.
Actual results vary by organization and implementation depth.*

---

## Implementation Timeline ({tier['timeline']})

```
Week 1–2   Phase 1: Audit + AI Readiness Report delivered
Week 3–4   Phase 2: AI system design and build
Week 5–6   Phase 2: Testing, staff training, go-live
Week 7–8   Phase 3: Automation layer connected       [Standard+]
Week 9–12  Phase 3: Optimization + 30-day review     [Standard+]
Week 12+   Phase 4: Scale planning + case study      [Enterprise]
```

---

## Why ThinkBox AI Operation Systems

**We install AI — we don't just teach it.**

| What Others Do | What ThinkBox Does |
|---|---|
| Teach AI workshops | Deploy working AI systems |
| Generic AI tools | Org-specific configuration |
| One-time training | Ongoing operational support |
| No accountability | Tracked metrics and case studies |
| Tech-first approach | Community + culture-first approach |

We specialize in **faith-based organizations, community institutions, and businesses**
that have been underserved by mainstream AI consultancies. We understand your values,
your people, and what success looks like for you — not just for a dashboard.

---

## Next Steps

To move forward, we recommend:

1. **Schedule a 30-minute strategy call** to review this proposal and answer questions
2. **Select your tier** — we can begin within 1–2 weeks of agreement
3. **Sign the statement of work** — a straightforward 1-page agreement
4. **Kick off Phase 1** — your AI Readiness Report will be ready within 2 weeks

**To schedule your call or ask questions, contact:**

> {tb_contact}
> ThinkBox AI Operation Systems
> *(Add your contact info here before sending)*

---

*This proposal is valid for 30 days from the date above.*
*Prepared using the MJUEM AI Operations System™ by ThinkBox AI Operation Systems.*
"""
    return doc


# ---------------------------------------------------------------------------
# Persistence
# ---------------------------------------------------------------------------

def save_proposal(slug: str, doc: str, data: dict) -> tuple[Path, Path]:
    PROPOSAL_DIR.mkdir(parents=True, exist_ok=True)
    md_path   = PROPOSAL_DIR / f"{slug}-proposal.md"
    json_path = PROPOSAL_DIR / f"{slug}-proposal.json"
    md_path.write_text(doc, encoding="utf-8")
    json_path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    return md_path, json_path


# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------

def cmd_generate(from_audit: str | None, regenerate: str | None) -> None:
    if regenerate:
        json_path = PROPOSAL_DIR / f"{regenerate}-proposal.json"
        if not json_path.exists():
            print(f"\nNo saved proposal data for '{regenerate}'.")
            sys.exit(1)
        data = json.loads(json_path.read_text(encoding="utf-8"))
        print(f"\nRebuilding proposal for: {data['profile']['name']}")
    elif from_audit:
        audit_data = collect_from_audit(from_audit)
        data = {
            "slug":          audit_data["slug"],
            "profile":       audit_data["profile"],
            "location":      audit_data.get("location", ""),
            "pain_points":   audit_data.get("pain_points", []),
            "total_score":   audit_data.get("total_score"),
            "band":          audit_data.get("band"),
            "phase2_rec":    audit_data.get("phase2_rec", ""),
            "contact":       "",
            "thinkbox_contact": "",
            "recommended_tier": "standard",
            "custom_note":   "",
        }
        data = enrich_interactive(data)
    else:
        data = collect_interactive()
        data = enrich_interactive(data)

    slug = data["slug"]
    doc  = build_proposal(data)
    md_path, json_path = save_proposal(slug, doc, data)

    print("\n" + "=" * 60)
    print("  PROPOSAL READY")
    print("=" * 60)
    print(f"\n  Client:    {data['profile']['name']}")
    print(f"  Tier:      {PRICING[data['recommended_tier']]['label']} ({PRICING[data['recommended_tier']]['range']})")
    print(f"\n  Proposal (send this to the client):")
    print(f"    {md_path}")
    print(f"\n  To convert to PDF:")
    print(f"    pandoc {md_path} -o ~/.thinkbox/proposals/{slug}-proposal.pdf")
    print(f"\n  Or open in any Markdown viewer and print to PDF.")
    print("\n" + "=" * 60 + "\n")


def cmd_list() -> None:
    if not PROPOSAL_DIR.exists():
        print("\nNo proposals generated yet. Run: proposal.py")
        return
    files = sorted(PROPOSAL_DIR.glob("*-proposal.json"))
    if not files:
        print("\nNo proposals generated yet.")
        return
    print(f"\n  {'Slug':<35} {'Name':<30} {'Tier':<12} {'Date'}")
    print(f"  {divider('-', 80)}")
    for f in files:
        try:
            d = json.loads(f.read_text(encoding="utf-8"))
            slug = d.get("slug", "")[:33]
            name = d.get("profile", {}).get("name", "—")[:28]
            tier = PRICING.get(d.get("recommended_tier", ""), {}).get("label", "—")[:10]
            # Get file modification date
            mtime = datetime.fromtimestamp(f.stat().st_mtime).strftime("%Y-%m-%d")
            print(f"  {slug:<35} {name:<30} {tier:<12} {mtime}")
        except (json.JSONDecodeError, KeyError):
            pass
    print()


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description="ThinkBox Enterprise Proposal Generator")
    parser.add_argument("--from-audit",  metavar="SLUG", help="Auto-fill from audit JSON")
    parser.add_argument("--regenerate",  metavar="SLUG", help="Rebuild from saved proposal data")
    parser.add_argument("--list",        action="store_true", help="List all generated proposals")
    args = parser.parse_args()

    if args.list:
        cmd_list()
    else:
        cmd_generate(from_audit=args.from_audit, regenerate=args.regenerate)


if __name__ == "__main__":
    main()
