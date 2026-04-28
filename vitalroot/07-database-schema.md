# 07 — Database Schema

## Overview

- **Primary DB:** PostgreSQL 16 (structured relational data)
- **Vector search:** pgvector extension (semantic recipe/content search)
- **Cache/session:** Redis 7
- **CMS data:** Sanity.io (separate, synced via webhook to read-replica tables)
- **File storage:** S3-compatible (images, documents)

All tables use UUID primary keys. `created_at` / `updated_at` timestamps on all tables. Soft deletes via `deleted_at` nullable column.

---

## Core Tables

### `users`
```sql
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT UNIQUE NOT NULL,
  email_verified  BOOLEAN DEFAULT FALSE,
  password_hash   TEXT,                      -- null if OAuth only
  auth_provider   TEXT,                      -- 'email' | 'google' | 'apple'
  auth_provider_id TEXT,
  subscription_tier TEXT DEFAULT 'free',    -- 'free' | 'plus'
  subscription_expires_at TIMESTAMPTZ,
  is_caregiver    BOOLEAN DEFAULT FALSE,
  caregiver_for   UUID REFERENCES users(id), -- Phase 2
  locale          TEXT DEFAULT 'en',
  timezone        TEXT DEFAULT 'America/New_York',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);
```

### `health_profiles`
```sql
CREATE TABLE health_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name    TEXT,
  birth_year      INTEGER,
  biological_sex  TEXT,                     -- for condition-specific guidance; optional
  activity_level  TEXT,                     -- 'sedentary' | 'light' | 'moderate' | 'active'
  mobility_notes  TEXT,                     -- free text for mobility limitations
  cooking_skill   TEXT,                     -- 'beginner' | 'home_cook' | 'experienced'
  budget_level    TEXT,                     -- 'very_tight' | 'moderate' | 'flexible'
  motivation_style TEXT,                    -- 'gentle' | 'accountability' | 'mixed'
  communication_style TEXT,                -- 'gentle' | 'direct'
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### `user_conditions`
```sql
CREATE TABLE user_conditions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  condition_key   TEXT NOT NULL,            -- 'diabetes_t2' | 'obesity' | 'heart_disease' | 'ckd' | 'hypertension' | 'prediabetes' | 'stroke_recovery' | 'pcos'
  severity        TEXT,                     -- 'mild' | 'moderate' | 'severe' (self-reported, optional)
  diagnosed_year  INTEGER,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON user_conditions(user_id);
CREATE INDEX ON user_conditions(condition_key);
```

### `user_goals`
```sql
CREATE TABLE user_goals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goal_type       TEXT NOT NULL,            -- 'lower_a1c' | 'move_more' | 'eat_better' | 'feel_better' | 'manage_weight' | 'reduce_sodium' | 'manage_stress'
  target_value    NUMERIC,                  -- optional numeric target
  target_unit     TEXT,
  current_value   NUMERIC,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### `cuisine_preferences`
```sql
CREATE TABLE cuisine_preferences (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cuisine_key     TEXT NOT NULL,            -- 'soul_food' | 'caribbean' | 'african' | 'latin' | 'southern' | 'mediterranean' | 'asian' | 'plant_forward' | 'comfort'
  preference_level TEXT DEFAULT 'liked'    -- 'loved' | 'liked' | 'neutral' | 'avoid'
);
CREATE INDEX ON cuisine_preferences(user_id);
```

---

## Content Tables

### `recipes`
```sql
CREATE TABLE recipes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  cuisine_key     TEXT NOT NULL,
  prep_time_min   INTEGER,
  cook_time_min   INTEGER,
  servings        INTEGER,
  difficulty      TEXT,                     -- 'beginner' | 'intermediate' | 'advanced'
  hero_image_url  TEXT,
  instructions    JSONB NOT NULL,           -- [{step: 1, text: "...", image_url: "..."}]
  ingredients     JSONB NOT NULL,           -- [{name, amount, unit, substitution_note}]
  nutrition_per_serving JSONB,             -- {calories, carbs_g, protein_g, fat_g, sodium_mg, potassium_mg, phosphorus_mg, fiber_g}
  cost_per_serving_usd NUMERIC(5,2),
  is_budget_friendly BOOLEAN DEFAULT FALSE,
  is_quick        BOOLEAN DEFAULT FALSE,    -- under 30 min total
  is_family_size  BOOLEAN DEFAULT FALSE,
  status          TEXT DEFAULT 'draft',     -- 'draft' | 'published' | 'archived'
  reviewed_by     TEXT,                     -- reviewer name
  reviewed_at     TIMESTAMPTZ,
  seo_title       TEXT,
  seo_description TEXT,
  schema_markup   JSONB,                    -- Recipe schema.org data
  embedding       vector(1536),             -- pgvector for semantic search
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);
CREATE INDEX ON recipes USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX ON recipes(cuisine_key);
CREATE INDEX ON recipes(status);
```

### `recipe_condition_tags`
```sql
CREATE TABLE recipe_condition_tags (
  recipe_id       UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  condition_key   TEXT NOT NULL,            -- 'diabetes_friendly' | 'heart_healthy' | 'kidney_safe' | 'kidney_caution' | 'low_sodium' | 'weight_loss_support'
  caution_level   TEXT DEFAULT 'safe',      -- 'safe' | 'caution' | 'avoid' | 'consult_dietitian'
  caution_note    TEXT,
  PRIMARY KEY (recipe_id, condition_key)
);
```

### `exercises`
```sql
CREATE TABLE exercises (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  level           INTEGER NOT NULL,         -- 0=seated/bedside, 1=gentle, 2=moderate, 3=active
  duration_min    INTEGER,
  equipment_needed JSONB,                   -- []  or [{name, required}]
  instructions    JSONB NOT NULL,
  modifications   JSONB,                    -- {easier: "...", harder: "..."}
  demonstration_url TEXT,                  -- video or image URL
  warning_signs   TEXT,                     -- when to stop
  status          TEXT DEFAULT 'draft',
  reviewed_by     TEXT,
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### `exercise_condition_tags`
```sql
CREATE TABLE exercise_condition_tags (
  exercise_id     UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  condition_key   TEXT NOT NULL,
  suitability     TEXT DEFAULT 'suitable',  -- 'suitable' | 'with_modification' | 'consult_first' | 'avoid'
  note            TEXT,
  PRIMARY KEY (exercise_id, condition_key)
);
```

### `herbs`
```sql
CREATE TABLE herbs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  common_name     TEXT NOT NULL,
  scientific_name TEXT,
  other_names     TEXT[],
  description     TEXT,
  traditional_uses TEXT,
  research_summary TEXT,
  evidence_level  TEXT,                     -- 'strong' | 'moderate' | 'limited' | 'anecdotal'
  safety_summary  TEXT,
  contraindications TEXT[],
  kidney_risk_level TEXT DEFAULT 'unknown', -- 'none' | 'low' | 'moderate' | 'high' | 'unknown'
  kidney_note     TEXT,
  drug_interactions JSONB,                 -- [{drug_name, interaction_severity, description}]
  status          TEXT DEFAULT 'draft',
  reviewed_by     TEXT,
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### `local_resources`
```sql
CREATE TABLE local_resources (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  resource_type   TEXT NOT NULL,            -- 'dietitian' | 'diabetes_educator' | 'support_group' | 'farmers_market' | 'park' | 'community_center' | 'food_bank' | 'faith_center' | 'assistance_org'
  address_line1   TEXT,
  address_line2   TEXT,
  city            TEXT NOT NULL,
  state           TEXT NOT NULL,
  zip_code        TEXT NOT NULL,
  lat             NUMERIC(10,7),
  lng             NUMERIC(10,7),
  phone           TEXT,
  website_url     TEXT,
  description     TEXT,
  languages       TEXT[],                   -- ['en', 'es', 'ht']
  accepts_medicare BOOLEAN,
  accepts_medicaid BOOLEAN,
  sliding_scale   BOOLEAN,
  free            BOOLEAN DEFAULT FALSE,
  conditions_served TEXT[],
  hours           JSONB,                    -- {mon: "9am-5pm", tue: "..."}
  verified_at     TIMESTAMPTZ,
  data_source     TEXT,                     -- 'manual' | 'google_places' | 'community_submitted'
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON local_resources(zip_code);
CREATE INDEX ON local_resources(resource_type);
CREATE INDEX ON local_resources USING GIST (point(lng, lat));
```

---

## App Activity Tables

### `mood_checkins`
```sql
CREATE TABLE mood_checkins (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score           INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
  note            TEXT,
  source          TEXT DEFAULT 'manual',   -- 'manual' | 'prompted' | 'struggling_flow'
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON mood_checkins(user_id, created_at DESC);
```

### `meal_logs`
```sql
CREATE TABLE meal_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipe_id       UUID REFERENCES recipes(id),
  free_text       TEXT,                     -- for manual entry not tied to recipe
  meal_type       TEXT,                     -- 'breakfast' | 'lunch' | 'dinner' | 'snack'
  logged_at       TIMESTAMPTZ NOT NULL,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### `movement_logs`
```sql
CREATE TABLE movement_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id     UUID REFERENCES exercises(id),
  free_text       TEXT,
  duration_min    INTEGER,
  logged_at       TIMESTAMPTZ NOT NULL,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### `saved_recipes`
```sql
CREATE TABLE saved_recipes (
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipe_id       UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  saved_at        TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, recipe_id)
);
```

### `saved_exercises`
```sql
CREATE TABLE saved_exercises (
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id     UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  saved_at        TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, exercise_id)
);
```

---

## Conversation & AI Tables

### `conversations`
```sql
CREATE TABLE conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  ended_at        TIMESTAMPTZ,
  tone_mode       TEXT DEFAULT 'gentle',    -- 'empathy' | 'gentle' | 'accountability' | 'recovery' | 'celebration' | 'sadness_aware'
  safety_flag     BOOLEAN DEFAULT FALSE,    -- flagged for safety review
  escalation_triggered BOOLEAN DEFAULT FALSE
);
```

### `conversation_messages`
```sql
CREATE TABLE conversation_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role            TEXT NOT NULL,            -- 'user' | 'assistant' | 'system'
  content         TEXT NOT NULL,
  tokens_used     INTEGER,
  safety_flagged  BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON conversation_messages(conversation_id, created_at);
```

### `safety_events`
```sql
CREATE TABLE safety_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID,                     -- nullable for anonymous sessions
  session_id      TEXT,
  event_type      TEXT NOT NULL,            -- 'crisis_ideation' | 'medical_danger' | 'hopelessness_signal' | 'escalation_offered' | 'escalation_accepted'
  trigger_content TEXT,                     -- anonymized excerpt that triggered flag
  escalation_resources_shown TEXT[],
  reviewed_by_staff BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## CMS Sync Tables

### `cms_content_sync`
```sql
-- Tracks Sanity.io document sync status
CREATE TABLE cms_content_sync (
  sanity_document_id TEXT PRIMARY KEY,
  document_type   TEXT NOT NULL,            -- 'recipe' | 'exercise' | 'herb' | 'condition_page' | 'blog_post'
  local_id        UUID,
  last_synced_at  TIMESTAMPTZ,
  sync_status     TEXT DEFAULT 'pending'   -- 'synced' | 'pending' | 'error'
);
```

---

## Notifications

### `notifications`
```sql
CREATE TABLE notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type            TEXT NOT NULL,            -- 'check_in' | 're_engagement' | 'movement_reminder' | 'celebration' | 'new_recipe'
  title           TEXT NOT NULL,
  body            TEXT NOT NULL,
  sent_at         TIMESTAMPTZ,
  read_at         TIMESTAMPTZ,
  action_url      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Redis Key Patterns

```
# Session tokens
session:{user_id}:{session_token} → {user_data JSON} TTL 7d

# Personalization cache (avoid re-computing on every request)
personalization:{user_id} → {conditions[], cuisines[], goals[], motivation_style} TTL 1h

# Rate limiting (chatbot)
chatbot_ratelimit:{user_id} → request_count TTL 1m

# Conversation context window (short-term memory for chatbot)
conv_context:{conversation_id} → [{role, content}] TTL 24h

# Local resource search cache (zip-based)
local_resources:{zip_code}:{resource_type} → {results JSON} TTL 6h
```
