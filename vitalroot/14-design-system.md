# 14 — Design System

## Design Philosophy

VitalRoot's visual design is **calm, warm, and premium** — not sterile medical white or trendy wellness pastel. It feels like an inviting kitchen or a trusted community health center. It communicates: *you are safe here, this is real, and we see you.*

Anti-patterns to actively avoid:
- Generic stock photos of smiling white people eating salad
- Neon green "healthy" palettes that feel more fitness app than health companion
- Clinical blues and whites that signal hospital, not support
- Weight loss before/after imagery
- Fitness influencer aesthetics

---

## Color System

### Primary Palette

```css
/* Deep Forest Green — primary brand, trust, vitality */
--color-primary-900: #1B4332;
--color-primary-800: #2D6A4F;
--color-primary-700: #40916C;
--color-primary-600: #52B788;  /* Primary interactive (buttons, links) */
--color-primary-500: #74C69D;
--color-primary-400: #95D5B2;
--color-primary-300: #B7E4C7;
--color-primary-200: #D8F3DC;
--color-primary-100: #EDF7F1;  /* Surface backgrounds */
--color-primary-50:  #F6FBF7;
```

```css
/* Warm Earth — secondary, food, warmth */
--color-secondary-900: #7B4E24;
--color-secondary-800: #9E6430;
--color-secondary-700: #C27B3C;
--color-secondary-600: #D4924E;  /* Secondary interactive accent */
--color-secondary-500: #E0A96A;
--color-secondary-400: #ECC08A;
--color-secondary-300: #F2D4AA;
--color-secondary-200: #F7E7CC;
--color-secondary-100: #FBF3E7;
--color-secondary-50:  #FEF9F4;
```

```css
/* Warm Gray — neutral text, structure */
--color-neutral-950: #1A1A18;  /* Primary text */
--color-neutral-800: #3A3A36;  /* Secondary text */
--color-neutral-600: #6B6B66;  /* Tertiary text, labels */
--color-neutral-400: #A0A09C;  /* Placeholder, disabled */
--color-neutral-200: #D8D8D4;  /* Dividers */
--color-neutral-100: #F0F0EE;  /* Background */
--color-neutral-50:  #F8F8F7;  /* Page background */
```

```css
/* Semantic Colors */
--color-success:     #2D6A4F;  /* Matches primary-800 for consistency */
--color-caution:     #D97706;  /* Amber — herb caution, kidney warning */
--color-danger:      #B91C1C;  /* Red — crisis alerts, avoid flags */
--color-info:        #1D4ED8;  /* Blue — informational callouts */
--color-crisis-bg:   #FEF2F2;  /* Light red bg for safety alerts */
--color-caution-bg:  #FFFBEB;  /* Light amber bg for caution blocks */
```

---

## Typography

### Font Stack

```css
/* Primary: humanist serif for headings — warmth and trust */
--font-heading: 'DM Serif Display', 'Georgia', serif;

/* Secondary: clean sans-serif for body — readability */
--font-body: 'Inter', 'Helvetica Neue', system-ui, sans-serif;

/* Monospace: for data displays, nutrition values */
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

**Font choices rationale:**
- DM Serif Display: Premium but approachable; editorial, not corporate
- Inter: Best-in-class legibility; WCAG AA compliant at small sizes
- Both available on Google Fonts (zero cost)

### Type Scale

```css
--text-xs:   0.75rem  / 12px  line-height: 1.5
--text-sm:   0.875rem / 14px  line-height: 1.5
--text-base: 1rem     / 16px  line-height: 1.7  /* body default */
--text-lg:   1.125rem / 18px  line-height: 1.6
--text-xl:   1.25rem  / 20px  line-height: 1.5
--text-2xl:  1.5rem   / 24px  line-height: 1.4
--text-3xl:  1.875rem / 30px  line-height: 1.3
--text-4xl:  2.25rem  / 36px  line-height: 1.2
--text-5xl:  3rem     / 48px  line-height: 1.1
--text-6xl:  3.75rem  / 60px  line-height: 1.05  /* hero headlines */
```

### Type Usage Rules

| Element | Font | Weight | Size |
|---------|------|--------|------|
| H1 Hero | DM Serif Display | 400 | 4xl–6xl |
| H1 Page | DM Serif Display | 400 | 3xl–4xl |
| H2 Section | DM Serif Display | 400 | 2xl–3xl |
| H3 Subsection | Inter | 600 (semibold) | xl–2xl |
| H4 | Inter | 600 | lg |
| Body text | Inter | 400 | base (16px) |
| Caption/label | Inter | 400 | sm |
| Badge/tag | Inter | 500 | xs |
| Button | Inter | 600 | sm–base |
| Nutrition value | JetBrains Mono | 400 | sm–base |

**Minimum body text size:** 16px (never below for main content)
**Line height:** 1.7 for body text (readability for users with cognitive conditions)

---

## Spacing System

8px base unit:

```css
--space-1:  0.25rem /  4px
--space-2:  0.5rem  /  8px
--space-3:  0.75rem / 12px
--space-4:  1rem    / 16px
--space-5:  1.25rem / 20px
--space-6:  1.5rem  / 24px
--space-8:  2rem    / 32px
--space-10: 2.5rem  / 40px
--space-12: 3rem    / 48px
--space-16: 4rem    / 64px
--space-20: 5rem    / 80px
--space-24: 6rem    / 96px
```

---

## Border Radius

```css
--radius-sm:   4px    /* inputs, small badges */
--radius-md:   8px    /* cards, modals */
--radius-lg:   12px   /* large cards, image containers */
--radius-xl:   16px   /* feature cards */
--radius-2xl:  24px   /* hero sections */
--radius-full: 9999px /* pills, avatars */
```

---

## Shadow System

```css
--shadow-sm:  0 1px 2px rgba(0,0,0,0.05);
--shadow-md:  0 4px 6px rgba(0,0,0,0.07);
--shadow-lg:  0 10px 15px rgba(0,0,0,0.08);
--shadow-xl:  0 20px 25px rgba(0,0,0,0.08);
--shadow-card: 0 2px 8px rgba(45,106,79,0.08); /* green-tinted shadows */
```

---

## Component Design Specifications

### Primary Button
```
Background: --color-primary-600 (#52B788)
Text: white, Inter Semibold, 15px
Padding: 12px 24px
Border-radius: --radius-full (pill shape)
Hover: --color-primary-700
Focus ring: 3px --color-primary-300 offset 2px
Active: --color-primary-800
Disabled: --color-neutral-300 background, --color-neutral-400 text
Min tap target: 44px height (WCAG)
```

### Secondary Button
```
Background: transparent
Border: 2px solid --color-primary-600
Text: --color-primary-700, Inter Semibold
Same padding/radius as primary
Hover: --color-primary-100 background
```

### Danger/Caution Button
```
Caution: --color-caution background, white text
Danger: --color-danger background, white text
(Used only in safety escalation flows)
```

### Recipe Card
```
Width: flexible (min 280px, max 340px on desktop)
Border-radius: --radius-lg (12px)
Shadow: --shadow-card
Image: 16:9 ratio, border-radius top only, object-fit: cover
Content padding: 16px
Condition tags: horizontal scroll, pill shape, xs text
Cuisine tag: secondary color pill
Title: Inter Semibold, 18px, max 2 lines
Meta (time, cost): neutral-600, sm, flexrow
Save button: heart icon, top-right of image
```

### Condition Tag Pill
```
Base: background neutral-100, text neutral-700, rounded-full, px-3 py-1, text-xs
diabetes_friendly: green-100 bg, green-800 text, green check icon
heart_healthy: red-50 bg, red-700 text, heart icon
kidney_safe: teal-50 bg, teal-700 text
kidney_caution: caution-bg, caution text, warning icon
low_sodium: blue-50 bg, blue-700 text
```

### Safety Alert / Disclaimer Banner
```
Caution (amber): caution-bg, left border 4px caution, icon warning triangle
Danger/Crisis (red): crisis-bg, left border 4px danger, icon alert circle
Info: #EFF6FF bg, left border 4px --color-info
All: padding 16px, border-radius radius-md, full-width
```

### Reviewed By Badge
```
Layout: flex row, avatar (32px circle) + text column
Avatar: reviewer photo or initials in primary-100 bg
Text: "Reviewed by [Name], [Credentials]" / "Last reviewed: [Month Year]"
Border: 1px neutral-200, radius-md, padding 12px 16px
Background: neutral-50
```

### Mood Check-in Component (App)
```
5 emoji options: 😢 😔 😐 😊 😄
Layout: inline horizontal, tap targets 44px each
Selected state: scale(1.25) + primary ring
No labels by default (icons are intuitive), hover shows label
Appears on home screen without requiring a modal
```

### "I'm Struggling Today" Button
```
Background: #F0F4FF (very light blue — calming, not alarming)
Border: 1px solid #BFDBFE
Text: "I'm struggling today 💙"
Font: Inter Medium, 15px, --color-neutral-800
Icon: 💙 (not a warning icon — warm, not alarming)
Always visible on home screen, subtle prominence
On press: launches struggling flow, not a modal
```

---

## Photography Direction

**Do:**
- Real food photography — rustic surfaces, natural light, steam, texture
- Diverse people eating together — multigenerational, culturally authentic
- Kitchens that look lived-in, not staged
- Close-ups of real cultural foods (roti, collard greens, tamales, stew)
- People in movement that looks natural — a walk with family, stretching at home

**Do not:**
- Stock models eating salad and looking ecstatic
- Gym culture / weights / before-after bodies
- Clinical photography (beakers, stethoscopes, white coats as hero imagery)
- Homogeneous ethnic representation
- Thin-ideal body representation in food/fitness imagery

**Photo sourcing:**
- Commission diverse food photography at launch (budget for at least 50 hero shots)
- Licensed sources: Stocksy (diverse, authentic), Getty Creative, Unsplash (curated)
- Recipe photography: in-house style guide with natural light, wood surfaces, props that feel home-cooked

---

## Icon System

**Library:** Lucide Icons (open source, MIT license, clean, accessible)
**Backup:** Heroicons (also MIT)

**Custom icons needed:**
- VitalRoot leaf logo mark
- Condition icons (diabetes drop, heart, kidney bean, scale, brain wave)
- Cuisine icons (optional — can use emoji for informal contexts)
- "I'm struggling" heart icon (custom, warm, not a crisis symbol)

---

## Motion & Animation

```css
/* Standard transitions */
--duration-fast:   150ms
--duration-base:   200ms
--duration-slow:   300ms
--ease-out:        cubic-bezier(0.0, 0, 0.2, 1)
--ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1)

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Motion rules:**
- No animations on page load (never block reading)
- Subtle hover states on cards (translateY -2px, 200ms)
- Chatbot: typing indicator (3 dots), streaming text appears word-by-word
- Celebration animations: confetti ONLY on major milestones, skippable, reduced-motion safe
- Form validation: inline, no shaking (shaking feels punishing)

---

## Accessibility Requirements

| Standard | Target |
|----------|--------|
| WCAG level | 2.2 AA |
| Color contrast (text on bg) | ≥ 4.5:1 (normal text), ≥ 3:1 (large text) |
| Focus indicators | Visible, 3px ring minimum |
| Touch targets | ≥ 44×44px |
| Screen reader | Full ARIA labeling on all interactive elements |
| Keyboard navigation | All features operable without mouse |
| Reading level | ≤ Grade 8 for core content |
| Font size adjustable | System font size respects OS preference |
| Motion | prefers-reduced-motion respected universally |
| Language attribute | `lang` tag on all pages |

---

## Dark Mode

Dark mode support planned for Phase 2.
Design tokens structured to support palette swap without restructuring.

```css
/* Dark palette preview */
--color-bg:       #121714;   /* Deep dark green-black */
--color-surface:  #1C2520;   /* Card surfaces */
--color-text:     #E8F5EC;   /* Near-white with green hint */
--color-primary:  #74C69D;   /* Lighter primary for contrast */
```
