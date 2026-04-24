#!/usr/bin/env python3
"""
ThinkBox AI Operation Systems — Command Launcher
MJUEM AI Operations System™

Single entry point for all ThinkBox tools.
Run: python3 thinkbox.py

Or add to your shell profile:
    alias thinkbox='python3 ~/openclaw/skills/thinkbox/scripts/thinkbox.py'
Then just type: thinkbox
"""

import json
import os
import subprocess
import sys
from pathlib import Path


# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

SKILLS_DIR     = Path(__file__).parent.parent.parent  # openclaw/skills/
AUDIT_SCRIPT   = SKILLS_DIR / "thinkbox-audit"    / "scripts" / "audit.py"
PROPOSAL_SCRIPT= SKILLS_DIR / "thinkbox-proposal" / "scripts" / "proposal.py"
ASSISTANT_SCRIPT=SKILLS_DIR / "thinkbox-assistant"/ "scripts" / "setup.py"
TRACKER_SCRIPT = SKILLS_DIR / "thinkbox-casestudy"/ "scripts" / "tracker.py"

REPORT_DIR     = Path.home() / ".thinkbox" / "reports"
ENGAGEMENT_DIR = Path.home() / ".thinkbox" / "engagements"
PROPOSAL_DIR   = Path.home() / ".thinkbox" / "proposals"
ASSISTANT_DIR  = Path.home() / ".thinkbox" / "assistants"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def clear():
    os.system("clear" if os.name != "nt" else "cls")


def divider(char="─", width=58) -> str:
    return char * width


def banner():
    print()
    print("  ╔══════════════════════════════════════════════════════╗")
    print("  ║       ThinkBox AI Operation Systems                  ║")
    print("  ║       MJUEM AI Operations System™                    ║")
    print("  ╚══════════════════════════════════════════════════════╝")
    print()


def pause():
    try:
        input("\n  Press Enter to return to the menu...")
    except (KeyboardInterrupt, EOFError):
        pass


def prompt(question: str, default: str = "") -> str:
    hint = f" [{default}]" if default else ""
    try:
        val = input(f"\n  {question}{hint}: ").strip()
    except (KeyboardInterrupt, EOFError):
        return default
    return val if val else default


def run(script: Path, *args: str) -> None:
    """Run a ThinkBox script, streaming output live."""
    cmd = [sys.executable, str(script), *args]
    try:
        subprocess.run(cmd, check=False)
    except KeyboardInterrupt:
        print("\n\n  Cancelled.")


# ---------------------------------------------------------------------------
# Client list helpers
# ---------------------------------------------------------------------------

def list_audits() -> list[str]:
    if not REPORT_DIR.exists():
        return []
    return sorted(
        p.stem.replace("-audit", "")
        for p in REPORT_DIR.glob("*-audit.json")
    )


def list_engagements() -> list[tuple[str, str]]:
    """Returns list of (slug, name) tuples."""
    if not ENGAGEMENT_DIR.exists():
        return []
    results = []
    for f in sorted(ENGAGEMENT_DIR.glob("*-engagement.json")):
        try:
            d = json.loads(f.read_text(encoding="utf-8"))
            results.append((d["slug"], d["profile"]["name"]))
        except (json.JSONDecodeError, KeyError):
            pass
    return results


def list_assistants() -> list[str]:
    if not ASSISTANT_DIR.exists():
        return []
    return sorted(
        p.stem.replace("-config", "")
        for p in ASSISTANT_DIR.glob("*-config.json")
    )


def pick_client(source: str = "audit") -> str | None:
    """Show existing clients and let user pick one by number or type a slug."""
    if source == "audit":
        clients = [(s, s) for s in list_audits()]
        label   = "audited clients"
    elif source == "engagement":
        clients = list_engagements()
        label   = "tracked engagements"
    else:
        clients = [(s, s) for s in list_assistants()]
        label   = "configured assistants"

    if not clients:
        print(f"\n  No {label} found yet.")
        return None

    print(f"\n  {divider()}")
    print(f"  Select a client ({label}):")
    print(f"  {divider()}")
    for i, (slug, name) in enumerate(clients, 1):
        display = name if name != slug else slug
        print(f"    {i}. {display}")
    print(f"    {len(clients)+1}. Type a slug manually")
    print(f"  {divider()}")

    raw = prompt(f"Enter number (1–{len(clients)+1})", "1")
    try:
        idx = int(raw) - 1
        if 0 <= idx < len(clients):
            return clients[idx][0]
    except ValueError:
        pass

    # Manual entry
    return prompt("Enter client slug (e.g. grace-community-church)", "") or None


# ---------------------------------------------------------------------------
# Mini dashboard (shown on the main menu)
# ---------------------------------------------------------------------------

def mini_dashboard() -> None:
    audits      = list_audits()
    engagements = list_engagements()
    assistants  = list_assistants()

    proposals = 0
    if PROPOSAL_DIR.exists():
        proposals = len(list(PROPOSAL_DIR.glob("*-proposal.json")))

    complete = 0
    due_soon = []
    if ENGAGEMENT_DIR.exists():
        from datetime import datetime, timezone
        for f in ENGAGEMENT_DIR.glob("*-engagement.json"):
            try:
                d     = json.loads(f.read_text(encoding="utf-8"))
                snaps = set(int(k) for k in d.get("snapshots", {}).keys())
                start = datetime.fromisoformat(d["created_at"])
                days  = (datetime.now(timezone.utc) - start).days
                name  = d["profile"]["name"]
                if 90 in snaps:
                    complete += 1
                elif (30 in snaps and days >= 55) or (not snaps and days >= 25):
                    due_soon.append(name)
            except (json.JSONDecodeError, KeyError, ValueError):
                pass

    print(f"  {divider()}")
    print(f"  Dashboard")
    print(f"  {divider()}")
    print(f"    Clients audited:      {len(audits)}")
    print(f"    Proposals generated:  {proposals}")
    print(f"    Assistants deployed:  {len(assistants)}")
    print(f"    Active engagements:   {len(engagements)}")
    print(f"    Completed (90-day):   {complete}")
    if due_soon:
        print(f"\n  ⚠  Check-in due:")
        for name in due_soon[:3]:
            print(f"       • {name}")
    print(f"  {divider()}")
    print()


# ---------------------------------------------------------------------------
# Menu actions
# ---------------------------------------------------------------------------

def action_audit() -> None:
    clear()
    banner()
    print("  STEP 1 — Run New Client Audit")
    print(f"  {divider()}")
    print("  This walks through 3 sections (10–15 min).")
    print("  Output: AI Readiness Report + data file.\n")
    run(AUDIT_SCRIPT)
    pause()


def action_proposal() -> None:
    clear()
    banner()
    print("  STEP 2 — Generate Client Proposal")
    print(f"  {divider()}")

    audits = list_audits()
    if audits:
        slug = pick_client("audit")
        if slug:
            run(PROPOSAL_SCRIPT, "--from-audit", slug)
        else:
            run(PROPOSAL_SCRIPT)
    else:
        print("  No audits found — starting from scratch.\n")
        run(PROPOSAL_SCRIPT)
    pause()


def action_assistant() -> None:
    clear()
    banner()
    print("  STEP 3 — Set Up Client AI Assistant")
    print(f"  {divider()}")
    print("  Generates a deployable system prompt for the client.\n")
    run(ASSISTANT_SCRIPT)
    pause()


def action_checkin() -> None:
    clear()
    banner()
    print("  STEP 4 — Record Client Check-in (30 / 60 / 90 day)")
    print(f"  {divider()}")

    engagements = list_engagements()

    if not engagements:
        print("  No active engagements found.")
        print("  Start one first with option 5 (Start Tracking New Client).")
        pause()
        return

    slug = pick_client("engagement")
    if not slug:
        pause()
        return

    day_raw = prompt("Which milestone? (30 / 60 / 90)", "30")
    try:
        day = int(day_raw)
        if day not in (30, 60, 90):
            raise ValueError
    except ValueError:
        print("  Invalid day — must be 30, 60, or 90.")
        pause()
        return

    run(TRACKER_SCRIPT, "update", slug, "--day", str(day))
    pause()


def action_new_engagement() -> None:
    clear()
    banner()
    print("  STEP 4a — Start Tracking a New Client")
    print(f"  {divider()}")
    print("  Records the baseline (before AI is deployed).\n")

    audits = list_audits()
    if audits:
        use_audit = prompt("Load from existing audit? (yes/no)", "yes")
        if use_audit.lower() in ("yes", "y"):
            slug = pick_client("audit")
            if slug:
                run(TRACKER_SCRIPT, "new", "--from-audit", slug)
                pause()
                return

    run(TRACKER_SCRIPT, "new")
    pause()


def action_case_study() -> None:
    clear()
    banner()
    print("  STEP 5 — Generate Case Study")
    print(f"  {divider()}")

    slug = pick_client("engagement")
    if not slug:
        pause()
        return

    run(TRACKER_SCRIPT, "report", slug)
    pause()


def action_dashboard() -> None:
    clear()
    banner()
    run(TRACKER_SCRIPT, "dashboard")
    pause()


def action_preview_proposal() -> None:
    clear()
    banner()
    print("  View Proposal")
    print(f"  {divider()}")

    if not PROPOSAL_DIR.exists() or not list(PROPOSAL_DIR.glob("*-proposal.md")):
        print("  No proposals found yet. Generate one with option 2.")
        pause()
        return

    proposals = sorted(PROPOSAL_DIR.glob("*-proposal.md"))
    print("\n  Generated proposals:")
    for i, p in enumerate(proposals, 1):
        print(f"    {i}. {p.name}")

    raw = prompt(f"Enter number (1–{len(proposals)})", "1")
    try:
        idx = int(raw) - 1
        if 0 <= idx < len(proposals):
            print(f"\n{'='*60}")
            print(proposals[idx].read_text(encoding="utf-8"))
            print(f"{'='*60}")
    except (ValueError, IndexError):
        print("  Invalid selection.")
    pause()


def action_preview_assistant() -> None:
    clear()
    banner()
    print("  Preview Deployed Assistant")
    print(f"  {divider()}")

    slug = pick_client("assistant")
    if not slug:
        print("\n  No assistants configured yet. Use option 3 to set one up.")
        pause()
        return

    prompt_path = ASSISTANT_DIR / f"{slug}-prompt.md"
    if prompt_path.exists():
        print(f"\n{'='*60}")
        print(prompt_path.read_text(encoding="utf-8"))
        print(f"{'='*60}")
    else:
        print(f"  Prompt file not found for '{slug}'.")
    pause()


# ---------------------------------------------------------------------------
# Main menu
# ---------------------------------------------------------------------------

MENU = [
    ("Run new client audit",                   action_audit),
    ("Generate client proposal",               action_proposal),
    ("Set up client AI assistant",             action_assistant),
    ("Record 30 / 60 / 90-day check-in",      action_checkin),
    ("Start tracking a new client",            action_new_engagement),
    ("Generate case study",                    action_case_study),
    ("View full engagement dashboard",         action_dashboard),
    ("─" * 38,                                 None),
    ("Preview a generated proposal",           action_preview_proposal),
    ("Preview a deployed assistant",           action_preview_assistant),
]


def main() -> None:
    while True:
        clear()
        banner()
        mini_dashboard()

        print("  What would you like to do?")
        print(f"  {divider()}")

        option_num = 1
        option_map: dict[int, callable] = {}

        for label, action in MENU:
            if action is None:
                print(f"  {label}")
            else:
                print(f"    {option_num}. {label}")
                option_map[option_num] = action
                option_num += 1

        print(f"    {option_num}. Exit")
        print(f"  {divider()}")

        raw = prompt(f"Enter number (1–{option_num})", "")
        if not raw:
            continue

        try:
            choice = int(raw)
        except ValueError:
            continue

        if choice == option_num:
            clear()
            print("\n  Goodbye. Keep building.\n")
            sys.exit(0)

        action_fn = option_map.get(choice)
        if action_fn:
            action_fn()


if __name__ == "__main__":
    main()
