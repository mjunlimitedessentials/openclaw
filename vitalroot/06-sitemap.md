# 06 — Full Sitemap

## Public Website Sitemap

```
/ (Home)
│
├── /about
│   ├── /about/our-mission
│   ├── /about/medical-reviewers
│   ├── /about/team
│   └── /about/press
│
├── /conditions
│   ├── /conditions/diabetes
│   │   ├── /conditions/diabetes/type-2-overview
│   │   ├── /conditions/diabetes/type-1-overview
│   │   ├── /conditions/diabetes/prediabetes
│   │   ├── /conditions/diabetes/nutrition
│   │   ├── /conditions/diabetes/blood-sugar-management
│   │   ├── /conditions/diabetes/exercise
│   │   ├── /conditions/diabetes/emotional-impact
│   │   └── /conditions/diabetes/find-support-near-me
│   │
│   ├── /conditions/obesity-and-weight-health
│   │   ├── /conditions/obesity-and-weight-health/overview
│   │   ├── /conditions/obesity-and-weight-health/nutrition
│   │   ├── /conditions/obesity-and-weight-health/movement
│   │   ├── /conditions/obesity-and-weight-health/emotional-support
│   │   └── /conditions/obesity-and-weight-health/find-support-near-me
│   │
│   ├── /conditions/heart-health
│   │   ├── /conditions/heart-health/overview
│   │   ├── /conditions/heart-health/heart-disease-risk
│   │   ├── /conditions/heart-health/high-blood-pressure
│   │   ├── /conditions/heart-health/cholesterol
│   │   ├── /conditions/heart-health/nutrition
│   │   ├── /conditions/heart-health/exercise
│   │   ├── /conditions/heart-health/warfarin-and-food (vitamin K guide)
│   │   └── /conditions/heart-health/find-support-near-me
│   │
│   ├── /conditions/kidney-health
│   │   ├── /conditions/kidney-health/overview
│   │   ├── /conditions/kidney-health/ckd-stages
│   │   ├── /conditions/kidney-health/nutrition
│   │   ├── /conditions/kidney-health/potassium-guide
│   │   ├── /conditions/kidney-health/phosphorus-guide
│   │   ├── /conditions/kidney-health/sodium-guide
│   │   ├── /conditions/kidney-health/herbs-and-supplements-caution
│   │   ├── /conditions/kidney-health/dialysis-nutrition (Phase 2)
│   │   └── /conditions/kidney-health/find-support-near-me
│   │
│   └── /conditions/brain-recovery
│       ├── /conditions/brain-recovery/stroke-recovery
│       ├── /conditions/brain-recovery/tbi-overview (education only)
│       ├── /conditions/brain-recovery/cognitive-health-nutrition
│       ├── /conditions/brain-recovery/emotional-recovery
│       └── /conditions/brain-recovery/adaptive-movement
│
├── /recipes
│   ├── /recipes/[slug] (individual recipe pages)
│   │
│   ├── /recipes/condition
│   │   ├── /recipes/condition/diabetes-friendly
│   │   ├── /recipes/condition/heart-healthy
│   │   ├── /recipes/condition/kidney-safe
│   │   ├── /recipes/condition/low-sodium
│   │   └── /recipes/condition/weight-loss-support
│   │
│   ├── /recipes/cuisine
│   │   ├── /recipes/cuisine/soul-food
│   │   ├── /recipes/cuisine/caribbean
│   │   ├── /recipes/cuisine/african
│   │   ├── /recipes/cuisine/latin
│   │   ├── /recipes/cuisine/southern
│   │   ├── /recipes/cuisine/mediterranean
│   │   ├── /recipes/cuisine/asian
│   │   └── /recipes/cuisine/plant-forward
│   │
│   └── /recipes/budget
│       ├── /recipes/budget/under-3-dollars
│       ├── /recipes/budget/quick-meals
│       └── /recipes/budget/family-meals
│
├── /move
│   ├── /move/exercise/[slug] (individual exercise pages)
│   ├── /move/by-level
│   │   ├── /move/by-level/seated-bedside
│   │   ├── /move/by-level/gentle-low-impact
│   │   ├── /move/by-level/moderate
│   │   └── /move/by-level/active
│   └── /move/by-condition
│       ├── /move/by-condition/diabetes
│       ├── /move/by-condition/heart-health
│       ├── /move/by-condition/kidney-health
│       ├── /move/by-condition/post-stroke
│       └── /move/by-condition/obesity
│
├── /natural-support
│   ├── /natural-support/herbs/[slug] (individual herb pages)
│   ├── /natural-support/herb-safety-and-interactions
│   ├── /natural-support/kidney-disease-caution
│   ├── /natural-support/supplements-guide
│   └── /natural-support/reading-supplement-labels
│
├── /emotional-wellness
│   ├── /emotional-wellness/overview
│   ├── /emotional-wellness/chronic-illness-and-mental-health
│   ├── /emotional-wellness/dealing-with-setbacks
│   ├── /emotional-wellness/caregiver-support
│   └── /emotional-wellness/motivation-and-habit-change
│
├── /find-help
│   ├── /find-help (local resource finder — with zip entry)
│   └── /find-help/[state]/[city] (programmatic SEO, Phase 2)
│
├── /learn
│   ├── /learn/blog
│   │   └── /learn/blog/[slug]
│   ├── /learn/faq
│   │   ├── /learn/faq/diabetes
│   │   ├── /learn/faq/heart-health
│   │   ├── /learn/faq/kidney-health
│   │   └── /learn/faq/general
│   └── /learn/glossary (Phase 2)
│       └── /learn/glossary/[term]
│
├── /get-started (App signup landing page)
│   ├── /get-started/features
│   └── /get-started/pricing
│
└── /legal
    ├── /legal/privacy-policy
    ├── /legal/terms-of-service
    ├── /legal/medical-disclaimer
    ├── /legal/accessibility
    └── /legal/cookie-policy
```

---

## Member App Sitemap

```
/app (requires authentication)
│
├── /app/home (dashboard)
│
├── /app/explore
│   ├── /app/explore/recipes
│   │   ├── /app/explore/recipes/[id]
│   │   ├── /app/explore/recipes/saved
│   │   └── /app/explore/recipes/search
│   ├── /app/explore/exercises
│   │   ├── /app/explore/exercises/[id]
│   │   └── /app/explore/exercises/saved
│   ├── /app/explore/local
│   └── /app/explore/learn
│
├── /app/companion (AI chatbot)
│   ├── /app/companion/chat
│   └── /app/companion/history
│
├── /app/track
│   ├── /app/track/goals
│   ├── /app/track/meals
│   ├── /app/track/movement
│   ├── /app/track/mood
│   └── /app/track/progress
│
└── /app/profile
    ├── /app/profile/health
    ├── /app/profile/preferences
    ├── /app/profile/notifications
    ├── /app/profile/subscription
    └── /app/profile/settings

/onboarding (pre-auth + post-auth)
├── /onboarding/welcome
├── /onboarding/conditions
├── /onboarding/goals
├── /onboarding/food
├── /onboarding/cooking
├── /onboarding/movement
├── /onboarding/budget
├── /onboarding/motivation
├── /onboarding/communication
├── /onboarding/account
└── /onboarding/reveal

/auth
├── /auth/signin
├── /auth/signup
├── /auth/forgot-password
└── /auth/reset-password
```

---

## Programmatic SEO URL Patterns (Phase 2)

```
/recipes/[cuisine]/[condition]
  → e.g., /recipes/soul-food/diabetes-friendly
  → e.g., /recipes/caribbean/heart-healthy

/find-help/[state]/[city]
  → e.g., /find-help/texas/houston

/learn/faq/[condition]/[question-slug]
  → e.g., /learn/faq/diabetes/what-can-i-eat-for-breakfast

/natural-support/herbs/[condition-use]
  → e.g., /natural-support/herbs/blood-sugar-support

/move/[condition]/[level]
  → e.g., /move/diabetes/seated
```

---

## XML Sitemap Structure

Priority values for Google crawler:

| URL Pattern | Priority | Change Frequency |
|------------|----------|-----------------|
| / (home) | 1.0 | weekly |
| /conditions/[condition] | 0.9 | monthly |
| /recipes/[slug] | 0.8 | monthly |
| /learn/blog/[slug] | 0.8 | weekly (new content) |
| /find-help | 0.8 | weekly |
| /natural-support/herbs/[slug] | 0.7 | monthly |
| /move/[slug] | 0.7 | monthly |
| /learn/faq/* | 0.7 | monthly |
| /legal/* | 0.3 | yearly |
