---
name: thinkbox
description: "ThinkBox AI Operation Systems launcher — single entry point for all MJUEM tools (audit, proposal, assistant setup, case study tracker). Use when the user wants to run any ThinkBox operation without remembering individual script paths. Invoke with: python3 skills/thinkbox/scripts/thinkbox.py"
metadata:
  {
    "openclaw":
      {
        "emoji": "🏢",
        "requires": { "bins": ["python3"] },
      },
  }
---

# ThinkBox Launcher

Single command that opens the ThinkBox operations menu.

## Run It

```bash
python3 ~/openclaw/skills/thinkbox/scripts/thinkbox.py
```

## Set Up a Shortcut (Recommended)

Add this line to your shell profile (`~/.zshrc` or `~/.bashrc`):

```bash
alias thinkbox='python3 ~/openclaw/skills/thinkbox/scripts/thinkbox.py'
```

Then reload your profile:

```bash
source ~/.zshrc   # or source ~/.bashrc
```

Now just type:

```bash
thinkbox
```

## What the Menu Shows

On every launch, the dashboard shows at the top:
- Clients audited
- Proposals generated
- Assistants deployed
- Active engagements
- Any check-ins that are due

Then the menu:

```
1. Run new client audit
2. Generate client proposal
3. Set up client AI assistant
4. Record 30 / 60 / 90-day check-in
5. Start tracking a new client
6. Generate case study
7. View full engagement dashboard
   ──────────────────────────────────────
8. Preview a generated proposal
9. Preview a deployed assistant
10. Exit
```

## Notes

- All data stays in `~/.thinkbox/` on your local device
- Each menu item calls the corresponding ThinkBox skill script
- Client slugs are auto-detected — no memorizing names
