-- J.A.R.V.I.S. 2 — long-term memory + lightweight CRM schema (Supabase / Postgres)
--
-- This is the richer successor to the single "memory" table the n8n JARVIS V4 uses.
-- Apply it to your Supabase project (SQL editor or `supabase db push` / the Supabase
-- MCP `apply_migration`). Then point the JARVIS skill's memory routing at it.
--
-- Design goals:
--   * facts, not transcripts — store durable, structured knowledge
--   * separate people/projects/commitments so JARVIS can reason, not just recall
--   * semantic recall via pgvector embeddings (optional but recommended)
--   * never store raw secrets/credentials here

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "vector";      -- embeddings for semantic recall

-- ---------------------------------------------------------------------------
-- memories: atomic durable facts (preferences, decisions, notes)
-- ---------------------------------------------------------------------------
create table if not exists memories (
  id          uuid primary key default gen_random_uuid(),
  operator    text not null default 'default',           -- multi-principal support
  kind        text not null default 'fact'
              check (kind in ('fact','preference','decision','event','note')),
  subject     text,                                        -- what it's about
  content     text not null,                               -- the fact itself
  tags        text[] default '{}',
  source      text,                                        -- where JARVIS learned it
  importance  int  default 3 check (importance between 1 and 5),
  embedding   vector(1536),                                -- optional semantic index
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists memories_operator_idx on memories (operator);
create index if not exists memories_tags_idx     on memories using gin (tags);
create index if not exists memories_kind_idx      on memories (kind);
-- Semantic search index (cosine). Requires embeddings to be populated.
create index if not exists memories_embedding_idx
  on memories using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- ---------------------------------------------------------------------------
-- people: lightweight CRM — who JARVIS knows
-- ---------------------------------------------------------------------------
create table if not exists people (
  id             uuid primary key default gen_random_uuid(),
  operator       text not null default 'default',
  name           text not null,
  relationship   text,                                     -- 'client','cofounder','vendor'...
  org            text,
  email          text,
  phone          text,
  handles        jsonb default '{}'::jsonb,                -- {slack, telegram, x, ...}
  notes          text,
  last_contact   timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists people_operator_idx on people (operator);
create index if not exists people_email_idx    on people (lower(email));

-- ---------------------------------------------------------------------------
-- projects: what the operator is working on
-- ---------------------------------------------------------------------------
create table if not exists projects (
  id          uuid primary key default gen_random_uuid(),
  operator    text not null default 'default',
  name        text not null,
  status      text default 'active' check (status in ('active','paused','done','archived')),
  priority    int  default 3 check (priority between 1 and 5),
  summary     text,
  due_date    date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists projects_operator_status_idx on projects (operator, status);

-- ---------------------------------------------------------------------------
-- commitments: tasks / follow-ups / things JARVIS is tracking
-- ---------------------------------------------------------------------------
create table if not exists commitments (
  id           uuid primary key default gen_random_uuid(),
  operator     text not null default 'default',
  title        text not null,
  detail       text,
  project_id   uuid references projects (id) on delete set null,
  person_id    uuid references people (id)   on delete set null,
  status       text default 'open' check (status in ('open','waiting','done','dropped')),
  due_at       timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists commitments_operator_status_idx on commitments (operator, status);
create index if not exists commitments_due_idx             on commitments (due_at);

-- ---------------------------------------------------------------------------
-- keep updated_at fresh
-- ---------------------------------------------------------------------------
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare t text;
begin
  foreach t in array array['memories','people','projects','commitments'] loop
    execute format(
      'drop trigger if exists trg_%1$s_updated on %1$s;
       create trigger trg_%1$s_updated before update on %1$s
         for each row execute function set_updated_at();', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- semantic recall helper: match_memories(query_embedding, operator, k)
-- Call from the JARVIS skill after embedding the query. Returns nearest facts.
-- ---------------------------------------------------------------------------
create or replace function match_memories(
  query_embedding vector(1536),
  match_operator  text default 'default',
  match_count     int  default 8
) returns table (
  id uuid, kind text, subject text, content text,
  tags text[], importance int, similarity float
) language sql stable as $$
  select m.id, m.kind, m.subject, m.content, m.tags, m.importance,
         1 - (m.embedding <=> query_embedding) as similarity
  from memories m
  where m.operator = match_operator
    and m.embedding is not null
  order by m.embedding <=> query_embedding
  limit match_count;
$$;

-- ---------------------------------------------------------------------------
-- Security note: enable Row Level Security + policies before exposing this to
-- any client-side key. For a single-operator, server-side JARVIS using a scoped
-- service token via the Supabase MCP, RLS is optional but recommended.
-- ---------------------------------------------------------------------------
