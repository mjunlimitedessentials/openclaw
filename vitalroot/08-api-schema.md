# 08 — API Schema / Endpoint Plan

## Overview

- **Base URL:** `https://api.vitalroot.health/v1`
- **Auth:** JWT Bearer tokens (short-lived access token 15min + refresh token 7d)
- **Rate limits:** 100 req/min standard; 20 req/min chatbot streaming
- **Versioning:** URI versioning (`/v1`, `/v2`)
- **Response format:** JSON, camelCase keys
- **Error format:** `{ error: { code: string, message: string, details?: any } }`

---

## Authentication

```
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh
POST   /auth/forgot-password
POST   /auth/reset-password
POST   /auth/oauth/google
POST   /auth/oauth/apple
GET    /auth/verify-email?token=
```

### POST /auth/register
```json
Request:
{
  "email": "marlene@example.com",
  "password": "...",
  "locale": "en"
}

Response 201:
{
  "userId": "uuid",
  "accessToken": "jwt",
  "refreshToken": "jwt",
  "emailVerificationRequired": true
}
```

---

## User & Profile

```
GET    /me                           → full user + profile
PUT    /me                           → update user fields
GET    /me/profile                   → health profile
PUT    /me/profile                   → update health profile
GET    /me/conditions                → list conditions
POST   /me/conditions                → add condition
DELETE /me/conditions/:conditionKey  → remove condition
GET    /me/goals                     → list goals
POST   /me/goals                     → create goal
PUT    /me/goals/:goalId             → update goal
DELETE /me/goals/:goalId             → remove goal
GET    /me/cuisine-preferences       → list preferences
PUT    /me/cuisine-preferences       → bulk update preferences
```

### PUT /me/profile — Request
```json
{
  "displayName": "Marlene",
  "activityLevel": "light",
  "cookingSkill": "home_cook",
  "budgetLevel": "moderate",
  "motivationStyle": "gentle",
  "communicationStyle": "gentle"
}
```

---

## Recipes

```
GET    /recipes                      → paginated recipe list (filters: condition, cuisine, budget, quick, dietaryTags)
GET    /recipes/:slug                → single recipe detail
GET    /recipes/personalized         → personalized feed for authenticated user
GET    /recipes/search?q=            → text + semantic search
POST   /recipes/:id/save             → save recipe (auth required)
DELETE /recipes/:id/save             → unsave recipe
GET    /me/saved-recipes             → user's saved recipes
```

### GET /recipes — Query Parameters

| Param | Type | Example |
|-------|------|---------|
| `condition` | string[] | `diabetes_friendly,heart_healthy` |
| `cuisine` | string[] | `soul_food,caribbean` |
| `maxCostUsd` | number | `3.00` |
| `maxTotalMin` | number | `30` |
| `isFamilySize` | boolean | `true` |
| `page` | integer | `1` |
| `limit` | integer | `20` |
| `sort` | string | `relevance` \| `newest` \| `cost_asc` |

### GET /recipes/:slug — Response
```json
{
  "id": "uuid",
  "slug": "diabetes-friendly-braised-collard-greens",
  "title": "Braised Collard Greens (Diabetes-Friendly)",
  "description": "...",
  "cuisineKey": "soul_food",
  "prepTimeMin": 10,
  "cookTimeMin": 25,
  "servings": 4,
  "costPerServingUsd": 1.85,
  "difficulty": "beginner",
  "heroImageUrl": "https://cdn.vitalroot.health/...",
  "ingredients": [
    {
      "name": "Collard greens",
      "amount": "1",
      "unit": "bunch",
      "substitutionNote": "Kale or turnip greens also work well"
    }
  ],
  "instructions": [
    { "step": 1, "text": "Wash and de-stem the collard greens..." }
  ],
  "nutritionPerServing": {
    "caloriesKcal": 95,
    "carbsG": 12,
    "proteinG": 4,
    "fatG": 3,
    "sodiumMg": 210,
    "potassiumMg": 310,
    "fiberG": 5
  },
  "conditionTags": [
    { "conditionKey": "diabetes_friendly", "cautionLevel": "safe" },
    { "conditionKey": "heart_healthy", "cautionLevel": "safe" },
    { "conditionKey": "kidney_safe", "cautionLevel": "caution", "cautionNote": "Moderate potassium — consult your dietitian for your specific stage." }
  ],
  "reviewedBy": "Dr. A. Washington, RD",
  "reviewedAt": "2025-11-15",
  "isBudgetFriendly": true,
  "isQuick": false,
  "isFamilySize": true,
  "isSaved": false
}
```

---

## Exercises

```
GET    /exercises                    → paginated list (filters: level, condition)
GET    /exercises/:slug              → single exercise
GET    /exercises/personalized       → personalized feed
POST   /exercises/:id/save           → save
DELETE /exercises/:id/save           → unsave
GET    /me/saved-exercises           → saved exercises
```

### GET /exercises — Query Parameters

| Param | Type | Example |
|-------|------|---------|
| `level` | integer[] | `0,1` |
| `condition` | string[] | `diabetes,heart_health` |
| `maxDurationMin` | integer | `15` |
| `equipmentFree` | boolean | `true` |

---

## Herbs & Natural Support

```
GET    /herbs                        → paginated list
GET    /herbs/:slug                  → single herb detail
GET    /herbs/search?q=              → search herbs
GET    /herbs/condition/:conditionKey → herbs tagged for condition
```

### GET /herbs/:slug — Response
```json
{
  "id": "uuid",
  "slug": "fenugreek",
  "commonName": "Fenugreek",
  "scientificName": "Trigonella foenum-graecum",
  "otherNames": ["Methi", "Greek hay"],
  "description": "...",
  "traditionalUses": "...",
  "researchSummary": "...",
  "evidenceLevel": "moderate",
  "safetySummary": "Generally well-tolerated at culinary doses...",
  "contraindications": ["pregnancy", "blood_thinner_use"],
  "kidneyRiskLevel": "low",
  "kidneyNote": "Limited data; use cautiously if you have CKD.",
  "drugInteractions": [
    {
      "drugName": "Metformin",
      "interactionSeverity": "mild",
      "description": "May enhance blood sugar lowering effect; monitor blood sugar closely and inform your doctor."
    },
    {
      "drugName": "Warfarin",
      "interactionSeverity": "moderate",
      "description": "May increase bleeding risk. Consult your doctor before use."
    }
  ],
  "disclaimer": "This information is educational only and does not constitute medical advice. Always consult your healthcare provider before starting any supplement.",
  "reviewedBy": "Dr. M. Chen, PharmD",
  "reviewedAt": "2025-10-20"
}
```

---

## Local Resources

```
GET    /local-resources              → search by zip, type, condition
GET    /local-resources/:id          → resource detail
POST   /local-resources/suggest      → community submission (Phase 3)
```

### GET /local-resources — Query Parameters

| Param | Type | Required | Example |
|-------|------|----------|---------|
| `zip` | string | yes | `77001` |
| `type` | string[] | no | `dietitian,support_group` |
| `condition` | string[] | no | `diabetes,ckd` |
| `maxDistanceMiles` | integer | no | `10` |
| `acceptsMedicaid` | boolean | no | `true` |
| `language` | string[] | no | `es` |
| `free` | boolean | no | `true` |

### GET /local-resources — Response
```json
{
  "results": [
    {
      "id": "uuid",
      "name": "Community Health Advocates",
      "resourceType": "dietitian",
      "address": "1234 Main St, Los Angeles, CA 90022",
      "distanceMiles": 0.8,
      "phone": "323-555-0100",
      "websiteUrl": "https://...",
      "languages": ["en", "es"],
      "acceptsMedicaid": true,
      "free": false,
      "slidingScale": true,
      "conditionsServed": ["diabetes", "ckd", "obesity"],
      "hours": {"mon": "9am-5pm", "tue": "9am-5pm"},
      "description": "..."
    }
  ],
  "total": 12,
  "page": 1
}
```

---

## AI Companion (Chatbot)

```
POST   /companion/conversations          → start new conversation
GET    /companion/conversations          → list past conversations
GET    /companion/conversations/:id      → conversation detail + messages
POST   /companion/conversations/:id/messages  → send message (streaming SSE)
PUT    /companion/conversations/:id/tone → update tone mode
DELETE /companion/conversations/:id     → delete conversation
POST   /companion/feedback              → thumbs up/down on message
```

### POST /companion/conversations/:id/messages

Streaming response via Server-Sent Events (SSE).

Request:
```json
{
  "content": "I'm feeling really discouraged today. I keep failing at this.",
  "toneMode": "empathy"
}
```

Response stream (SSE):
```
data: {"type":"tone_detected","tone":"sadness_aware"}
data: {"type":"delta","content":"What you're feeling makes complete sense."}
data: {"type":"delta","content":" Changing habits is genuinely hard,"}
data: {"type":"delta","content":" especially when you're managing a health condition."}
data: {"type":"safety_check","level":"none"}
data: {"type":"done","messageId":"uuid","safetyFlagged":false}
```

Safety-triggered response:
```
data: {"type":"safety_triggered","level":"crisis","resources":["988","crisis_text_line"]}
data: {"type":"delta","content":"Thank you for sharing that with me..."}
```

---

## Tracking & Progress

```
POST   /tracking/mood                → log mood check-in
GET    /tracking/mood                → mood history (date range)
POST   /tracking/meals               → log meal
GET    /tracking/meals               → meal history
POST   /tracking/movement            → log movement
GET    /tracking/movement            → movement history
GET    /tracking/progress            → weekly/monthly summary
```

### GET /tracking/progress — Response
```json
{
  "period": "week",
  "startDate": "2026-04-21",
  "endDate": "2026-04-27",
  "moodAverage": 3.4,
  "mealLogsCount": 12,
  "movementLogsCount": 3,
  "totalMovementMin": 45,
  "goalsProgress": [
    {
      "goalType": "move_more",
      "targetValue": 3,
      "targetUnit": "sessions_per_week",
      "currentValue": 3,
      "percentComplete": 100
    }
  ],
  "streakDays": 5,
  "celebrationEligible": true
}
```

---

## Notifications

```
GET    /notifications                → list notifications
PUT    /notifications/:id/read       → mark as read
PUT    /notifications/read-all       → mark all read
PUT    /me/notification-preferences  → update preferences
```

---

## Admin Endpoints (internal, role-restricted)

```
GET    /admin/users                  → user list with filters
GET    /admin/users/:id              → user detail
PUT    /admin/users/:id/subscription → update subscription
GET    /admin/safety-events          → review flagged events
PUT    /admin/safety-events/:id/reviewed → mark reviewed
GET    /admin/content/recipes        → all recipes including drafts
POST   /admin/content/recipes        → create recipe
PUT    /admin/content/recipes/:id    → update recipe
DELETE /admin/content/recipes/:id    → soft delete
GET    /admin/analytics              → platform analytics summary
```

---

## Webhook Events (inbound from Sanity CMS)

```
POST   /webhooks/sanity              → content sync trigger
```

Payload:
```json
{
  "documentId": "sanity_doc_id",
  "type": "recipe",
  "operation": "create" | "update" | "delete",
  "secret": "webhook_signing_secret"
}
```
