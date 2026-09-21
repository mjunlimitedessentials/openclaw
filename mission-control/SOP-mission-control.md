# SOP — AI Mission Control Dashboard
### Recreate the MJU Mission Control experience for any end user
*MJUnlimited Essential Marketing · ThinkBox AI Operation Systems*

---

## What this builds

A personal "NASA control room" dashboard — one private web page that shows, at a glance:

- **AI Morning Briefing** — prioritized action list written by Claude, cross-referencing all sources
- **Connector Array** — live status board of every connected tool (green = live, red = no signal)
- **Mission Schedule** — the week ahead, with conflicts and duplicates flagged
- **Comms Traffic** — notable inbox threads tagged SECURITY / ACTION / MONEY
- **Panels per tool** — tasks (Notion), files (Drive), designs (Canva), team chat (Slack), AI credits, finance watch
- **Privacy toggle** — one tap blurs all money values for screen-sharing
- Cinematic 3D styling: boot-up animation, starfield, mouse parallax, glowing telemetry

It refreshes automatically on a schedule (e.g., 7 AM and 11 AM), keeps one permanent private link, and only messages the user when something urgent appears.

## Prerequisites (per end user)

1. A **Claude account** (Pro/Max/Team) with access to **Claude Code on the web** — claude.ai/code
2. **Connectors** linked at claude.ai → Settings → Connectors. Connect whatever the user actually lives in — typical set: Gmail, Google Calendar, Google Drive, Notion, Slack, Canva, Stripe. *The dashboard only shows tools that are connected; everything else honestly displays NO SIGNAL.*
3. A **GitHub repository** connected to the Claude Code session (any private repo works — it stores the dashboard files and version history)
4. 30–45 minutes for the first build; refreshes run themselves afterward

## Ground rules (what makes this work — include them in every prompt)

- **Real data only.** Every number must come from a live tool probe. No sample data, no placeholders, no guesses.
- **Fail honest.** A source that can't be reached is marked offline and its panel shows "NO SIGNAL" — the page never breaks and never fakes.
- **One self-contained file.** The dashboard must work offline with no external dependencies (no CDNs, no fonts from the internet).
- **Separate data from design.** Data lives in `dashboard-data.js`; the visual shell is `index.html`. Refreshes only rewrite the data file, so the design never drifts.
- **Privacy by default.** The published link is private to the user's Claude account, and money values get a blur toggle.

---

## Phase 1 — Build the dashboard (copy-paste prompt)

Open a new Claude Code session on the connected repo and paste:

> Probe every connector I have and build me a personal MISSION CONTROL dashboard as one local HTML page in a `mission-control/` folder. Requirements:
>
> 1. Dark NASA-control-room design: phosphor green/amber/cyan on near-black, monospace type, grid background, scanlines, corner-ticked panels, live clock in my timezone, status LEDs.
> 2. REAL DATA ONLY. Call each of my connected tools live (email, calendar, files, tasks, team chat, designs, credits/finance — whatever I have connected). Any tool that fails or needs approval gets marked offline and its panel shows "NO SIGNAL — SOURCE OFFLINE". Never invent data, never break the page.
> 3. Structure: `index.html` (the visual shell) reads from `dashboard-data.js` (a cached data feed you rewrite on every refresh). Single self-contained page, works fully offline, no external CDNs or libraries.
> 4. Include: an AI MORNING BRIEFING panel — a prioritized, numbered action list you write by cross-referencing sources (flag security alerts, schedule conflicts, duplicate events, money items, and mismatches like an empty task board against a full calendar); a CONNECTOR ARRAY panel showing every source online/offline; a 7-day schedule; notable inbox traffic tagged SECURITY/ACTION/MONEY; one panel per connected tool.
> 5. Add a PRIVACY toggle button that blurs all money values (balances, revenue, collections) for screen-sharing.
> 6. Create a skill file documenting the refresh procedure: re-probe all tools, rewrite dashboard-data.js with real data only, mark failures offline, write a fresh briefing, verify with `node --check`, commit and push. The refresh must never modify the visual layer.
> 7. Verify the page renders (screenshot it), commit and push, then publish it as a private Artifact so I get one permanent link — and show me screenshots of every panel to prove it works.

**Checkpoint:** user receives screenshots of every panel + a `claude.ai/code/artifact/...` link. Data stamp in the header matches today.

## Phase 2 — Cinematic 3D upgrade (copy-paste prompt)

> Enhance mission-control/index.html to feel like a 3D cinematic sci-fi command center instead of a flat retro terminal, while keeping it a single self-contained file that still works fully offline (no external CDN dependencies). Please add: (1) depth/perspective — a CSS perspective container with each panel given a subtle 3D tilt that responds to mouse movement (parallax), so panels feel like physical screens in a console rather than flat divs; (2) lighting effects — glowing box-shadows on the status LEDs so they look like they emit light, soft radial-gradient "glass" glow behind panels, and an occasional subtle glare/scanline sweep animation across panels; (3) atmosphere — a lightweight canvas-based starfield or drifting particle layer behind everything, plus a vignette darkening the screen edges; (4) motion/cinematic feel — a brief boot-up animation on load (flicker-on/scanline sweep) followed by panels fading/sliding in with a slight stagger, animated counting/typing-in for key data values, and subtle pulsing glow on the status LEDs. Keep performance light (pure CSS/canvas/vanilla JS, no heavy libraries) since this needs to run smoothly as a static offline file. Don't touch the underlying data logic in dashboard-data.js or the refresh skill — this should be a visual/animation layer on top of the existing structure. Show me screenshots when done.

**Checkpoint:** boot-cover screenshot, panels-arriving screenshot, settled view, tilt view, privacy-on view.

## Phase 3 — Automation (copy-paste prompt)

> Put the Mission Control refresh into permanent automation: create a Routine that runs daily at 7:00 AM and 11:00 AM my time. Each run must follow the refresh skill — re-probe every connected tool plus any newly approved connectors, rewrite dashboard-data.js with real probed data only, mark failed sources offline (never fake data, never break the page), write a fresh AI briefing, verify with node --check, commit and push, rebuild the single-file page, and republish the Artifact at MY EXISTING LINK using the url parameter so my link never changes. Do not modify the visual layer. Message me only if something urgent surfaced (security alerts, revenue events, missed commitments); otherwise refresh silently.

**Important:** creating the Routine triggers a one-tap **permission approval** — the user must be active in the session (or approve the prompt in the Claude app) for it to stick. Confirm Claude reports back a Routine ID and next-run time. The user can pause/delete it anytime at claude.ai → Settings → **Routines**.

---

## Phone setup (do this once with every end user)

1. Open the artifact link in **Safari/Chrome** (not an in-app mini browser) and **sign in to claude.ai** with the same account. *A "Page not found" error means not signed in — the page is private, so claude.ai hides it from strangers.*
2. Tap Share → **Add to Home Screen** → name it "Mission Control." Now it opens like an app.
3. Teach the two links: the **artifact link is the dashboard** (bookmark this); the GitHub link is just source-code backup (never needs opening).

## Troubleshooting quick reference

| Symptom | Cause | Fix |
|---|---|---|
| "Page not found" at the link | Browser not signed in to claude.ai | Tap Sign in, use the account that built it |
| A panel says NO SIGNAL | That connector is disconnected or needs approval | Reconnect/approve it in claude.ai → Settings → Connectors; next refresh lights it up |
| Every panel NO SIGNAL after a scheduled run | Connectors didn't attach to the automated session | Recreate the Routine from claude.ai → Settings → Routines with connectors attached |
| Data looks stale | Check the DATA timestamp in the header | Tell Claude "refresh now" in the session |
| Automation stopped | Routine paused or subscription lapsed | claude.ai → Settings → Routines → re-enable |

## Customization prompts (optional add-ons)

- *"Change the refresh schedule to ___ and ___ my time."*
- *"Add a panel for ___ (any newly connected tool) — probe it live like the others."*
- *"Recolor the theme to my brand: primary ___, accent ___ — keep the control-room feel."*
- *"Send me a phone notification with the top 3 briefing items after each morning refresh."*
- *"Blur client names too when privacy mode is on."*

## Delivery checklist (for the operator)

- [ ] Connectors linked and authorized (test: ask Claude to read one email subject)
- [ ] Phase 1 built — screenshots of every panel received, data stamp is today
- [ ] Phase 2 applied — boot animation and parallax verified
- [ ] Phase 3 Routine confirmed with ID + next-run time
- [ ] Files committed to the user's repo (`index.html`, `dashboard-data.js`, refresh skill)
- [ ] Phone: signed in, Added to Home Screen
- [ ] User shown the privacy toggle and the "refresh now" command
