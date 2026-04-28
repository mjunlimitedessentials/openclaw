# 13 — Wireframe Descriptions

## Wireframe Philosophy

These are structural and behavioral descriptions for each key screen. Design system tokens from `14-design-system.md` apply to all. All layouts are mobile-first; desktop adaptations noted where different.

---

## WF-01: Home Page (Public Website)

```
┌─────────────────────────────────────────┐
│ [Nav: Logo] [Conditions] [Recipes] [Move]│
│ [Natural] [Wellness] [Find Help] [Join] │
├─────────────────────────────────────────┤
│                                         │
│  HERO SECTION (full-width, warm green   │
│  gradient, real food photography BG)    │
│                                         │
│  [H1] "Your health journey, supported   │
│   with care — not judgment."           │
│  [Subheadline: empathetic, 2 lines]    │
│                                         │
│  [CTA: Join Free →] [Explore Conditions]│
│                                         │
│  Medical disclaimer link (subtle)       │
├─────────────────────────────────────────┤
│  CONDITION NAVIGATOR (icon grid, 5 cards│
│  ○ Diabetes  ○ Heart Health             │
│  ○ Kidney    ○ Weight Health            │
│  ○ Brain Recovery                       │
├─────────────────────────────────────────┤
│  "WHAT MAKES VITALROOT DIFFERENT"       │
│  3-column: Culturally Inclusive /       │
│  Evidence-Based / Compassion-First      │
├─────────────────────────────────────────┤
│  FEATURED RECIPES (horizontal scroll    │
│  on mobile, 3-col grid on desktop)      │
│  [Recipe card][Recipe card][Recipe card]│
│  Diverse cuisines, condition tags shown │
├─────────────────────────────────────────┤
│  HOW IT WORKS (3 steps)                 │
│  1. Tell us about yourself              │
│  2. Get personalized guidance           │
│  3. Grow at your own pace              │
├─────────────────────────────────────────┤
│  TESTIMONIALS (carousel)                │
│  [Photo] "Quote" — Name, City, Condition│
├─────────────────────────────────────────┤
│  FIND HELP NEAR ME TEASER               │
│  [Zip code input] [Find Resources →]   │
├─────────────────────────────────────────┤
│  RECENT LEARNING CENTER ARTICLES (3)    │
├─────────────────────────────────────────┤
│  JOIN CTA BANNER (warm, non-pushy)      │
│  "Join 10,000+ people taking one step   │
│   at a time. Free forever."            │
│  [Join Free] [Learn More]              │
├─────────────────────────────────────────┤
│  FOOTER                                 │
└─────────────────────────────────────────┘

Mobile: Single column, hero image above fold, 
CTA buttons full-width, condition cards 2×3 grid
```

---

## WF-02: Condition Pillar Page (Diabetes Example)

```
┌─────────────────────────────────────────┐
│  [Breadcrumb: Home > Conditions > Diabetes]
├─────────────────────────────────────────┤
│  HERO: "Living with Diabetes"           │
│  Subhead: empathetic 2-line             │
│  [Medical Disclaimer — Prominent Banner]│
│  "This page is educational. See your   │
│   doctor for personalized medical advice"│
├─────────────────────────────────────────┤
│  REVIEWED BY BADGE                      │
│  [Avatar] Dr. Jane Smith, RD | Nov 2025│
├─────────────────────────────────────────┤
│  TABLE OF CONTENTS (anchor links)       │
│  • What is Diabetes? • Nutrition Guide  │
│  • Movement • Emotional Wellness        │
│  • Natural Support • Find Help Near Me  │
├─────────────────────────────────────────┤
│  [SECTION: What is Diabetes?]           │
│  Plain language, no jargon, 300 words   │
│  → Link to Type 2 and Prediabetes pages │
├─────────────────────────────────────────┤
│  RECIPE CTA BANNER (inline)             │
│  "Looking for diabetes-friendly recipes │
│   that actually taste good?"            │
│  [Explore Recipes →]                   │
├─────────────────────────────────────────┤
│  [SECTION: Nutrition]                   │
│  Key foods, what to limit, tips         │
│  Recipe grid: 3 featured (condition-   │
│  tagged, culturally diverse)            │
├─────────────────────────────────────────┤
│  [SECTION: Movement]                    │
│  Exercise guidance + 3 exercise cards   │
│  (includes Level 0 seated option)       │
├─────────────────────────────────────────┤
│  [SECTION: Emotional Wellness]          │
│  Acknowledgment of burden + support     │
│  → Link to "I'm Struggling" flow (app) │
├─────────────────────────────────────────┤
│  [SECTION: Natural Support — With Caution Note]
│  "If you're considering herbs or         │
│   supplements, here's what to know first"│
│  → Link to herb safety page             │
├─────────────────────────────────────────┤
│  DOCTOR QUESTION CHECKLIST (expandable) │
│  "Questions to bring to your next visit"│
│  [Download PDF] [Share]                 │
├─────────────────────────────────────────┤
│  LOCAL RESOURCES (geo widget)           │
│  [Zip input] or "Use my location"       │
│  → 3 nearest resources shown inline    │
├─────────────────────────────────────────┤
│  RELATED ARTICLES (3)                   │
├─────────────────────────────────────────┤
│  JOIN APP CTA                           │
└─────────────────────────────────────────┘
```

---

## WF-03: Recipe Page

```
┌─────────────────────────────────────────┐
│  [Breadcrumb]                           │
├─────────────────────────────────────────┤
│  HERO IMAGE (full-width, real photo)    │
│                                         │
│  H1: Recipe Title                       │
│  [Condition Tags] [Cuisine Tag]         │
│  [Time icon] 35 min | [Cost] ~$1.85/sv │
│  [Save ♡] [Share] [Print]              │
├─────────────────────────────────────────┤
│  REVIEWED BY BADGE (if applicable)      │
├─────────────────────────────────────────┤
│  CONDITION CALLOUTS (prominent)         │
│  ✓ Diabetes-friendly — explained why   │
│  ⚠ Kidney caution — amber banner        │
│  ✓ Heart-healthy                        │
├─────────────────────────────────────────┤
│  NUTRITION SUMMARY (condition-aware)    │
│  Calories | Carbs | Sodium | Fiber      │
│  Potassium: [value] (shown for CKD flag)│
├─────────────────────────────────────────┤
│  2-COLUMN (mobile: stacked)             │
│  LEFT: Ingredients               RIGHT: │
│  [Servings adjuster]            Instruc-│
│  Ingredient list with          tions    │
│  substitution notes             Step 1  │
│                                 Step 2  │
│                                 Step 3  │
├─────────────────────────────────────────┤
│  "MAKE IT WORK FOR YOU" TIPS            │
│  Budget | Equipment-free | Time-saving  │
├─────────────────────────────────────────┤
│  RELATED RECIPES (3, same cuisine/cond) │
├─────────────────────────────────────────┤
│  SAVE THIS RECIPE CTA → App signup      │
└─────────────────────────────────────────┘

Floating: [Save to App] sticky button (mobile)
```

---

## WF-04: Local Resource Finder

```
┌─────────────────────────────────────────┐
│  H1: "Find Health Support Near You"    │
│  Subhead: non-clinical, warm            │
├─────────────────────────────────────────┤
│  SEARCH PANEL                           │
│  [ZIP code input] [Use my location]     │
│                                         │
│  Filters (expandable on mobile):        │
│  Resource type: [Dietitian ▾] [multi]  │
│  Condition: [Diabetes] [Kidney] [etc.] │
│  Insurance: [Medicaid] [Medicare] [Any]│
│  Language: [English] [Spanish] [etc.]  │
│  Free/sliding scale: [toggle]          │
│                                         │
│  [Search →]                            │
├─────────────────────────────────────────┤
│  RESULTS LIST (left) | MAP (right)      │
│                                         │
│  [Result card]                          │
│  Community Health Advocates             │
│  Dietitian | 0.8 mi away               │
│  ★ Spanish ★ Medicaid ★ Sliding scale  │
│  Specializes in: Diabetes, CKD          │
│  Mon–Fri 9am–5pm                        │
│  [View Details] [Get Directions]        │
│                                         │
│  [Result card] ...                      │
│  [Result card] ...                      │
├─────────────────────────────────────────┤
│  "Don't see what you need?"             │
│  [Suggest a resource] [Contact us]      │
└─────────────────────────────────────────┘

Mobile: Map toggleable, list default view
```

---

## WF-05: App Home Screen (Dashboard)

```
┌────────────────────────────┐
│ [Avatar] Good morning,     │
│ Marlene ☀️               │
│ [Mood check-in: 😐 😊 😄]  │
│ (inline tap, no modal)     │
├────────────────────────────┤
│ TODAY'S FOCUS              │
│ ┌──────────────────────┐  │
│ │ 🍽 Your Recipe Today │  │
│ │ [Recipe image]       │  │
│ │ Braised Collard Greens│  │
│ │ Diabetes-friendly    │  │
│ │ [View Recipe] [Save] │  │
│ └──────────────────────┘  │
│ ┌──────────────────────┐  │
│ │ 🏃 Movement for Today│  │
│ │ 10-min gentle walk  │  │
│ │ Level 1 · 10 min    │  │
│ │ [Start] [Save]       │  │
│ └──────────────────────┘  │
├────────────────────────────┤
│ 📊 YOUR WEEK AT A GLANCE  │
│ Mood avg: 😊 3.4/5        │
│ Meals logged: 12           │
│ Movement: 3 sessions       │
│ [View Full Progress →]    │
├────────────────────────────┤
│ ⚠ [I'M STRUGGLING TODAY] │
│ (always visible, warm tone)│
├────────────────────────────┤
│ QUICK EXPLORE              │
│ [Recipes] [Exercises]      │
│ [Companion] [Find Help]    │
├────────────────────────────┤
│ ━━━━━━━━━━━━━━━━━━━━━━━━  │
│ [🏠][🔍][💬][📊][👤]      │ ← bottom nav
└────────────────────────────┘
```

---

## WF-06: AI Companion Chat Screen

```
┌────────────────────────────┐
│ ← VitalRoot Companion      │
│ [Tone: Gentle ▾]           │
├────────────────────────────┤
│                            │
│  ┌─────────────────────┐  │
│  │ VitalRoot            │  │
│  │ Hi Marlene! How are  │  │
│  │ you feeling today?   │  │
│  │ I'm here to help.    │  │
│  └─────────────────────┘  │
│                            │
│            ┌─────────────┐ │
│            │ I'm a bit    │ │
│            │ tired today. │ │
│            └─────────────┘ │
│  ┌─────────────────────┐  │
│  │ That's okay — tired │  │
│  │ days are real. Would │  │
│  │ you like something   │  │
│  │ simple today? I can  │  │
│  │ suggest a quick meal │  │
│  │ or a 5-min stretch.  │  │
│  └─────────────────────┘  │
│                            │
│  QUICK ACTIONS             │
│  [🍽 Meal idea]            │
│  [🏃 Easy movement]        │
│  [💙 Just talk]            │
│  [🆘 I'm struggling]       │
├────────────────────────────┤
│ [Message input...]  [Send] │
│ [🎤 Voice] (Phase 3)      │
└────────────────────────────┘

Tone selector: Gentle / Motivated / Celebrate
(user-visible, tappable)
```

---

## WF-07: Onboarding — Condition Selection (Screen 2)

```
┌────────────────────────────┐
│ Step 2 of 10               │
│ ━━━━━━●━━━━━━━━━━━━         │
│                            │
│ "What brings you here      │
│  today?"                   │
│ (Select all that apply)    │
│                            │
│ ┌─────────────────────┐   │
│ │ 🩸 Managing Diabetes │   │
│ │    (Type 1 or 2)     │   │
│ └─────────────────────┘   │
│ ┌─────────────────────┐   │
│ │ ❤️ Heart Health      │   │
│ └─────────────────────┘   │
│ ┌─────────────────────┐   │
│ │ 🫘 Kidney Health     │   │
│ └─────────────────────┘   │
│ ┌─────────────────────┐   │
│ │ ⚖️ Weight & Wellness │   │
│ └─────────────────────┘   │
│ ┌─────────────────────┐   │
│ │ 🧠 Brain Recovery    │   │
│ └─────────────────────┘   │
│ ┌─────────────────────┐   │
│ │ 💙 Emotional Support │   │
│ └─────────────────────┘   │
│ ┌─────────────────────┐   │
│ │ 👨‍👩‍👧 I'm a Caregiver  │   │
│ └─────────────────────┘   │
│ ┌─────────────────────┐   │
│ │ 🌱 General Wellness  │   │
│ └─────────────────────┘   │
│                            │
│ [Continue →]               │
│ [Skip for now]             │
└────────────────────────────┘

Selected cards: filled green border + checkmark
Multi-select allowed
```

---

## WF-08: "I'm Struggling Today" — Entry Screen

```
┌────────────────────────────┐
│ ←                          │
│                            │
│  💙                         │
│                            │
│  "We're glad you're here." │
│                            │
│  Some days are just hard.  │
│  There's no judgment here. │
│  What's going on today?    │
│                            │
│  ○ I'm exhausted and can't │
│    do much                  │
│                            │
│  ○ I'm feeling hopeless    │
│    or really down          │
│                            │
│  ○ I had a health setback  │
│                            │
│  ○ I fell off track and    │
│    feel bad about it       │
│                            │
│  ○ Something else          │
│                            │
│                            │
│ [Continue]                 │
│ [I'd rather just talk →]  │
└────────────────────────────┘

Background: soft warm cream, no harsh colors
No timer, no urgency, spacious layout
```

---

## WF-09: Progress Dashboard

```
┌────────────────────────────┐
│ ← My Progress              │
│ [Week] [Month] tabs        │
├────────────────────────────┤
│ MOOD THIS WEEK             │
│ [Line chart: Mon–Sun]      │
│ 😐 😐 😊 😊 😄 😐 😊      │
│ Average: 3.4/5             │
├────────────────────────────┤
│ GOALS                      │
│ Move 3x/week               │
│ [Progress bar: ██████░ 3/3]│
│ ✓ Completed this week!     │
│                            │
│ Try 2 new recipes/month    │
│ [Progress bar: ████░░ 2/2] │
│ ✓ Done!                    │
├────────────────────────────┤
│ MEALS LOGGED               │
│ 12 this week               │
│ [Grid: day dots]           │
│ Mon ●●● Tue ●● Wed ●●●    │
├────────────────────────────┤
│ MOVEMENT                   │
│ 3 sessions · 45 min total  │
│ [Bar chart: days]          │
├────────────────────────────┤
│ 🎉 YOU DID IT THIS WEEK   │
│ "3 movement sessions —     │
│  that's real progress,     │
│  Marlene."                 │
│ [Share Progress] [Print]   │
└────────────────────────────┘

No weight scale. No calorie counter.
No streak-broken shame state.
Celebration state is prominent when goals met.
```

---

## WF-10: Herb Safety Page (Single Herb)

```
┌─────────────────────────────────────────┐
│  [Breadcrumb]                           │
├─────────────────────────────────────────┤
│  ⚠ DISCLAIMER BANNER (amber)           │
│  "This is educational information.      │
│   Always consult your healthcare        │
│   provider before use."                 │
├─────────────────────────────────────────┤
│  H1: Fenugreek (Methi)                  │
│  Scientific name: Trigonella foenum-    │
│  [Herb photo]                           │
│  Also known as: Methi, Greek hay       │
│  Evidence level: [●●●○○] Moderate      │
├─────────────────────────────────────────┤
│  KIDNEY DISEASE ALERT (if applicable)   │
│  🫘 Special note for kidney disease →  │
│  [Expand for CKD-specific information] │
├─────────────────────────────────────────┤
│  SECTION: Traditional Uses              │
│  SECTION: What Research Shows           │
│  SECTION: Safety & Who Should Avoid     │
│  SECTION: Drug Interactions             │
│  ┌─────────────────────────────┐       │
│  │ Drug: Metformin              │       │
│  │ Risk: Mild                   │       │
│  │ Note: May enhance blood-     │       │
│  │ sugar-lowering effects;      │       │
│  │ monitor and inform doctor    │       │
│  └─────────────────────────────┘       │
│  ┌─────────────────────────────┐       │
│  │ Drug: Warfarin               │       │
│  │ Risk: Moderate               │       │
│  │ Note: May increase bleeding  │       │
│  └─────────────────────────────┘       │
├─────────────────────────────────────────┤
│  REVIEWED BY BADGE                      │
│  [Dr. M. Chen, PharmD | Oct 2025]      │
├─────────────────────────────────────────┤
│  RELATED HERBS (3 cards)               │
│  RELATED CONDITIONS (links)             │
└─────────────────────────────────────────┘
```
