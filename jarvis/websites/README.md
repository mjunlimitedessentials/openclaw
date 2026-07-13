# JARVIS 2 — Website Prompt Packs

Ready-to-run, self-contained build prompts for generating cinematic "3D scroll"
websites with **Claude Code + the Higgsfield MCP** (Seedance video model). Adapted
from the *Fable 5 · Higgsfield Website Prompt Pack* format and tailored to this
business.

## Files
| File | Builds |
| ---- | ------ |
| `prompt-01-jarvis.md` | A landing page for **J.A.R.V.I.S. 2** (the assistant). No photo needed. |
| `prompt-02-thinkbox.md` | A founder **portfolio** for **ThinkBox AI Operation Systems** (business automation + AI assistants). Requires a front-facing photo of you. |

## How to run one
1. Open **Claude Code** (VS Code terminal or the app), signed into your Claude account.
2. Confirm the **Higgsfield MCP** is connected — type `/mcp`. Make sure your
   Higgsfield account has **credits**.
3. For the portfolio (`prompt-02`), first tell Claude *"I have a local photo to use"*
   → the Higgsfield upload widget opens → pick a well-lit, front-facing photo.
4. **Copy the whole prompt block** from the file and paste it into Claude Code.
5. Let it build on localhost, then **direct it** with feeling-based notes
   ("slow the hero orbit," "bigger headline," "swap the font").

## The rules baked into every prompt (why they work)
- **Hero/identity image first**, passed as a reference to every clip → keeps the
  subject (the AI core, or your face) identical across all shots.
- **Seedance std mode, 1080p, 16:9, ~8s, no audio** → the credit-smart default;
  only render higher for a final showpiece.
- **Chained clips** (each clip's last frame = next clip's first frame) → the shots
  scrub like one continuous camera move on scroll.

## Credit note
Generation draws on **your Higgsfield account's** credits and daily limits. If you
hit "daily generation limit," wait for the reset or top up, then run the block.
Publishing a live URL is an outward step — preview first, deploy when you're happy.
