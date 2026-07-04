---
name: jarvis-crm
description: "JARVIS memory & CRM sub-agent. Use to REMEMBER and RECALL durable facts, people, projects, and commitments in the Supabase store. Use when the operator says: remember this, who is X, what did we decide, log a follow-up, what's due, update my notes on <client>. Reads at the start of relevant tasks; writes when a stable fact is learned. NOT for: transient chit-chat, or secrets/passwords (never store those)."
metadata: { "openclaw": { "emoji": "🧠" } }
---

# JARVIS CRM & Long-term Memory

Durable, structured memory backed by Supabase (schema:
`jarvis/supabase/schema.sql`). Tables: `memories`, `people`, `projects`,
`commitments`. Accessed through the Supabase MCP server (`execute_sql`,
`apply_migration`, `list_tables`) wired via mcporter.

This is the successor to the single memory table in JARVIS V4 — JARVIS 2 stores
*who / what / when*, not just a blob, so it can actually reason.

## When to read vs. write

- **Read** at the start of any task involving a person, a client, a project, or a
  prior decision. "Reply to Dana" → first recall who Dana is and the last thing
  agreed.
- **Write** when you learn a *stable* fact: a preference, a decision, a new person,
  a commitment, a project update. Not transcripts, not one-off trivia.
- **Never store** passwords, API keys, tokens, card numbers, or raw credentials.

## Setup (once)

Apply the schema via the Supabase MCP `apply_migration` (paste the contents of
`jarvis/supabase/schema.sql`), or run it in the Supabase SQL editor. Verify with
`list_tables`.

## Common operations (via `execute_sql`)

> Parameterize/escape values properly. `operator` defaults to `'default'` for a
> single principal; use distinct values for multiple principals.

### Recall a person
```sql
select name, relationship, org, email, notes, last_contact
from people
where operator = 'default' and name ilike '%dana%'
order by last_contact desc nulls last
limit 5;
```

### Remember a new person / update one
```sql
insert into people (operator, name, relationship, org, email, notes)
values ('default', 'Dana Ruiz', 'client', 'Acme', 'dana@acme.com',
        'Prefers Thursday calls; decision-maker on the Q3 renewal.')
on conflict do nothing;
-- update:
update people set notes = notes || E'\n' || 'Renewed for 12 months on 2026-07-01.',
       last_contact = now(), updated_at = now()
where operator='default' and lower(email)='dana@acme.com';
```

### Store a durable fact / preference / decision
```sql
insert into memories (operator, kind, subject, content, tags, importance, source)
values ('default', 'preference', 'scheduling',
        'No meetings before 10:00 local. Fridays are heads-down.',
        array['scheduling','rules'], 5, 'stated by operator');
```

### Recall facts about a subject
```sql
select kind, content, importance
from memories
where operator='default'
  and (subject ilike '%scheduling%' or tags && array['scheduling'])
order by importance desc, updated_at desc
limit 12;
```

### Log a commitment / follow-up
```sql
insert into commitments (operator, title, detail, status, due_at, person_id)
values ('default', 'Send Acme the renewal paperwork',
        'Dana expects it before the 10th.', 'open',
        timestamptz '2026-07-10 17:00', 
        (select id from people where operator='default' and lower(email)='dana@acme.com'));
```

### What's due / at risk (for the morning brief)
```sql
select c.title, c.due_at, c.status, p.name as who
from commitments c
left join people p on p.id = c.person_id
where c.operator='default' and c.status in ('open','waiting')
order by c.due_at nulls last
limit 20;
```

### Mark a commitment done
```sql
update commitments set status='done', updated_at=now()
where id = '<uuid>';
```

### Semantic recall (optional, if embeddings populated)
If you maintain embeddings, embed the query and call the helper:
```sql
select * from match_memories('[<query-embedding>]'::vector, 'default', 8);
```
Otherwise fall back to the tag/ILIKE queries above.

## Discipline

- Keep memory **clean**: update stale entries instead of piling on duplicates.
- Prefer structure: a person goes in `people`, a task in `commitments`, a
  preference in `memories` — don't dump everything into one table.
- Summarize what you stored back to the operator in one line: "Noted — Dana renewed,
  logged the paperwork due the 10th."
- If Supabase isn't configured, fall back to the built-in memory plugin and tell
  the operator richer CRM needs the Supabase wiring (see `jarvis/README.md`).
