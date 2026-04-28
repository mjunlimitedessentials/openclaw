# 16 — Component List

## Component Architecture

All components are React Server Components by default unless they require:
- User interaction (onClick, onChange, etc.)
- Browser APIs (geolocation, etc.)
- React hooks (useState, useEffect, etc.)

Marked with `[client]` where client component is required.

---

## Design System / Primitive Components
(`packages/ui/`)

| Component | Type | Description |
|-----------|------|-------------|
| `Button` | client | Primary, secondary, danger, ghost variants |
| `IconButton` | client | Icon-only button with label for accessibility |
| `Input` | client | Text input with label, error, help text |
| `Textarea` | client | Textarea with character count |
| `Select` | client | Dropdown select |
| `Checkbox` | client | Checkbox with label |
| `Radio` | client | Radio group |
| `Toggle` | client | Boolean toggle switch |
| `Badge` | server | Color-coded badge/tag chip |
| `Pill` | server | Rounded tag for conditions, cuisines |
| `Avatar` | server | User avatar with fallback initials |
| `Skeleton` | client | Loading placeholder |
| `Spinner` | client | Loading spinner |
| `Divider` | server | Horizontal rule with optional label |
| `Tooltip` | client | Hover tooltip |
| `Modal` | client | Accessible dialog (focus trap, ESC close) |
| `Drawer` | client | Side drawer (mobile navigation) |
| `Accordion` | client | Expandable content sections |
| `Tabs` | client | Tab navigation |
| `Toast` | client | Notification toast system |
| `Alert` | server | Inline alert: info/success/caution/danger |
| `Card` | server | Base card container |
| `AspectRatio` | server | Aspect ratio wrapper for images |
| `ProgressBar` | server | Linear progress indicator |
| `RatingStars` | client | Star rating display |
| `EmojiScale` | client | Mood emoji selector (1–5) |

---

## Layout Components
(`components/layout/`)

| Component | Type | Description |
|-----------|------|-------------|
| `PageLayout` | server | Wraps public pages: header + footer |
| `AppLayout` | server | Wraps app pages: bottom nav + header |
| `Header` | server | Public site nav with mobile menu |
| `Footer` | server | Public site footer |
| `BottomNav` | client | App bottom navigation bar |
| `AppHeader` | client | App header with back button + title |
| `Breadcrumb` | server | Breadcrumb trail |
| `SidebarLayout` | server | Two-column layout: sidebar + main |
| `ContentContainer` | server | Max-width content wrapper |
| `Section` | server | Page section with optional title |
| `Grid` | server | Responsive grid layout |

---

## SEO Components
(`components/seo/`)

| Component | Type | Description |
|-----------|------|-------------|
| `PageMeta` | server | Title, description, OG tags, canonical |
| `SchemaOrg` | server | JSON-LD schema injection |
| `RecipeSchema` | server | Recipe-specific schema.org markup |
| `FAQSchema` | server | FAQPage schema.org markup |
| `ArticleSchema` | server | MedicalWebPage schema |
| `LocalBusinessSchema` | server | LocalBusiness schema for resource pages |
| `BreadcrumbSchema` | server | BreadcrumbList schema |

---

## Content / Public Website Components
(`components/content/`)

| Component | Type | Description |
|-----------|------|-------------|
| `HeroSection` | server | Full-width hero with headline + CTA |
| `ConditionCard` | server | Icon card for condition navigator |
| `ConditionNavigator` | server | Grid of 5 condition cards |
| `ReviewedByBadge` | server | Reviewer name + date badge |
| `MedicalDisclaimer` | server | Amber/red disclaimer block |
| `ContentBlock` | server | Portable Text rich content renderer |
| `TableOfContents` | client | Scrollspy anchor navigation |
| `DoctorChecklist` | client | Expandable checklist + PDF download |
| `ArticleCard` | server | Blog article preview card |
| `ArticleGrid` | server | Grid of article cards |
| `HerbEvidenceMeter` | server | Visual evidence level indicator |
| `DrugInteractionTable` | server | Herb × drug interaction table |
| `ConditionCautionBlock` | server | Amber warning block for herb/condition |
| `KidneySpecialCaution` | server | CKD-specific red alert block |
| `ExerciseLevel` | server | Exercise level badge (0–3) |
| `ExerciseWarnings` | server | When-to-stop warning block |
| `NutritionTable` | server | Per-serving nutrition display |
| `ConditionNutritionCallout` | server | Condition-specific nutrition note |
| `RecipeSubstitutionNote` | server | Ingredient substitution tip |
| `CuisineBadge` | server | Cuisine type pill |
| `TestimonialCarousel` | client | Rotating testimonials |
| `NewsletterSignup` | client | Email capture form |

---

## Recipe Components
(`components/recipes/`)

| Component | Type | Description |
|-----------|------|-------------|
| `RecipeCard` | server | Recipe card for grids (image, title, tags, meta) |
| `RecipeSaveButton` | client | Heart save/unsave toggle |
| `RecipeGrid` | server | Masonry/grid layout of recipe cards |
| `RecipeHero` | server | Full-width recipe hero image + title |
| `RecipeIngredients` | server | Ingredient list with substitutions |
| `RecipeInstructions` | server | Step-by-step instruction list |
| `ServingsAdjuster` | client | +/- servings with quantity scaling |
| `RecipeConditionTags` | server | Condition tag pills with caution levels |
| `RecipeFilters` | client | Filter panel: condition, cuisine, time, budget |
| `RecipeSearch` | client | Search input + live results |
| `RecipePersonalizedFeed` | server | RSC: personalized recipe list |
| `RecipeBreadcrumb` | server | Recipe-specific breadcrumb |
| `MakeItWorkTips` | server | Budget/equipment/time tip blocks |
| `RelatedRecipes` | server | 3 related recipe cards |
| `RecipeAppCTA` | server | "Save this recipe" → app signup CTA |
| `PrintRecipeButton` | client | Print-optimized recipe view |

---

## Exercise Components
(`components/exercises/`)

| Component | Type | Description |
|-----------|------|-------------|
| `ExerciseCard` | server | Exercise card with level, condition tags |
| `ExerciseGrid` | server | Grid of exercise cards |
| `ExerciseDemonstration` | server | Image or embedded video |
| `ExerciseInstructions` | server | Step-by-step instructions |
| `ExerciseModifications` | server | Easier/harder modification blocks |
| `ExerciseLevelBadge` | server | Visual level 0/1/2/3 indicator |
| `ExerciseConditionTags` | server | Condition suitability tags |
| `ExerciseFilters` | client | Filter: level, condition, duration, equipment |
| `ExerciseSaveButton` | client | Save exercise toggle |
| `ExerciseLogButton` | client | Quick log completion |

---

## Local Resource Components
(`components/local/`)

| Component | Type | Description |
|-----------|------|-------------|
| `LocalResourceFinder` | client | Full finder: zip input + filters + results |
| `ZipInput` | client | Zip code input with geolocation fallback |
| `ResourceFilters` | client | Type, condition, insurance, language filters |
| `ResourceCard` | server | Resource listing card |
| `ResourceMap` | client | Map view (Leaflet.js or Google Maps) |
| `ResourceTypeTag` | server | Type pill (dietitian, support group, etc.) |
| `LanguageTag` | server | Language availability badge |
| `InsuranceTag` | server | Insurance acceptance badge |
| `ResourceDistance` | client | Distance from search point |
| `DirectionsButton` | client | Opens native maps app |
| `ResourceDetailModal` | client | Full resource detail drawer |

---

## App Components
(`apps/app/components/`)

### Onboarding

| Component | Type | Description |
|-----------|------|-------------|
| `OnboardingLayout` | client | Progress bar + step container |
| `OnboardingProgress` | client | Step indicator |
| `ConditionSelector` | client | Multi-select condition cards |
| `GoalSelector` | client | Goal selection cards |
| `CuisineSelector` | client | Cuisine preference cards |
| `ActivityLevelSelector` | client | Activity level selector |
| `BudgetSelector` | client | Budget level selector |
| `MotivationStyleSelector` | client | Motivation style cards |
| `CommunicationStyleSelector` | client | Gentle vs direct selector |

### Home / Dashboard

| Component | Type | Description |
|-----------|------|-------------|
| `DailyGreeting` | server | Personalized greeting with time + name |
| `MoodCheckIn` | client | Inline emoji mood selector |
| `TodaysRecipeCard` | server | Personalized recipe suggestion |
| `TodaysExerciseCard` | server | Personalized exercise suggestion |
| `WeekProgressSnapshot` | server | Mini stats overview |
| `QuickLinks` | server | 4 quick action tiles |
| `StrugglingButton` | client | "I'm struggling today" trigger |
| `InactivityNudge` | client | Gentle re-engagement message |

### Companion / Chatbot

| Component | Type | Description |
|-----------|------|-------------|
| `CompanionChat` | client | Full chat interface |
| `ChatMessage` | client | Individual message bubble (user/assistant) |
| `ChatInputBar` | client | Message input + send button |
| `TypingIndicator` | client | 3-dot typing animation |
| `ToneSelector` | client | Tone mode dropdown |
| `QuickActions` | client | Shortcut chips below input |
| `SafetyEscalationCard` | client | Crisis resources display |
| `ConversationHistory` | server | Past conversation list |
| `ChatDisclaimer` | server | Session-start disclaimer |

### Struggling Flow

| Component | Type | Description |
|-----------|------|-------------|
| `StrugglingFlowLayout` | client | Full-screen flow container |
| `StrugglingReasonSelect` | client | Reason selection screen |
| `MoodScore` | client | 1–5 mood score screen |
| `SafetyCheckScreen` | client | Safety screening question |
| `CrisisResourceScreen` | client | 988 + resources display |
| `EmpathyResponseScreen` | client | AI empathy response + micro-step |
| `MicroStepCard` | server | Single suggested next step |

### Tracking

| Component | Type | Description |
|-----------|------|-------------|
| `GoalProgressCard` | server | Single goal progress display |
| `GoalProgressList` | server | All goals overview |
| `MoodChart` | client | Line chart of mood over time |
| `MealLogEntry` | client | Add/view meal log entry |
| `MealLogList` | server | Meal log history |
| `MovementLogEntry` | client | Add/view movement log entry |
| `MovementLogList` | server | Movement log history |
| `ProgressSummary` | server | Weekly/monthly summary |
| `CelebrationBanner` | client | Goal achieved celebration |
| `ShareProgressButton` | client | Generate shareable summary |

### Profile

| Component | Type | Description |
|-----------|------|-------------|
| `HealthProfileForm` | client | Edit health profile |
| `ConditionManager` | client | Add/remove conditions |
| `GoalManager` | client | Manage health goals |
| `CuisinePreferences` | client | Update cuisine preferences |
| `NotificationPreferences` | client | Notification settings |
| `SubscriptionCard` | server | Subscription status + upgrade CTA |
| `DisclaimerAcknowledgment` | client | Medical disclaimer re-acknowledgment |

---

## Logic / Non-UI Components

### Personalization Engine

| Module | Description |
|--------|-------------|
| `PersonalizationContext` | User profile + conditions → recipe/exercise weights |
| `RecipeRanker` | Scores recipes against user profile for feed ordering |
| `ExerciseRecommender` | Recommends exercises based on level, condition, mood |
| `ToneDetector` | Analyzes message for tone signals (keyword + semantic) |
| `SafetyClassifier` | Detects crisis/emergency signals in user messages |
| `MoodTrendAnalyzer` | Analyzes mood history for pattern detection |
| `InactivityDetector` | Flags users inactive > N days for re-engagement |

### SEO Utilities

| Module | Description |
|--------|-------------|
| `generateSitemap` | Builds XML sitemap from all published content |
| `generateMetadata` | Next.js metadata generation for each page type |
| `buildSchemaOrg` | Constructs JSON-LD for any content type |
| `generateProgrammaticPage` | Data fetcher + page builder for programmatic SEO |
