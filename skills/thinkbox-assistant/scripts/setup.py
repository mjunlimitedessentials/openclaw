#!/usr/bin/env python3
"""
ThinkBox AI Assistant Setup
MJUEM AI Operations System™ by ThinkBox AI Operation Systems

Generates a configured AI assistant for a church, small business, or school.
Produces a system prompt (.md) and config file (.json) ready to deploy in OpenClaw.

Usage:
    setup.py                        # Interactive setup for a new client
    setup.py --update <slug>        # Update an existing assistant
    setup.py --list                 # List all configured assistants
    setup.py --preview <slug>       # Print the generated system prompt
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path


# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

SKILL_DIR      = Path(__file__).parent.parent
PROMPTS_DIR    = SKILL_DIR / "assets" / "prompts"
FAQS_DIR       = SKILL_DIR / "assets" / "faqs"
ASSISTANT_DIR  = Path.home() / ".thinkbox" / "assistants"

ORG_TYPES = ["church", "small_business", "school"]

ORG_TYPE_LABELS = {
    "church":        "Church / Faith Organization",
    "small_business":"Small Business",
    "school":        "School / Educational Institution",
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


def prompt_choice(question: str, choices: list[str], labels: dict | None = None) -> str:
    print(f"\n{question}")
    for i, c in enumerate(choices):
        label = labels.get(c, c) if labels else c
        print(f"  {i+1}. {label}")
    while True:
        raw = prompt("Enter number", "1")
        try:
            idx = int(raw) - 1
            if 0 <= idx < len(choices):
                return choices[idx]
        except ValueError:
            pass
        print(f"  Please enter a number between 1 and {len(choices)}.")


def slugify(text: str) -> str:
    import re
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:40]


def load_starter_faqs(org_type: str) -> list[dict]:
    path = FAQS_DIR / f"{org_type}-starter.json"
    if not path.exists():
        return []
    return json.loads(path.read_text(encoding="utf-8"))


def load_prompt_template(org_type: str) -> str:
    key = org_type.replace("small_business", "business")
    path = PROMPTS_DIR / f"{key}.md"
    if not path.exists():
        path = PROMPTS_DIR / "business.md"
    return path.read_text(encoding="utf-8")


# ---------------------------------------------------------------------------
# Collection
# ---------------------------------------------------------------------------

def collect_org_info(existing: dict | None = None) -> dict:
    ex = existing or {}
    print(heading("Organization Information"))

    org_type = prompt_choice(
        "What type of organization is this?",
        ORG_TYPES,
        labels=ORG_TYPE_LABELS,
    ) if not ex.get("org_type") else ex["org_type"]

    name     = prompt("Organization name",           ex.get("name", ""))
    address  = prompt("Address (or 'Online only')",  ex.get("address", ""))
    hours    = prompt("Operating hours",             ex.get("hours", "Mon–Fri 9 AM–5 PM"))
    phone    = prompt("Main phone number",           ex.get("phone", ""))
    email    = prompt("Main email address",          ex.get("email", ""))
    website  = prompt("Website URL",                 ex.get("website", ""))

    lead_label = {"church": "Lead Pastor / Senior Pastor", "school": "Principal", "small_business": "Owner / Manager"}.get(org_type, "Primary Contact")
    lead = prompt(lead_label, ex.get("lead", ""))

    assistant_name = prompt(
        "What should the AI assistant be named? (e.g. 'Grace Bot', 'Maya', 'Assistant')",
        ex.get("assistant_name", f"{name.split()[0]} Assistant"),
    )

    services = ""
    if org_type == "small_business":
        services = prompt("Brief description of services offered", ex.get("services", ""))

    return {
        "org_type":       org_type,
        "name":           name,
        "address":        address,
        "hours":          hours,
        "phone":          phone,
        "email":          email,
        "website":        website,
        "lead":           lead,
        "assistant_name": assistant_name,
        "services":       services,
    }


def collect_escalation_contacts(existing: list | None = None) -> list[dict]:
    print(heading("Escalation Contacts"))
    print("  Who should the AI route people to for specific needs?")
    print("  Press Enter on 'Role' to stop adding contacts.\n")

    contacts = list(existing or [])
    idx = len(contacts)

    while True:
        if idx > 0:
            print(f"\n  Current contacts: {len(contacts)}")
            add_more = prompt("Add another contact? (yes/no)", "no")
            if add_more.lower() not in ("yes", "y"):
                break

        role  = prompt(f"Contact {idx+1} role (e.g. 'Pastoral Care', 'Office Manager', 'Sales')", "")
        if not role:
            break
        name  = prompt(f"  Name", "")
        phone = prompt(f"  Phone", "")
        email = prompt(f"  Email", "")
        contacts.append({"role": role, "name": name, "phone": phone, "email": email})
        idx += 1

    return contacts


def collect_faqs(org_type: str, existing: list | None = None) -> list[dict]:
    print(heading("Frequently Asked Questions"))

    starter = load_starter_faqs(org_type)

    if existing:
        faqs = list(existing)
        print(f"\n  Existing FAQs: {len(faqs)}")
    else:
        use_starter = prompt(
            f"Load the {len(starter)} starter FAQs for {ORG_TYPE_LABELS.get(org_type, org_type)}? (yes/no)",
            "yes",
        )
        faqs = list(starter) if use_starter.lower() in ("yes", "y") else []

    print(f"\n  You have {len(faqs)} FAQs loaded.")
    add_custom = prompt("Add custom FAQs now? (yes/no)", "yes")

    if add_custom.lower() in ("yes", "y"):
        print("\n  Enter your custom Q&A pairs. Press Enter on Question to stop.\n")
        while True:
            q = prompt("  Question", "")
            if not q:
                break
            a = prompt("  Answer", "")
            faqs.append({"q": q, "a": a})
            print(f"  ✓ Added. Total FAQs: {len(faqs)}")

    return faqs


# ---------------------------------------------------------------------------
# Generation
# ---------------------------------------------------------------------------

def build_escalation_block(contacts: list[dict]) -> str:
    if not contacts:
        return "- Contact the main office for any escalations"

    lines = []
    for c in contacts:
        parts = [f"**{c['role']}**"]
        if c.get("name"):
            parts.append(c["name"])
        if c.get("phone"):
            parts.append(c["phone"])
        if c.get("email"):
            parts.append(c["email"])
        lines.append("- " + " — ".join(parts))
    return "\n".join(lines)


def build_faq_block(faqs: list[dict]) -> str:
    if not faqs:
        return "_No FAQs configured yet._"
    blocks = []
    for i, faq in enumerate(faqs, 1):
        blocks.append(f"**Q{i}: {faq['q']}**\n{faq['a']}")
    return "\n\n".join(blocks)


def render_prompt(template: str, info: dict, contacts: list[dict], faqs: list[dict]) -> str:
    replacements = {
        "{{ASSISTANT_NAME}}":    info.get("assistant_name", "Assistant"),
        "{{ORG_NAME}}":          info.get("name", ""),
        "{{ORG_ADDRESS}}":       info.get("address", ""),
        "{{ORG_LOCATION}}":      info.get("address", "").split(",")[-1].strip() if info.get("address") else "",
        "{{OFFICE_HOURS}}":      info.get("hours", ""),
        "{{PHONE}}":             info.get("phone", ""),
        "{{EMAIL}}":             info.get("email", ""),
        "{{WEBSITE}}":           info.get("website", ""),
        "{{SERVICE_TIMES}}":     info.get("hours", ""),
        "{{LEAD_PASTOR}}":       info.get("lead", ""),
        "{{LEAD_CONTACT}}":      info.get("lead", ""),
        "{{SERVICES_SUMMARY}}":  info.get("services", ""),
        "{{ESCALATION_CONTACTS}}": build_escalation_block(contacts),
        "{{FAQ_BLOCK}}":         build_faq_block(faqs),
    }
    result = template
    for key, val in replacements.items():
        result = result.replace(key, val)
    return result


# ---------------------------------------------------------------------------
# Persistence
# ---------------------------------------------------------------------------

def save_assistant(slug: str, config: dict, prompt_text: str) -> tuple[Path, Path]:
    ASSISTANT_DIR.mkdir(parents=True, exist_ok=True)

    config_path = ASSISTANT_DIR / f"{slug}-config.json"
    prompt_path = ASSISTANT_DIR / f"{slug}-prompt.md"

    config_path.write_text(json.dumps(config, indent=2, ensure_ascii=False), encoding="utf-8")
    prompt_path.write_text(prompt_text, encoding="utf-8")

    return config_path, prompt_path


def load_assistant(slug: str) -> dict:
    path = ASSISTANT_DIR / f"{slug}-config.json"
    if not path.exists():
        print(f"\nNo assistant found for '{slug}'. Run setup.py to create one.")
        sys.exit(1)
    return json.loads(path.read_text(encoding="utf-8"))


# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------

def cmd_setup(existing_slug: str | None = None) -> None:
    existing_config: dict = {}
    if existing_slug:
        existing_config = load_assistant(existing_slug)
        print(heading(f"Updating: {existing_config['info']['name']}"))
    else:
        print("\n" + "=" * 60)
        print("  ThinkBox AI Assistant Setup")
        print("  MJUEM AI Operations System™ — Phase 2 Deployment")
        print("=" * 60)
        print("\nThis takes 10–15 minutes. All data is stored locally only.\n")

    info     = collect_org_info(existing_config.get("info"))
    contacts = collect_escalation_contacts(existing_config.get("contacts"))
    faqs     = collect_faqs(info["org_type"], existing_config.get("faqs"))

    slug     = slugify(info["name"])
    template = load_prompt_template(info["org_type"])
    prompt_text = render_prompt(template, info, contacts, faqs)

    config = {
        "schema_version": "1.0",
        "slug":           slug,
        "created_at":     existing_config.get("created_at", datetime.now(timezone.utc).isoformat()),
        "updated_at":     datetime.now(timezone.utc).isoformat(),
        "info":           info,
        "contacts":       contacts,
        "faqs":           faqs,
    }

    config_path, prompt_path = save_assistant(slug, config, prompt_text)

    print("\n" + "=" * 60)
    print("  ASSISTANT READY")
    print("=" * 60)
    print(f"\n  Name:        {info['assistant_name']}")
    print(f"  Organization: {info['name']}")
    print(f"  FAQs loaded:  {len(faqs)}")
    print(f"  Contacts:     {len(contacts)}")
    print(f"\n  System prompt (deploy this in OpenClaw):")
    print(f"    {prompt_path}")
    print(f"\n  Config file:")
    print(f"    {config_path}")
    print(f"\n  To preview the prompt:")
    print(f"    python3 setup.py --preview {slug}")
    print("\n" + "=" * 60 + "\n")


def cmd_list() -> None:
    if not ASSISTANT_DIR.exists():
        print("\nNo assistants configured yet. Run: setup.py")
        return

    configs = sorted(ASSISTANT_DIR.glob("*-config.json"))
    if not configs:
        print("\nNo assistants configured yet. Run: setup.py")
        return

    print(f"\n{'Slug':<35} {'Name':<30} {'Type':<16} {'FAQs'}")
    print(divider("-", 90))
    for f in configs:
        try:
            c = json.loads(f.read_text(encoding="utf-8"))
            slug     = c.get("slug", f.stem.replace("-config", ""))
            name     = c["info"].get("name", "—")[:28]
            org_type = c["info"].get("org_type", "—")[:14].replace("_", " ")
            faq_ct   = str(len(c.get("faqs", [])))
            print(f"  {slug:<33} {name:<30} {org_type:<16} {faq_ct}")
        except (json.JSONDecodeError, KeyError):
            pass
    print()


def cmd_preview(slug: str) -> None:
    prompt_path = ASSISTANT_DIR / f"{slug}-prompt.md"
    if not prompt_path.exists():
        print(f"\nNo prompt file found for '{slug}'. Run setup.py to generate one.")
        sys.exit(1)
    print(prompt_path.read_text(encoding="utf-8"))


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="ThinkBox AI Assistant Setup",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--update",  metavar="SLUG", help="Update an existing assistant")
    parser.add_argument("--list",    action="store_true", help="List all configured assistants")
    parser.add_argument("--preview", metavar="SLUG", help="Print the system prompt for a slug")
    args = parser.parse_args()

    if args.list:
        cmd_list()
    elif args.preview:
        cmd_preview(args.preview)
    elif args.update:
        cmd_setup(existing_slug=args.update)
    else:
        cmd_setup()


if __name__ == "__main__":
    main()
