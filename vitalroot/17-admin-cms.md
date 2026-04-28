# 17 — Admin CMS Structure

## CMS Philosophy

VitalRoot's CMS is designed for **non-technical content staff**: dietitians, health educators, community managers, and SEO writers who should never need to touch code. The CMS must enforce safety through structure — required fields, validation rules, and publish gating that prevent dangerous content from going live accidentally.

**Platform:** Sanity.io (Studio v3)
**Admin panel:** Custom Next.js `/admin` routes for operational tasks not handled by Sanity

---

## Sanity Studio Structure

### Document Types (Schema List)

```
Content Library
├── Recipes
├── Exercises
├── Herbs & Natural Support
├── Condition Pages
├── Blog Articles
│
Education & Support
├── FAQ Entries
├── Glossary Terms (Phase 2)
│
App Content
├── Motivation Prompts
├── Chatbot Guardrails
├── Struggling Flow Scripts
│
Resource Directory
├── Local Resources
│
Configuration
├── Site Settings
├── Medical Reviewers
├── Cuisine Categories
├── Condition Categories
├── Crisis Resources
```

---

## Schema Definitions

### Recipe Schema (Sanity)

```javascript
// sanity/schemas/recipe.ts
{
  name: 'recipe',
  type: 'document',
  title: 'Recipe',
  groups: [
    { name: 'basics', title: 'Basic Info' },
    { name: 'content', title: 'Recipe Content' },
    { name: 'nutrition', title: 'Nutrition & Health' },
    { name: 'seo', title: 'SEO' },
    { name: 'review', title: 'Review & Publishing' },
  ],
  fields: [
    // BASICS
    { name: 'title', type: 'string', group: 'basics', validation: Rule => Rule.required() },
    { name: 'slug', type: 'slug', source: 'title', group: 'basics', validation: Rule => Rule.required() },
    { name: 'description', type: 'text', group: 'basics', rows: 3 },
    { name: 'heroImage', type: 'image', group: 'basics', options: { hotspot: true }, validation: Rule => Rule.required() },
    { name: 'cuisineCategory', type: 'reference', to: [{ type: 'cuisineCategory' }], group: 'basics', validation: Rule => Rule.required() },
    { name: 'difficulty', type: 'string', options: { list: ['beginner', 'home_cook', 'experienced'] }, group: 'basics' },
    { name: 'prepTimeMin', type: 'number', group: 'basics' },
    { name: 'cookTimeMin', type: 'number', group: 'basics' },
    { name: 'servings', type: 'number', group: 'basics' },
    { name: 'costPerServingUsd', type: 'number', group: 'basics' },
    { name: 'isBudgetFriendly', type: 'boolean', group: 'basics' },
    { name: 'isQuick', type: 'boolean', group: 'basics' },
    { name: 'isFamilySize', type: 'boolean', group: 'basics' },

    // CONTENT
    { name: 'ingredients', type: 'array', of: [{ type: 'ingredient' }], group: 'content', validation: Rule => Rule.required().min(1) },
    { name: 'instructions', type: 'array', of: [{ type: 'instructionStep' }], group: 'content' },
    { name: 'makeItWorkTips', type: 'object', fields: [
      { name: 'budget', type: 'text' },
      { name: 'equipment', type: 'text' },
      { name: 'timeSaving', type: 'text' },
    ], group: 'content' },

    // NUTRITION & HEALTH
    { name: 'conditionTags', type: 'array', of: [{ type: 'conditionTag' }], group: 'nutrition' },
    { name: 'nutritionPerServing', type: 'object', group: 'nutrition', fields: [
      { name: 'caloriesKcal', type: 'number' },
      { name: 'carbsG', type: 'number' },
      { name: 'proteinG', type: 'number' },
      { name: 'fatG', type: 'number' },
      { name: 'sodiumMg', type: 'number' },
      { name: 'potassiumMg', type: 'number', description: 'REQUIRED if any kidney condition tag is set' },
      { name: 'phosphorusMg', type: 'number', description: 'REQUIRED if any kidney condition tag is set' },
      { name: 'fiberG', type: 'number' },
    ],
    validation: Rule => Rule.custom((nutrition, context) => {
      const conditionTags = context.document?.conditionTags || [];
      const hasKidneyTag = conditionTags.some(t => t.conditionKey?.includes('kidney'));
      if (hasKidneyTag && !nutrition?.potassiumMg) {
        return 'Potassium (mg) is required for recipes with kidney condition tags';
      }
      return true;
    }) },

    // SEO
    { name: 'seoTitle', type: 'string', group: 'seo', validation: Rule => Rule.max(60) },
    { name: 'seoDescription', type: 'text', group: 'seo', rows: 2, validation: Rule => Rule.max(155) },

    // REVIEW
    { name: 'reviewedBy', type: 'reference', to: [{ type: 'medicalReviewer' }], group: 'review' },
    { name: 'reviewedAt', type: 'date', group: 'review' },
    {
      name: 'status',
      type: 'string',
      options: { list: ['draft', 'review', 'published', 'archived'] },
      group: 'review',
      initialValue: 'draft',
      validation: Rule => Rule.custom((status, context) => {
        if (status === 'published') {
          // Check that medical condition pages have reviewer
          const conditionTags = context.document?.conditionTags || [];
          if (conditionTags.length > 0 && !context.document?.reviewedBy) {
            return 'A medical reviewer is required to publish this recipe with condition tags';
          }
        }
        return true;
      })
    },
  ]
}
```

### Herb Schema (Sanity)

```javascript
{
  name: 'herb',
  type: 'document',
  fields: [
    { name: 'commonName', type: 'string', validation: Rule => Rule.required() },
    { name: 'slug', type: 'slug', source: 'commonName', validation: Rule => Rule.required() },
    { name: 'scientificName', type: 'string' },
    { name: 'otherNames', type: 'array', of: [{ type: 'string' }] },
    { name: 'heroImage', type: 'image' },
    { name: 'description', type: 'text' },
    { name: 'traditionalUses', type: 'blockContent' },
    { name: 'researchSummary', type: 'blockContent' },
    {
      name: 'evidenceLevel',
      type: 'string',
      options: { list: ['strong', 'moderate', 'limited', 'anecdotal', 'insufficient'] },
      validation: Rule => Rule.required()
    },
    {
      name: 'kidneyRiskLevel',
      type: 'string',
      options: { list: ['none', 'low', 'moderate', 'high', 'unknown'] },
      validation: Rule => Rule.required(),
      description: 'ALWAYS fill this field. If unknown, select unknown. Do not leave blank.'
    },
    { name: 'kidneyNote', type: 'text', description: 'Required if kidney risk is moderate or high' },
    { name: 'safetySummary', type: 'blockContent' },
    { name: 'contraindications', type: 'array', of: [{ type: 'string' }] },
    { name: 'drugInteractions', type: 'array', of: [{ type: 'drugInteraction' }] },
    { name: 'reviewedBy', type: 'reference', to: [{ type: 'medicalReviewer' }], validation: Rule => Rule.required() },
    { name: 'reviewedAt', type: 'date', validation: Rule => Rule.required() },
    {
      name: 'status',
      type: 'string',
      options: { list: ['draft', 'published', 'archived'] },
      validation: Rule => Rule.custom((status, context) => {
        if (status === 'published') {
          if (!context.document?.reviewedBy) return 'A clinical reviewer is required to publish herb pages';
          if (!context.document?.kidneyRiskLevel) return 'Kidney risk level must be set before publishing';
        }
        return true;
      })
    },
  ]
}
```

### Chatbot Guardrail Schema (Sanity)

```javascript
// Admin-editable chatbot copy — no code deploy needed
{
  name: 'chatbotGuardrail',
  type: 'document',
  title: 'Chatbot Guardrails',
  // Singleton document
  fields: [
    { name: 'disclaimerSuffix', type: 'text', title: 'Standard Disclaimer Suffix', description: 'Appended to all condition-specific advice' },
    { name: 'herbSupplementCaveat', type: 'text', title: 'Herb/Supplement Caveat', description: 'Appended to all herb/supplement responses' },
    { name: 'kidneyExtraCaution', type: 'text', title: 'Kidney Disease Extra Caution', description: 'Injected for CKD users asking about herbs/supplements' },
    { name: 'medicalEmergencyPrompt', type: 'text', title: 'Medical Emergency Response' },
    { name: 'crisisResources', type: 'array', title: 'Crisis Resources', of: [{
      type: 'object',
      fields: [
        { name: 'name', type: 'string' },
        { name: 'contact', type: 'string' },
        { name: 'available', type: 'string' },
      ]
    }]},
    { name: 'lastUpdatedBy', type: 'string' },
    { name: 'lastUpdatedAt', type: 'datetime' },
  ]
}
```

### Motivation Prompt Schema

```javascript
{
  name: 'motivationPrompt',
  type: 'document',
  fields: [
    { name: 'toneMode', type: 'string', options: { list: ['gentle', 'accountability', 'celebration', 'recovery', 'empathy', 'sadness_aware'] }, validation: Rule => Rule.required() },
    { name: 'trigger', type: 'string', options: { list: ['inactivity_7d', 'goal_achieved', 'setback', 'reengagement', 'morning_checkin', 'mood_low'] } },
    { name: 'conditionContext', type: 'string', options: { list: ['diabetes', 'heart', 'kidney', 'obesity', 'brain_recovery', 'general'] } },
    { name: 'promptText', type: 'text', validation: Rule => Rule.required().max(300) },
    { name: 'isActive', type: 'boolean', initialValue: true },
  ]
}
```

---

## Custom Admin Panel (`/admin`)

Built in Next.js, protected by admin role JWT. Handles operational tasks beyond CMS content:

### Admin Sections

```
/admin
├── /admin/dashboard        → Platform analytics overview
├── /admin/users
│   ├── List + search + filter
│   ├── User detail (profile, conditions, subscription)
│   └── Subscription management
├── /admin/safety
│   ├── Safety event log (anonymized)
│   ├── Mark as reviewed
│   └── Pattern reports
├── /admin/content
│   ├── CMS sync status (webhook log)
│   └── Manual sync trigger
├── /admin/local-resources
│   ├── Resource list + CRUD
│   ├── Bulk import (CSV)
│   └── Verification management
└── /admin/chatbot
    ├── Conversation quality review (sampled, anonymized)
    ├── Tone drift monitoring
    └── Safety trigger log
```

### Safety Dashboard (Admin)

```
Safety Events — Last 30 Days

SUMMARY
├── crisis_ideation events: 12 (reviewed: 12 ✓)
├── medical_emergency events: 3 (reviewed: 3 ✓)
├── hopelessness_signal events: 47 (reviewed: 47 ✓)
└── escalation_accepted: 8 of 15 offered (53%)

OPEN FOR REVIEW: 0

RECENT EVENTS (last 7 days)
[Date] [Type: hopelessness_signal] [User: anon] [Reviewed: ✓]
[Date] [Type: crisis_ideation]     [User: anon] [Reviewed: ✓]
```

---

## CMS Roles & Permissions

| Role | Can Access | Can Publish |
|------|-----------|------------|
| Content Writer | Recipes, Blog, FAQ, Motivation Prompts | No (draft only) |
| Health Editor | All content types | Yes (after reviewer set) |
| Medical Reviewer | Condition pages, Herbs, Exercises | Can set reviewed_by field |
| CMS Admin | All + site settings, guardrails | Yes |
| Operations | Admin panel only (no Sanity) | N/A |
| Super Admin | Everything | Yes |

---

## Content Workflow

```
Draft → In Review → Ready for Clinical Review → Approved → Published → Archived

Writer creates draft
    ↓
Editor reviews for tone, accuracy, cultural sensitivity
    ↓
For condition/herb content: Medical Reviewer sets reviewed_by + reviewed_at
    ↓
Publish validation runs (required fields check, kidney fields check)
    ↓
Published to site (webhook triggers ISR revalidation)
    ↓
Every 6 months: scheduled review flag set → editor/reviewer re-approves
```

---

## SEO Metadata Template (Per Content Type)

For each content type, CMS enforces these SEO fields:

| Field | Max Length | Notes |
|-------|-----------|-------|
| `seoTitle` | 60 chars | Counter shown in CMS; auto-draft from title |
| `seoDescription` | 155 chars | Counter shown; required for publish |
| `canonicalUrl` | — | Auto-set; override for cross-posting |
| `ogImage` | — | Defaults to hero image; can override |
| `noIndex` | boolean | For pages we don't want indexed (internal) |
| `schemaType` | enum | Recipe / Article / FAQPage / MedicalWebPage |

CMS shows real-time SERP preview for title + description as staff types.
