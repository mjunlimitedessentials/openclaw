---
name: mission-control-refresh
description: Refresh the MJU Mission Control dashboard (mission-control/) by re-probing every connected tool, rewriting dashboard-data.js with real data only, regenerating the AI morning briefing, and marking failed sources offline. Use when asked to refresh, update, or rebuild the mission-control dashboard, or when the scheduled morning refresh fires.
metadata:
  {
    "openclaw": { "emoji": "🛰️" }
  }
---

# Mission Control Refresh

Regenerate `mission-control/dashboard-data.js` from live connector probes.
The page (`mission-control/index.html`) is static and must NOT be edited by
this skill — it renders whatever the data file contains and shows NO SIGNAL
for anything missing. All data flows through the data file.

## Iron rules

1. **Real data only.** Every number written to `dashboard-data.js` must come
   from a tool call that succeeded in this run. Never carry a stale number
   forward silently, never invent one.
2. **Never break the page.** If a probe fails, mark that source
   `status: "offline"` (or `"auth"` if it needs authorization) in the
   `sources` array and omit/empty its data block — the page renders a
   NO SIGNAL panel on its own. A malformed data file is the only way to
   break the page, so keep it valid JS: `window.MISSION_DATA = { ... };`.
3. **Money fields** keep `money: true` so the privacy toggle can blur them.

## Probe list (run in parallel where possible)

| Source | Probe |
|---|---|
| Gmail | `search_threads` query `in:inbox newer_than:3d`, pageSize 15 |
| Google Calendar | `list_events` today → +7 days, primary calendar; `list_calendars` count |
| Google Drive | `list_recent_files` pageSize 10 |
| Notion | query the "My Tasks" view (db `d532cf23-e4e7-44fe-b546-1edd2fad18e9`) for open-task count; `notion-search` for recent pages |
| Slack | `slack_search_channels`, then `slack_read_channel` per channel for message counts |
| Canva | `search-designs` sorted by modified_descending |
| Higgsfield | `balance` for credits + plan |
| Stripe, Granola, Zoom, Supabase, vidIQ, Gamma, Jotform, Lovable | attempt one cheap read each; expect approval-gating in headless runs → mark offline |

MCP tool prefixes rotate between sessions — discover current names with
ToolSearch rather than hardcoding prefixes.

## Steps

1. Probe everything above. Collect results; note failures.
2. Rewrite `mission-control/dashboard-data.js`:
   - `generatedAt`: current UTC ISO timestamp
   - `sources`: one entry per connector with live status + one-line detail
   - data blocks only for sources that answered
   - `briefing`: write a fresh AI morning briefing — 5–8 prioritized actions,
     each cross-referencing at least one source (`sources: [...]`), security
     items first, money items flagged `money: true`. The headline is one
     sentence that captures the day.
3. Sanity-check: `node --check mission-control/dashboard-data.js` must pass.
4. Commit and push on the current working branch
   (message: `chore(mission-control): morning data refresh <date>`).
5. If running in an environment with Chromium, screenshot the page
   (1720px wide) and send it to the user with a 2–3 line summary of what
   changed since yesterday. If nothing notable changed, keep it to one line.
