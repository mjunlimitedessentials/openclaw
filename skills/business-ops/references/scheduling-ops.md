# ScheduleOps — Calendar & Time Management Operations

## Table of Contents

1. [Daily Schedule Briefing](#daily-schedule-briefing)
2. [Protected Time Blocks](#protected-time-blocks)
3. [Meeting Scheduling Protocol](#meeting-scheduling-protocol)
4. [Meeting Prep Workflow](#meeting-prep-workflow)
5. [Post-Meeting Logging](#post-meeting-logging)
6. [Time Blocking Strategy](#time-blocking-strategy)
7. [Calendar Health Rules](#calendar-health-rules)

---

## Daily Schedule Briefing

Run every morning as part of the daily briefing:

```
1. list_calendars() → identify primary business calendar
2. list_events(date=today, calendar=primary) → pull all events
3. list_events(date=tomorrow, calendar=primary) → preview tomorrow
```

Report format:
```
TODAY — [Day, Date]

Morning:
  9:00am  → [Event name] ([duration]) [PREP NEEDED flag if applicable]
  11:30am → [Event name] ([duration])

Afternoon:
  2:00pm  → [Event name] ([duration])

Evening: Clear ✓  (or list any events)

TOMORROW PREVIEW:
  [1-2 sentence summary of tomorrow's schedule load]

ACTION ITEMS:
  → Prep needed for [event] by [time]
  → [any scheduling conflicts or back-to-back meetings to flag]
```

---

## Protected Time Blocks

These time windows are SACRED. Never schedule over them without explicit owner override.

| Block | Time | Days | Purpose |
|---|---|---|---|
| Deep Work | 9:00am – 12:00pm | Mon–Fri | Creation, building, high-focus work |
| Weekly Planning | 8:00am – 9:00am | Monday | Plan the week, review goals |
| Family / Personal | After 6:00pm | Daily | Non-negotiable personal time |
| Recovery buffer | 12:00pm – 1:00pm | Daily | Lunch, transition — no hard meetings |
| Weekly Review | 4:00pm – 5:00pm | Friday | Review week, prep next week |

**All times in owner's local timezone.** Confirm timezone before scheduling across time zones.

When a scheduling request conflicts with a protected block:
→ Surface the conflict: "That time overlaps with your deep work block. Would you like to find an alternative?"
→ Suggest 3 alternative slots via `suggest_time`
→ Do not override protected blocks without owner saying "override, schedule it"

---

## Meeting Scheduling Protocol

### Before creating any event:

```
1. list_events(timeMin=proposed_start, timeMax=proposed_end) → check for conflicts
2. Confirm with owner: "No conflicts found for [day] [time]. Create the event?"
3. If conflict exists: "There's already [event] at that time. Want alternatives?"
   → suggest_time(attendees, duration, preferred_window) → offer 3 options
4. create_event only after confirmation
```

### Event creation template:

```python
create_event({
  "summary": "[Clear, descriptive title]",
  "start": "[ISO 8601 datetime with timezone]",
  "end": "[ISO 8601 datetime with timezone]",
  "description": "[Agenda or context — 2-5 bullet points]",
  "attendees": ["[email if external meeting]"],  # omit for solo blocks
  "reminders": [{"method": "popup", "minutes": 15}]
})
```

### Meeting types and defaults:

| Type | Default Duration | Buffer After | Notes |
|---|---|---|---|
| 1:1 coaching call | 60 min | 15 min | Add agenda to description |
| Discovery call (lead) | 30 min | 10 min | Qualify before booking |
| Team/collab call | 45 min | 15 min | Prep notes in Notion |
| Workshop / live session | 90 min | 30 min | Block prep time day before |
| Quick sync | 15 min | 5 min | Async first — book only if needed |

Always add a 15-minute buffer after calls where possible. Don't stack meetings back-to-back.

### Accepting external invites:

Do NOT autonomously accept or decline external invitations. Surface to owner:
"Invite from [name/org] for [date/time]: [title]. Accept, decline, or propose new time?"

Use `respond_to_event` only after owner confirms the response.

---

## Meeting Prep Workflow

For any meeting with an external attendee or a tagged "PREP NEEDED" event, run this 30 minutes before:

### Prep checklist:

1. **Retrieve event details**: `get_event(event_id)` — review agenda and attendees
2. **Check prior context**:
   - If customer: search Gmail for prior threads (`search_threads(from=[email])`)
   - If lead: check lead qualification score from CommsOps
   - If collab: search Notion for prior meeting notes
3. **Draft meeting brief** (present to owner):
   ```
   MEETING BRIEF: [Title]
   Time: [Start] – [End]
   Attendee: [Name, role/company]

   Context:
   - [Prior interaction summary — 2-3 sentences]
   - [Any open items or commitments from last interaction]

   Suggested agenda:
   1. [Topic 1] (X min)
   2. [Topic 2] (X min)
   3. [Next steps / close] (5 min)

   Watch for:
   - [Any sensitivities, requests, or goals to keep in mind]
   ```
4. Surface brief to owner: "Brief ready for [meeting]. Adjust agenda?"

---

## Post-Meeting Logging

After any substantive meeting (coaching, lead, collab), prompt owner:
"Meeting with [name] wrapped. Want me to log notes? What were the key outcomes?"

On owner input, log to Notion:

```
notion-create-pages({
  parent: "Meeting Notes Database",
  properties: {
    "Title": "[Meeting title] — [Date]",
    "Date": "[Date]",
    "Attendee": "[Name]",
    "Type": "[Coaching | Lead | Collab | Internal]",
    "Status": "Logged",
    "Summary": "[Owner's spoken summary]",
    "Action Items": "[Owner's stated next steps]",
    "Follow-up Date": "[If applicable]"
  }
})
```

If a follow-up meeting is needed, immediately offer to schedule it:
"Want me to schedule the follow-up for [suggested time window]?"

---

## Time Blocking Strategy

When owner asks to "protect my week" or "set up focus time":

### Weekly template to apply (Monday morning):

```
Monday:
  8:00–9:00am   → Weekly Planning (block: "🗓 Weekly Plan")
  9:00–12:00pm  → Deep Work Block (block: "🔥 Deep Work — [Primary focus]")
  2:00–4:00pm   → Meetings window (leave open)

Tuesday–Thursday:
  9:00–12:00pm  → Deep Work Block
  1:00–3:00pm   → Meetings / calls window
  3:00–4:00pm   → Admin / emails

Friday:
  9:00–11:00am  → Deep Work / wrap up
  11:00–12:00pm → Content / creative
  4:00–5:00pm   → Weekly Review (block: "📋 Weekly Review")
```

When creating blocks, use emoji prefixes so they're visually distinct in the calendar.
Set blocks as "Busy" status and include a private note about what the block is protecting.

---

## Calendar Health Rules

Flag to owner when:

| Condition | Action |
|---|---|
| More than 3 meetings in one day | "Heavy meeting day detected — want to defer any?" |
| Back-to-back meetings with no buffer | "No buffer between [A] and [B] — add 15 min?" |
| Meeting scheduled in deep work block | "This overlaps your deep work. Override or reschedule?" |
| No deep work time blocked this week | "No deep work blocked this week. Want me to add it?" |
| More than 4h of meetings on any day | "You're at 4h of meetings [day]. Consider async for [event]?" |
| No weekly review event on Friday | "No weekly review blocked Friday. Add it?" |

These are suggestions — the owner makes the final decision on all scheduling changes.
