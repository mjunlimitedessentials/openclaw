---
name: thinkbox-assistant
description: "ThinkBox AI Assistant — deploys a configurable AI assistant for a specific organization (church, small business, or school). Use when: (1) setting up a new client's AI assistant for the first time, (2) updating an existing assistant's FAQs or contacts, (3) generating a fresh system prompt for a client's OpenClaw agent, (4) previewing or testing an org's assistant configuration. NOT for: running audits (use thinkbox-audit), tracking metrics (use thinkbox-casestudy), or general AI tasks."
metadata:
  {
    "openclaw":
      {
        "emoji": "🤖",
        "requires": { "bins": ["python3"] },
      },
  }
---

# ThinkBox AI Assistant

**ThinkBox AI Operation Systems — Phase 2 Deployment Tool**

Generates a fully configured, deployable AI assistant for a client organization.
Takes 10–15 minutes to set up. Output is a system prompt and config file ready
to load into any OpenClaw agent session.

## When to Use

✅ **USE this skill when:**

- Client has completed the Phase 1 audit and is ready for Phase 2 (Build)
- Setting up the first AI assistant for a church, business, or school
- Updating an existing assistant's FAQs, hours, or escalation contacts
- Previewing how a client's assistant will respond before going live

❌ **DON'T use this skill when:**

- Client hasn't been audited yet → run `thinkbox-audit` first
- You need to track results → use `thinkbox-casestudy`
- General coding or productivity tasks → other skills

## Commands

### Set up a new assistant for a client

```bash
python3 {baseDir}/scripts/setup.py
```

### Update an existing assistant (FAQs, contacts, hours)

```bash
python3 {baseDir}/scripts/setup.py --update grace-community-church
```

### Preview the generated system prompt

```bash
cat ~/.thinkbox/assistants/grace-community-church-prompt.md
```

### List all configured assistants

```bash
python3 {baseDir}/scripts/setup.py --list
```

## What Gets Generated

After setup, two files are written to `~/.thinkbox/assistants/`:

| File | Purpose |
|------|---------|
| `<slug>-config.json` | Full assistant configuration (org info, FAQs, contacts) |
| `<slug>-prompt.md` | Ready-to-use system prompt — paste into any AI agent |

## Deploying the Assistant

Once the prompt file is generated, deploy it in OpenClaw by setting it as
the system prompt for the client's dedicated agent channel. The assistant will:

- Answer the organization's top FAQs instantly, 24/7
- Route specialized requests to the right staff member
- Always offer to escalate to a real person
- Represent the organization's name, voice, and values
- Never fabricate information it wasn't given

## Org Types Supported

| Type | Starter FAQs | Primary Use Case |
|------|-------------|-----------------|
| `church` | 15 common church inquiries | Member support, events, prayer requests |
| `small_business` | 15 common business inquiries | Customer service, bookings, lead intake |
| `school` | 15 common school inquiries | Parent support, enrollment, schedules |

## Security Standards (Non-Negotiable)

Every assistant generated follows these rules:

- **Never stores personal data** — no names, addresses, or payment info in the assistant
- **Always discloses AI** — introduces itself as an AI assistant
- **Human escalation always available** — never traps users in a bot loop
- **No hallucination** — if it doesn't know, it says so and escalates
- **Scoped knowledge** — only answers from its configured FAQ set + org info
