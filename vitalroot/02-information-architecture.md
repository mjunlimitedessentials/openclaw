# 02 — Information Architecture

## Public Website IA

### Navigation Structure (Primary)

```
VitalRoot Health
├── Home
├── Conditions ▾
│   ├── Diabetes Support
│   ├── Obesity & Weight Health
│   ├── Heart Health
│   ├── Kidney Health
│   └── Brain Recovery & Neurological Support
├── Recipes & Food ▾
│   ├── Recipe Hub
│   ├── Cuisine Explorer
│   ├── Meal Planning Guide
│   └── Budget-Friendly Meals
├── Move Your Body ▾
│   ├── Exercise by Level
│   ├── Exercise by Condition
│   └── Adaptive & Seated Movement
├── Natural Support ▾
│   ├── Herbs & Natural Remedies Hub
│   ├── Herb Safety & Drug Interactions
│   └── Supplements Guide
├── Emotional Wellness ▾
│   ├── Motivation & Mindset Hub
│   ├── Dealing with Setbacks
│   └── Caregiver Support
├── Find Help Near Me
├── Learn ▾
│   ├── Blog / Learning Center
│   ├── FAQ
│   └── Glossary
└── Get Started (CTA → App signup)
```

### Footer Navigation

```
Footer
├── About VitalRoot
├── Our Medical Reviewers
├── Privacy Policy
├── Terms of Service
├── Medical Disclaimer
├── Accessibility Statement
├── Contact Us
├── Press
└── Careers
```

---

## Page-Level Content Structure

### Home Page
- Hero: Empathetic headline + subheadline + dual CTA (Join Free / Explore Conditions)
- Condition navigator (icon cards for 5 primary conditions)
- "What makes VitalRoot different" (3-column value props)
- Featured recipes (cuisine-diverse, condition-tagged)
- "How it works" (3-step: Profile → Personalize → Grow)
- Testimonial carousel (diverse representation required)
- Find Help Near Me teaser (location input)
- Blog/Learning Center preview (3 recent articles)
- App download CTA (sticky mobile bottom bar)

### Condition Pages (Template — repeated for each condition)
```
/conditions/[condition-slug]/
├── Hero: condition name + empathetic opening + disclaimer
├── What is [condition]? (plain language, reviewed)
├── Common symptoms and experiences
├── How nutrition affects [condition]
│   └── → Links to condition-filtered recipes
├── Movement and activity guidance
│   └── → Links to condition-filtered exercises
├── Emotional impact of living with [condition]
├── Natural support (with safety caveats)
│   └── → Links to herb safety page
├── Questions to ask your doctor (downloadable checklist)
├── Local resources near you (geo widget)
├── Related articles from Learning Center
├── Medical review badge + reviewer name + date
└── Medical disclaimer (prominent, always visible)
```

### Recipe Hub
```
/recipes/
├── Search bar (ingredient, cuisine, condition filter)
├── Featured recipe of the week
├── Browse by condition
│   ├── Diabetes-friendly
│   ├── Heart-healthy
│   ├── Kidney-caution (special disclaimer)
│   ├── Weight-loss support
│   └── Low-sodium
├── Browse by cuisine
│   ├── Soul Food
│   ├── Caribbean
│   ├── African
│   ├── Latin
│   ├── Southern
│   ├── Mediterranean
│   ├── Asian
│   └── Plant-Forward
├── Browse by time/budget
│   ├── Under 30 minutes
│   ├── Budget meals (under $3/serving)
│   └── Family meals
└── Individual Recipe Page Template:
    ├── Recipe name + hero image
    ├── Condition tags + cuisine tag
    ├── Nutrition summary (condition-aware callouts)
    ├── Ingredients list (with substitution notes)
    ├── Step-by-step instructions
    ├── "Make it work for you" tips (budget, skill, equipment)
    ├── Related recipes
    ├── Save to my recipes (→ App CTA)
    └── Schema markup: Recipe, FAQPage
```

### Exercise Hub
```
/move/
├── Browse by fitness level
│   ├── Seated / Bedside (Level 0)
│   ├── Gentle / Low-impact (Level 1)
│   ├── Moderate (Level 2)
│   └── Active (Level 3)
├── Browse by condition
├── Adaptive movement guide
├── Before you start (safety disclaimer for exercise)
└── Individual Exercise Page:
    ├── Exercise name + demonstration (image or video embed)
    ├── Level indicator
    ├── Condition suitability tags
    ├── Step-by-step instructions
    ├── Modifications (easier / harder)
    ├── When to stop / warning signs
    └── Related exercises
```

### Herbs & Natural Support Hub
```
/natural-support/
├── Intro + umbrella safety disclaimer (prominent, always)
├── Browse herbs A–Z
├── Browse by common use (e.g., blood sugar support, stress)
├── Herb Safety & Drug Interactions (dedicated page)
│   ├── Kidney disease caution section (prominent)
│   ├── Common drug interactions
│   └── "Ask your doctor" checklist
├── What to look for on supplement labels
└── Individual Herb Page:
    ├── Herb name + photo
    ├── Traditional uses
    ├── What research says (evidence level labeled)
    ├── Safety concerns + contraindications
    ├── Kidney disease flag (if applicable)
    ├── Drug interactions list
    ├── Medical review badge
    └── Disclaimer
```

---

## Member App IA

### App Navigation (Bottom Tab Bar — Mobile)

```
[Home] [Explore] [Companion] [Track] [Profile]
```

### Home Tab
```
Home
├── Daily greeting (personalized, mood-aware)
├── Today's suggested meal (condition + cuisine matched)
├── Movement suggestion for today
├── Mood check-in prompt (quick: emoji scale)
├── Progress snapshot (weekly view)
├── Quick links: Recipes | Exercises | Companion
└── "I'm struggling today" button (always visible)
```

### Explore Tab
```
Explore
├── Recipe discovery
│   ├── Personalized feed (condition + cuisine)
│   ├── Search + filter
│   └── Saved recipes
├── Exercise library
│   ├── Personalized feed (level + condition)
│   └── Saved exercises
├── Local resources
│   └── → Local finder (see 18-local-resource-finder.md)
├── Learning Center (curated articles)
└── Herb & natural support guide
```

### Companion Tab (AI Chatbot)
```
Companion
├── Chat interface (streaming, multi-turn)
├── Tone selector (user-visible: Gentle / Motivated / Celebrate)
├── Quick action shortcuts:
│   ├── "Help me plan a meal"
│   ├── "I need encouragement"
│   ├── "What exercise can I do today?"
│   ├── "I'm struggling today"
│   └── "Find help near me"
├── Conversation history (last 30 days)
└── Safety escalation trigger (auto or manual "Get Help Now")
```

### Track Tab
```
Track
├── Goal overview (condition-specific goals, user-set)
├── Meal log (manual or recipe-linked)
├── Movement log (manual or exercise-linked)
├── Mood history (chart, 30 days)
├── Check-in streak (compassion-framed: "X days this month")
├── Notes / journal
└── Progress report (weekly, shareable with care team)
```

### Profile Tab
```
Profile
├── Health profile (conditions, goals, preferences)
├── Cuisine preferences
├── Motivation style settings
├── Notification preferences
├── Family/caregiver mode (Phase 2)
├── Subscription management
├── Privacy & data controls
├── Medical disclaimer acknowledgment
└── Account settings
```

### Onboarding Flow (First-Time App)
```
Onboarding (8–12 screens, skippable after screen 3)
├── Welcome + brand intro (screen 1)
├── "What brings you here today?" (conditions, multi-select) (screen 2)
├── "What matters most to you right now?" (goals) (screen 3)
├── --- Skip option appears here ---
├── Food & cuisine preferences (screen 4)
├── Cooking skill + kitchen setup (screen 5)
├── Activity level + mobility (screen 6)
├── Budget comfort level (screen 7)
├── How do you like to be supported? (motivation style) (screen 8)
├── How do you prefer communication? (gentle vs direct) (screen 9)
├── Account creation or guest mode (screen 10)
└── Personalized home reveal (screen 11)
```
