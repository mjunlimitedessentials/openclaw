# J.A.R.V.I.S. 2 — operator cheatsheet

What to say, and what JARVIS does. Talk to it like a chief-of-staff — plain
language, in your channel (Telegram/voice/etc.).

## Daily driving

| You say | JARVIS does |
| ------- | ----------- |
| "What's my day look like?" | Calendar + priority inbox → tight briefing, flags conflicts |
| "Any fires in my inbox?" | Triages unread, surfaces only what needs you, drafts obvious replies |
| "Reply to Dana, tell her Thursday works" | Finds the thread, **drafts** the reply, shows it, sends on your OK |
| "Am I free Thursday afternoon?" | Checks calendar vs. your working hours, reports open slots |
| "Book 30 min with Sam next week" | Proposes slots → creates the event + invite on confirmation |
| "Push my 2pm to tomorrow" | Finds the event, finds a slot, confirms, reschedules, notifies |

## Knowledge & research

| You say | JARVIS does |
| ------- | ----------- |
| "What's the latest on <topic>?" | Web research, cross-checked, with sources |
| "Find the Acme contract" | Searches your Drive, reads it, answers your question |
| "What did we decide in the ops sync?" | Pulls the Granola transcript, extracts decisions + action items |
| "Summarize this" (paste/forward) | Clean summary + the next step |

## Content & media studio

| You say | JARVIS does |
| ------- | ----------- |
| "Make a deck for the Q3 update" | Gathers the numbers → Gamma deck → link back |
| "Design an IG post about the launch" | Canva branded graphic, sized for the platform |
| "Generate a hero image of <…>" | Higgsfield image; can upscale / cut out background |
| "Make a 20s ad for <product>" | Higgsfield video workflow → draft clip |
| "Give me 10 title ideas + a thumbnail for this video" | vidIQ titles + thumbnail concept + keyword rationale |
| "Write a voiceover for the intro" | Higgsfield audio / voiceover |

## Memory & CRM

| You say | JARVIS does |
| ------- | ----------- |
| "Remember: no meetings before 10am" | Stores it as a standing preference; honors it thereafter |
| "Who is Dana again?" | Recalls the person, org, history, last contact |
| "Log a follow-up: send Acme the paperwork by the 10th" | Creates a tracked commitment |
| "What's due this week?" | Lists open commitments + what's at risk |
| "Note that Acme renewed for 12 months" | Updates the client record |

## Proactive (automatic)

- **Morning brief** (weekday ~07:30): the day's calendar + priority inbox + due items.
- **End-of-day** (~18:00): what shipped, what slipped, tomorrow's first commitment.
- These come to you unprompted. Adjust timing in your cron jobs (see README).

## Safety — how it behaves by default

- **Draft, don't send.** JARVIS prepares emails/posts/invites and shows them; you
  fire them — until you tell it a class of action is standing.
- **Confirms before** anything irreversible, public, or money-related.
- To let it act on its own for a specific thing, add it under **Pre-authorized
  actions** in `JARVIS.md` (e.g. "you may send calendar invites without asking").

## Handy phrasings

- "Just draft it" / "Send it" — control the draft-vs-send gate.
- "Short version" / "Give me the detail" — control verbosity.
- "Remember that." — force a memory write.
- "Who told you that?" / "Source?" — JARVIS will cite.
- "Quiet unless it's urgent." — dial down proactivity for a while.
