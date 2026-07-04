# 🌱 NicheFinder — Ability & Strength Discovery Tool

A warm, gentle, **touch-based** questionnaire that helps discover a person's
natural **interests, strengths, learning style, sensory preferences and
potential niche** — for anyone from **age 5 to 80**, with special care for
**children and adults in the special-needs community**.

> NicheFinder is **not a test that labels people**. It is a *strengths-discovery*
> tool. There are no good or bad answers — only where a person naturally thrives
> and gentle ways to support their growth.

---

## ✨ What it does

- Guides a person (or their caregiver/teacher) through a short, calm,
  **no-typing, tap-only** questionnaire tailored to their age group.
- Scores **13 strength areas** plus **sensory preferences** using a transparent,
  points-based engine.
- Matches the person to an original **strengths archetype** (e.g. *The Sound
  Explorer*, *The Builder*, *The Quiet Strategist*).
- Produces a **results dashboard** and a **printable / PDF report** with:
  top strengths, learning style, sensory notes, suggested activities, best
  environment, growth-based support recommendations, and possible
  niche / career / hobby pathways.
- Lets caregivers/teachers add private **notes**, and lets admins **add new
  questions** (and, by design, new categories) without touching code.

Everything is framed with growth language — *“best environment”*, *“responds
well to”*, *“needs support with”*, *“potential strength”*, *“recommended next
step”* — never *failure*, *bad* or *low potential*.

---

## 🧑‍🦽 Accessibility & inclusive design

Built accessibility-first for neurodivergent users (autism, ADHD, intellectual
disabilities, speech delays, learning disabilities, sensory processing
differences):

| Feature | How it works |
| --- | --- |
| **Touch-first, no typing** | The main user only ever taps large cards. Names are optional and typed by a helper. |
| **Large buttons & text** | Every touch target is ≥ 48px. A **text-size** control offers Normal / Large / X-Large. |
| **High-contrast mode** | Re-themes the whole app via CSS variables (strong borders, WCAG-friendly colors). |
| **Read-aloud (audio)** | Every question and answer has a 🔊 button; optional auto read-aloud. Uses the browser's built-in speech — no network, no dependency. |
| **Picture mode** | Bigger icons, less text, for picture-based questions. |
| **Calm mode** | Turns off all motion/animation; also respects `prefers-reduced-motion`. |
| **No timers, no pressure** | Nothing is timed; you can never “fail”. |
| **Pause & resume** | Progress saves automatically on every answer — close the tab and continue later. |
| **Keyboard / switch access** | Full focus management, a visible 4px focus ring, a skip link, and ARIA roles throughout. |
| **Caregiver / teacher modes** | Independent, Assisted-by-caregiver, and Teacher/coach setups. |

---

## 🗂️ Project structure

```
nichefinder/
├── index.html                  # App entry (mounts #root)
├── package.json                # Scripts & dependencies
├── vite.config.ts              # Vite + `@` → src alias
├── tailwind.config.ts          # Design tokens (themeable via CSS vars)
├── postcss.config.js
├── tsconfig.json               # Strict TypeScript
└── src/
    ├── main.tsx                # React root
    ├── App.tsx                 # Router + providers + layout
    ├── index.css               # Theme tokens, a11y modes, print styles
    │
    ├── types/
    │   └── index.ts            # All domain types (the DB-ready contract)
    │
    ├── data/                   # Local JSON-style question bank & content
    │   ├── categories.ts       # 13 strength categories, age groups, support levels
    │   ├── profiles.ts         # 12 original strengths archetypes
    │   ├── activities.ts       # Activities, pathways & learning styles
    │   └── questionBank.ts     # Sample questions for all 6 age paths
    │
    ├── lib/
    │   ├── scoring.ts          # Pure scoring engine (session → result)
    │   ├── storage.ts          # DataStore interface + localStorage impl
    │   ├── audio.ts            # Read-aloud (Web Speech API)
    │   └── id.ts               # id + time helpers
    │
    ├── context/
    │   └── SettingsContext.tsx # Accessibility settings (persisted)
    │
    ├── components/
    │   ├── AppShell.tsx        # Header/footer frame + skip link
    │   ├── AccessibilityBar.tsx# Comfort & access controls
    │   ├── QuestionCard.tsx    # One question + its answer grid
    │   ├── AnswerCard.tsx      # A single large touch answer card
    │   └── ui/                 # Button, Card, ProgressBar, Toggle, SpeakButton
    │
    └── pages/
        ├── LandingPage.tsx     # Hero + resume/saved sessions
        ├── CreateProfilePage.tsx # Name → age group → support level
        ├── QuestionnairePage.tsx # The tap-only questionnaire runner
        ├── ResultsPage.tsx     # Strengths dashboard + notes
        ├── ReportPage.tsx      # Printable / PDF strength report
        └── AdminPage.tsx       # Question editor (add questions/categories)
```

---

## 🚀 Getting started

**Requirements:** Node.js 18+ and npm.

```bash
cd nichefinder
npm install        # install dependencies
npm run dev        # start the dev server (http://localhost:5173)
```

Other scripts:

```bash
npm run build      # type-check (tsc) + production build → dist/
npm run preview    # preview the production build
npm run typecheck  # types only
```

The built app in `dist/` is fully static (it uses `HashRouter`), so it can be
hosted anywhere — or even opened from the local filesystem — and works offline.

---

## 🧮 How scoring works

The engine (`src/lib/scoring.ts`) is a set of **pure functions** — no React, no
storage — so it's easy to test and to move server-side later.

1. Each **answer** carries small point **weights** toward one or more of the 13
   strength categories, and may hint at a **sensory** channel.
2. A session's answers are tallied into per-category points and normalised to
   0–100% for the bars.
3. The **top 3 categories** become the headline strengths.
4. Categories are matched against the 12 **archetype profiles**; the best
   overlap becomes the person's primary profile.
5. Learning style, sensory notes, activities, best environment, support
   recommendations and pathways are derived from the top strengths and the
   matched profile — always in growth-based language.

> There is **no “weakness” score.** Low categories are simply not surfaced as
> strengths. “Needs support with” comes from the profile's growth framing, never
> from a deficit.

### Strength categories

Music/Sound/Rhythm · Visual Art/Design/Color · Movement/Sports/Dance ·
Building/Hands-on · Technology/Computers/AI · Nature/Animals/Outdoors ·
Helping/Caregiving/Ministry · Storytelling/Speaking/Performance ·
Organizing/Systems/Structure · Problem-Solving/Puzzles ·
Leadership/Guiding others · Quiet Focus/Independent work ·
Social Connection/Group work — plus **sensory preferences** (sound, touch,
light, movement, texture).

### Strengths archetypes (original)

The Creator · The Builder · The Helper · The Sound Explorer · The Visual Thinker
· The Organizer · The Tech Explorer · The Leader · The Quiet Strategist ·
The Movement Learner · The Nature Connector · The Storyteller.

These are **original** profiles inspired by the *idea* of workplace
strengths/personality models — none copy any proprietary assessment.

---

## 🛠️ Extending the question bank

**No code required for content.** Open **Admin → Question editor** (`/#/admin`)
to add a new question: write the prompt, pick the age groups, and add 2–4
options each mapped to a strength category and points. New questions persist
locally and appear immediately in the matching age path.

Adding a **new strength category** later is a two-file change:
`data/categories.ts` (the category) and `data/activities.ts` (its activities and
pathways). Nothing else needs to change — the scoring engine iterates over the
category list.

---

## 🗄️ From MVP to product (database-ready)

The MVP stores everything in the browser via a single **`DataStore` interface**
(`src/lib/storage.ts`). Swapping in a real backend means implementing that one
interface against your database or API — **no UI code changes**. The types in
`src/types/index.ts` already describe the exact shapes a backend would return:

- `PersonProfile` — the person being discovered (no sensitive/clinical data).
- `AssessmentSession` — one run: ordered questions, answers, progress, status.
- `Question` / `AnswerOption` — the content model (identical in code and DB).
- `AssessmentResult` — everything the dashboard and report render.

Suggested next steps toward the full product: authentication for Admin,
a hosted question service, multi-language read-aloud, richer picture/photo
answer assets, and organisation/classroom accounts.

---

## 🧰 Tech stack

- **React 18** + **TypeScript** (strict)
- **Vite** build tooling
- **Tailwind CSS** with themeable design tokens
- **React Router** (`HashRouter`) for offline-friendly routing
- **Web Speech API** for read-aloud and **native print** for PDF export
  (zero extra runtime dependencies)

Mobile-first, responsive, and WCAG-minded throughout.

---

## 💛 A note on tone

NicheFinder is meant to feel **warm, hopeful, professional, inclusive and
simple** — never clinical, cold, childish-for-adults, or overwhelming. Every
result celebrates what makes a person light up, because everyone has a place
where they thrive.
