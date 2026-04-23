#!/usr/bin/env python3
"""
ThinkBox Case Study Tracker
MJUEM AI Operations System™ by ThinkBox AI Operation Systems

Tracks before/after metrics for client engagements at 30/60/90-day
milestones and generates shareable case study documents.

Commands:
    tracker.py dashboard                          # All engagements overview
    tracker.py list                               # Print slugs only
    tracker.py new [--from-audit <slug>]          # Start tracking a client
    tracker.py update <slug> --day <30|60|90>     # Record metric snapshot
    tracker.py report <slug>                      # Generate case study .md
"""

import argparse
import json
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path


# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

REPORT_DIR     = Path.home() / ".thinkbox" / "reports"
ENGAGEMENT_DIR = Path.home() / ".thinkbox" / "engagements"
VALID_DAYS     = {30, 60, 90}


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


def prompt_float(question: str, default: float = 0.0) -> float:
    while True:
        raw = prompt(question, str(default))
        try:
            return float(raw)
        except ValueError:
            print("  Please enter a number (e.g. 12 or 4.5).")


def prompt_int(question: str, low: int = 1, high: int = 10, default: int = 5) -> int:
    while True:
        raw = prompt(f"{question} ({low}–{high})", str(default))
        try:
            val = int(raw)
            if low <= val <= high:
                return val
        except ValueError:
            pass
        print(f"  Enter a whole number between {low} and {high}.")


def load_engagement(slug: str) -> dict:
    path = ENGAGEMENT_DIR / f"{slug}-engagement.json"
    if not path.exists():
        print(f"\nNo engagement found for '{slug}'.")
        print(f"Run: tracker.py new --from-audit {slug}")
        sys.exit(1)
    return json.loads(path.read_text(encoding="utf-8"))


def save_engagement(slug: str, data: dict) -> Path:
    ENGAGEMENT_DIR.mkdir(parents=True, exist_ok=True)
    path = ENGAGEMENT_DIR / f"{slug}-engagement.json"
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    return path


def list_engagements() -> list[dict]:
    if not ENGAGEMENT_DIR.exists():
        return []
    results = []
    for f in sorted(ENGAGEMENT_DIR.glob("*-engagement.json")):
        try:
            results.append(json.loads(f.read_text(encoding="utf-8")))
        except (json.JSONDecodeError, OSError):
            pass
    return results


def days_since(iso_date: str) -> int:
    start = datetime.fromisoformat(iso_date)
    return (datetime.now(timezone.utc) - start).days


def pct_change(before: float, after: float) -> str:
    if before == 0:
        return "N/A"
    change = ((after - before) / before) * 100
    sign = "+" if change >= 0 else ""
    return f"{sign}{change:.0f}%"


def delta_label(before: float, after: float, lower_is_better: bool = False) -> str:
    diff = after - before
    if diff == 0:
        return "no change"
    if lower_is_better:
        arrow = "↓" if diff < 0 else "↑"
    else:
        arrow = "↑" if diff > 0 else "↓"
    return f"{arrow} {abs(diff):.1f} ({pct_change(before, after)})"


# ---------------------------------------------------------------------------
# Command: new
# ---------------------------------------------------------------------------

def cmd_new(from_audit: str | None) -> None:
    print(heading("New Client Engagement"))

    audit_data: dict = {}
    if from_audit:
        audit_path = REPORT_DIR / f"{from_audit}-audit.json"
        if not audit_path.exists():
            print(f"\nAudit file not found: {audit_path}")
            print("Run the audit first: thinkbox-audit scripts/audit.py")
            sys.exit(1)
        audit_data = json.loads(audit_path.read_text(encoding="utf-8"))
        profile = audit_data["profile"]
        slug    = audit_data["slug"]
        print(f"\n  Loaded audit: {profile['name']} ({slug})")
    else:
        name   = prompt("Organization name")
        slug   = name.lower().replace(" ", "-")[:40]
        org_type = prompt("Organization type (church/small_business/school/enterprise/other)", "other")
        profile  = {"name": name, "org_type": org_type, "size": "", "channels": "", "tech": "", "budget": ""}

    # Check for existing engagement
    existing_path = ENGAGEMENT_DIR / f"{slug}-engagement.json"
    if existing_path.exists():
        overwrite = prompt(f"Engagement '{slug}' already exists. Overwrite? (yes/no)", "no")
        if overwrite.lower() not in ("yes", "y"):
            print("Aborted.")
            sys.exit(0)

    print(heading("Baseline Metrics (BEFORE AI deployment)"))
    print("  Record what things looked like BEFORE you built anything.\n")

    baseline = collect_metrics(label="Baseline")
    location = prompt("Client location (City, State)", "")
    systems  = prompt("AI systems deployed or planned (e.g. 'Member inquiry assistant')", "")
    challenge = prompt("Describe the core challenge in 1–2 sentences", "")

    now = datetime.now(timezone.utc).isoformat()

    engagement = {
        "schema_version": "1.0",
        "slug":           slug,
        "created_at":     now,
        "profile":        audit_data.get("profile", profile),
        "location":       location,
        "systems":        systems,
        "challenge":      challenge,
        "audit_score":    audit_data.get("total_score"),
        "audit_band":     audit_data.get("band"),
        "pain_points":    audit_data.get("pain_points", []),
        "baseline":       baseline,
        "snapshots":      {},
        "quote":          "",
        "quote_by":       "",
        "lessons":        "",
    }

    path = save_engagement(slug, engagement)
    print(f"\n{divider()}")
    print(f"  Engagement created: {slug}")
    print(f"  File: {path}")
    print(f"\n  Next: record metrics at the 30-day mark:")
    print(f"    tracker.py update {slug} --day 30")
    print(divider())


# ---------------------------------------------------------------------------
# Command: update
# ---------------------------------------------------------------------------

def cmd_update(slug: str, day: int) -> None:
    if day not in VALID_DAYS:
        print(f"--day must be one of: {sorted(VALID_DAYS)}")
        sys.exit(1)

    engagement = load_engagement(slug)
    name       = engagement["profile"]["name"]

    print(heading(f"{day}-Day Check-in — {name}"))

    if str(day) in engagement["snapshots"]:
        redo = prompt(f"Day-{day} snapshot already exists. Update it? (yes/no)", "no")
        if redo.lower() not in ("yes", "y"):
            print("Aborted.")
            sys.exit(0)

    snapshot = collect_metrics(label=f"Day {day}")

    if day == 90:
        print(heading("Client Quote (for case study)"))
        quote    = prompt("Direct quote from leadership (paste exact words)", "")
        quote_by = prompt("Attribution (Name, Title, Organization)", "")
        lessons  = prompt("Lessons learned (1–2 sentences for ThinkBox internal notes)", "")
        engagement["quote"]    = quote
        engagement["quote_by"] = quote_by
        engagement["lessons"]  = lessons

    engagement["snapshots"][str(day)] = snapshot
    save_engagement(slug, engagement)

    # Print delta vs baseline
    baseline = engagement["baseline"]
    print(heading(f"Results vs Baseline"))
    print(f"  {'Metric':<35} {'Before':>10}  {'After':>10}  {'Change':>15}")
    print(f"  {divider('-', 70)}")
    _print_deltas(baseline, snapshot)

    print(f"\n  Saved. Next: tracker.py update {slug} --day {_next_day(day)}" if day < 90 else
          f"\n  Final snapshot saved. Run: tracker.py report {slug}")


# ---------------------------------------------------------------------------
# Command: report
# ---------------------------------------------------------------------------

def cmd_report(slug: str) -> None:
    engagement = load_engagement(slug)
    name       = engagement["profile"]["name"]
    org_type   = engagement["profile"].get("org_type", "organization").replace("_", " ").title()
    baseline   = engagement["baseline"]
    snapshots  = engagement["snapshots"]

    # Use most recent snapshot for the report
    latest_day = max((int(k) for k in snapshots), default=None)
    if latest_day is None:
        print(f"\nNo metric snapshots yet. Run: tracker.py update {slug} --day 30")
        sys.exit(1)

    after = snapshots[str(latest_day)]

    # Build metric table rows
    metrics_md = _build_metrics_table(baseline, after)
    custom_md  = _build_custom_metrics_table(baseline, after)

    start_dt   = datetime.fromisoformat(engagement["created_at"])
    report_date = datetime.now(timezone.utc).strftime("%B %d, %Y")
    start_date  = start_dt.strftime("%B %Y")

    pain_list = "\n".join(f"- {p}" for p in engagement.get("pain_points", []))
    systems_list = "\n".join(
        f"- {s.strip()}" for s in engagement.get("systems", "").split(",") if s.strip()
    ) or "- AI system deployed per Phase 2 plan"

    quote_block = ""
    if engagement.get("quote"):
        quote_block = f'\n> "{engagement["quote"]}"\n>\n> — {engagement.get("quote_by", "Client Leadership")}\n'

    lessons_block = engagement.get("lessons") or "_No lessons recorded yet._"

    md = f"""# {name} — AI Implementation Case Study
**ThinkBox AI Operation Systems**

---

**Industry:** {org_type}
**Location:** {engagement.get("location", "—")}
**Implementation Date:** {start_date}
**Report Date:** {report_date}
**Snapshot:** Day-{latest_day} results

---

## The Challenge

{engagement.get("challenge") or "_Description not recorded. Add via: tracker.py update --day 90_"}

**Pain points identified during audit:**
{pain_list or "- See audit report for detail"}

---

## What We Built

{systems_list}

---

## Results

{metrics_md}
{custom_md}

---

## What Leadership Said
{quote_block or "_Quote not yet collected. Gather at 90-day check-in._"}

---

## Lessons Learned

{lessons_block}

---

*Case study produced by ThinkBox AI Operation Systems using the MJUEM AI Operations System™*
*All metrics self-reported by the client organization.*
"""

    ENGAGEMENT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = ENGAGEMENT_DIR / f"{slug}-case-study.md"
    out_path.write_text(md, encoding="utf-8")

    print(f"\n{divider()}")
    print(f"  Case study generated: {name}")
    print(f"  File: {out_path}")
    print(divider())


# ---------------------------------------------------------------------------
# Command: dashboard
# ---------------------------------------------------------------------------

def cmd_dashboard() -> None:
    engagements = list_engagements()

    print("\n" + "=" * 70)
    print("  ThinkBox Engagement Dashboard")
    print("  MJUEM AI Operations System™")
    print("=" * 70)

    if not engagements:
        print("\n  No engagements yet.")
        print("  Start one: tracker.py new --from-audit <slug>")
        print()
        return

    print(f"\n  {'Organization':<28} {'Type':<14} {'Score':<8} {'Days':<6} {'Snapshots':<12} {'Next'}")
    print(f"  {divider('-', 66)}")

    for e in engagements:
        name     = e["profile"]["name"][:26]
        org_type = e["profile"].get("org_type", "—")[:12].replace("_", " ")
        score    = str(e.get("audit_score", "—"))
        days     = str(days_since(e["created_at"]))
        snaps    = ", ".join(f"{k}d" for k in sorted(e.get("snapshots", {}).keys(), key=int)) or "none"
        next_act = _next_action(e)
        print(f"  {name:<28} {org_type:<14} {score:<8} {days:<6} {snaps:<12} {next_act}")

    print()
    total = len(engagements)
    complete = sum(1 for e in engagements if "90" in e.get("snapshots", {}))
    print(f"  Total: {total}  |  Complete (90-day): {complete}  |  Active: {total - complete}")
    print()


# ---------------------------------------------------------------------------
# Command: list
# ---------------------------------------------------------------------------

def cmd_list() -> None:
    for e in list_engagements():
        print(e["slug"])


# ---------------------------------------------------------------------------
# Metric collection
# ---------------------------------------------------------------------------

def collect_metrics(label: str) -> dict:
    print(f"\n  {label} Metrics")
    print(f"  Press Enter to skip any metric you don't have data for yet.\n")

    admin_hours    = prompt_float("Weekly admin hours (number of hours)", 0.0)
    response_mins  = prompt_float("Average inquiry response time in MINUTES (e.g. 2880 = 2 days)", 0.0)
    satisfaction   = prompt_int( "Member/customer satisfaction score (1–10)", 1, 10, 5)
    staff_morale   = prompt_int( "Staff ease of work score (1–10)", 1, 10, 5)

    custom: list[dict] = []
    print("\n  Custom metrics (optional — press Enter on name to skip)")
    for i in range(3):
        c_name = prompt(f"  Custom metric {i+1} label (e.g. 'Sunday attendance')", "")
        if not c_name:
            break
        c_val = prompt_float(f"  {c_name} value", 0.0)
        custom.append({"label": c_name, "value": c_val})

    return {
        "recorded_at":   datetime.now(timezone.utc).isoformat(),
        "admin_hours":   admin_hours,
        "response_mins": response_mins,
        "satisfaction":  satisfaction,
        "staff_morale":  staff_morale,
        "custom":        custom,
    }


# ---------------------------------------------------------------------------
# Report helpers
# ---------------------------------------------------------------------------

def _build_metrics_table(before: dict, after: dict) -> str:
    def fmt_mins(m: float) -> str:
        if m >= 1440:
            return f"{m/1440:.1f} days"
        if m >= 60:
            return f"{m/60:.1f} hrs"
        return f"{m:.0f} min"

    rows = [
        ("Weekly admin hours",         f"{before['admin_hours']:.1f} hrs",   f"{after['admin_hours']:.1f} hrs",   delta_label(before["admin_hours"],   after["admin_hours"],   lower_is_better=True)),
        ("Avg inquiry response time",  fmt_mins(before["response_mins"]),     fmt_mins(after["response_mins"]),     delta_label(before["response_mins"], after["response_mins"], lower_is_better=True)),
        ("Satisfaction score",         f"{before['satisfaction']}/10",        f"{after['satisfaction']}/10",        delta_label(before["satisfaction"],  after["satisfaction"])),
        ("Staff ease of work",         f"{before['staff_morale']}/10",        f"{after['staff_morale']}/10",        delta_label(before["staff_morale"],  after["staff_morale"])),
    ]

    header = "| Metric | Before | After | Change |\n|--------|--------|-------|--------|"
    body   = "\n".join(f"| {m} | {b} | {a} | {c} |" for m, b, a, c in rows)
    return header + "\n" + body


def _build_custom_metrics_table(before: dict, after: dict) -> str:
    b_custom = {c["label"]: c["value"] for c in before.get("custom", [])}
    a_custom = {c["label"]: c["value"] for c in after.get("custom",  [])}
    shared   = set(b_custom) & set(a_custom)
    if not shared:
        return ""

    rows = "\n".join(
        f"| {lbl} | {b_custom[lbl]:.1f} | {a_custom[lbl]:.1f} | {delta_label(b_custom[lbl], a_custom[lbl])} |"
        for lbl in sorted(shared)
    )
    return "\n**Custom Metrics:**\n| Metric | Before | After | Change |\n|--------|--------|-------|--------|\n" + rows


def _print_deltas(before: dict, after: dict) -> None:
    pairs = [
        ("Admin hours/week",   f"{before['admin_hours']:.1f} hrs", f"{after['admin_hours']:.1f} hrs",  delta_label(before["admin_hours"],   after["admin_hours"],   lower_is_better=True)),
        ("Response time (min)",f"{before['response_mins']:.0f}",   f"{after['response_mins']:.0f}",    delta_label(before["response_mins"], after["response_mins"], lower_is_better=True)),
        ("Satisfaction /10",   str(before["satisfaction"]),          str(after["satisfaction"]),          delta_label(before["satisfaction"],  after["satisfaction"])),
        ("Staff morale /10",   str(before["staff_morale"]),          str(after["staff_morale"]),          delta_label(before["staff_morale"],  after["staff_morale"])),
    ]
    for metric, b, a, ch in pairs:
        print(f"  {metric:<35} {b:>10}  {a:>10}  {ch:>15}")


def _next_action(e: dict) -> str:
    snaps   = set(int(k) for k in e.get("snapshots", {}).keys())
    elapsed = days_since(e["created_at"])
    if 90 in snaps:
        cs = ENGAGEMENT_DIR / f"{e['slug']}-case-study.md"
        return "report ready" if cs.exists() else "run: report"
    if 60 in snaps and elapsed >= 85:
        return "due: day-90"
    if 30 in snaps and elapsed >= 55:
        return "due: day-60"
    if elapsed >= 25:
        return "due: day-30"
    return f"day {elapsed}/30"


def _next_day(day: int) -> int:
    mapping = {30: 60, 60: 90}
    return mapping.get(day, 90)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="ThinkBox Case Study Tracker",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("dashboard", help="Show all engagement statuses")
    sub.add_parser("list",      help="Print engagement slugs")

    p_new = sub.add_parser("new", help="Start tracking a new client")
    p_new.add_argument("--from-audit", metavar="SLUG", help="Load baseline from audit JSON")

    p_update = sub.add_parser("update", help="Record a metric snapshot")
    p_update.add_argument("slug",  help="Engagement slug")
    p_update.add_argument("--day", type=int, required=True, choices=sorted(VALID_DAYS), metavar="DAY")

    p_report = sub.add_parser("report", help="Generate case study document")
    p_report.add_argument("slug", help="Engagement slug")

    args = parser.parse_args()

    if args.command == "dashboard":
        cmd_dashboard()
    elif args.command == "list":
        cmd_list()
    elif args.command == "new":
        cmd_new(from_audit=args.from_audit)
    elif args.command == "update":
        cmd_update(slug=args.slug, day=args.day)
    elif args.command == "report":
        cmd_report(slug=args.slug)


if __name__ == "__main__":
    main()
