# ContentOps — Course & Digital Content Operations

## Table of Contents

1. [Content Asset Map](#content-asset-map)
2. [Course Management Workflow](#course-management-workflow)
3. [Content Creation Pipeline](#content-creation-pipeline)
4. [Publishing Checklist](#publishing-checklist)
5. [Notion Content Database Structure](#notion-content-database-structure)
6. [Skill Publishing (ClawHub)](#skill-publishing-clawhub)
7. [YouTube & Video Content](#youtube--video-content)
8. [IP Protection Rules](#ip-protection-rules)

---

## Content Asset Map

| Asset | Location | Status |
|---|---|---|
| AI Agent Course (main) | Notion: "AI Agent Course" database | Active |
| Course lesson scripts | Notion: "Lesson Scripts" pages | Proprietary |
| Slide decks | Gamma + Google Drive | Owner-reviewed |
| Bonus materials | Notion: "Bonus Resources" database | Varies |
| Community resources | Notion: "Community Hub" | Active |
| ClawHub skills | `clawhub.ai` + local `skills/` | Published |
| YouTube content | YouTube channel (vidiq-tracked) | Active |
| Email sequences | Gmail drafts + Notion | Staged |

Search for content: `notion-search` with relevant keywords before creating anything new.

---

## Course Management Workflow

### Checking Cohort Health

When asked about course or students:

```
1. notion-search("AI Agent Course")
2. notion-fetch(course_database_id)
3. Review: enrollment count, completion rate, active students, overdue milestones
4. Flag: students with 0 progress after 7 days → recommend owner outreach
```

Report format for cohort health:
```
Enrolled: XX students
Active (last 7d): XX
Completed Module 1: XX (XX%)
Completed Module 2: XX (XX%)
Stuck (no progress > 7d): XX → [names if few, count if many]
```

### Adding a New Module or Lesson

```
1. Draft outline in Notion: notion-create-pages (parent: course database)
2. Structure: [Module #] [Title] → [Learning Objectives] → [Lesson Outline] → [Resources]
3. Assign status: "Draft"
4. Owner reviews → status: "Approved"
5. Run publishing checklist (see below)
6. Status: "Published" + add release date
```

### Student Access Issues

Do not modify student access permissions directly. Route to owner with:
- Student name/email (masked to first name + email domain in report)
- What access they have vs. what they need
- Recommended action

---

## Content Creation Pipeline

### New Content Request Flow

```
Owner request → ContentOps assesses type:

Type: Lesson/Module → Notion draft → Outline first → Owner approves → Full script
Type: Slide deck → Gamma generate → Owner reviews → Publish
Type: Email sequence → Draft in Notion → Owner approves → Stage in Gmail
Type: ClawHub skill → Write SKILL.md → Validate → Package → Owner approves → Publish
Type: YouTube video → VidIQ keyword research → Draft outline → Owner records → Publish
```

### Using Gamma for Slides

When creating presentation slides:

1. Research topic: check if existing Notion notes exist first
2. Use `gamma-generate` with: topic, key points (from Notion), brand tone (professional + direct)
3. Present Gamma link to owner: "Slides drafted — review at [link]"
4. Do not publish or share the Gamma link externally without owner approval
5. After approval: export or embed as needed

Gamma cannot be edited by the agent — owner edits directly in Gamma editor. Make that clear.

### Lesson Script Structure

Every AI Agent course lesson should follow this structure:

```
## Lesson [X]: [Title]

**Learning objective**: By the end of this lesson, the student will be able to [OUTCOME].

**Hook (30-60 sec)**: [Problem or curiosity gap to open with]

**Core content** (segmented into 3-5 beats):
  Beat 1: [Concept + example]
  Beat 2: [Concept + example]
  ...

**Demonstration** (if applicable): [What to show/build live]

**Student action**: [What the student does after watching]

**Recap (30 sec)**: [3 key takeaways]

**Next lesson preview**: [One sentence teaser]
```

---

## Publishing Checklist

Run before publishing ANY content (lesson, blog, video, skill):

- [ ] Content reviewed and signed off by owner
- [ ] Spelling and grammar checked
- [ ] All links tested and live
- [ ] No internal business details, pricing, or PII exposed
- [ ] Proper formatting for the target platform
- [ ] Notion page updated: status → "Published", date → today
- [ ] Relevant students/subscribers notified (if applicable) — draft notification for owner approval
- [ ] VidIQ metadata ready if YouTube (title, description, tags) — see YouTube section

---

## Notion Content Database Structure

When creating or updating Notion pages for course content, use this property schema:

**Lesson pages**:
```
Title: [Module X: Lesson Title]
Status: Draft | In Review | Approved | Published | Archived
Module: [Module number]
Type: Lesson | Bonus | Workshop | Q&A
Release Date: [date or blank if not scheduled]
Script Status: Not Started | Drafted | Reviewed | Final
Tags: [relevant keywords]
```

**Database lookups**:
- Course overview: search "AI Agent Course Overview"
- Lesson scripts: search "Lesson Script [number]"
- Bonuses: search "Bonus Resources"
- Meeting notes: search "Meeting Notes [date]"

When a Notion page doesn't exist: create it with `notion-create-pages`, use the schema above.
When updating: use `notion-update-page` — never overwrite entire page, only update changed properties.

---

## Skill Publishing (ClawHub)

When publishing or updating a skill to ClawHub (`clawhub.ai`):

### Pre-publish validation

```
1. Run: python3 skills/skill-creator/scripts/quick_validate.py skills/[skill-name]
2. Run: python3 skills/skill-creator/scripts/package_skill.py skills/[skill-name]
3. Review .skill file contents
4. Owner approves
```

### Publish workflow

1. Validate and package locally (above)
2. Present `.skill` file to owner with summary: name, description, what it does
3. Owner uploads to ClawHub manually (agents do not have direct ClawHub write access)
4. After publish: update Notion "Published Skills" database with date and version

### Skill update (existing skill)

1. Identify what changed: `git diff skills/[skill-name]`
2. Bump version if skill has a version field
3. Re-run validate + package
4. Owner approves and re-publishes

---

## YouTube & Video Content

### Video keyword research (before scripting)

Use VidIQ to validate video topics before investing in production:

```
vidiq_keyword_research(keyword="[topic]")
→ Check: search volume, competition, score
→ Threshold: use keywords with score > 40 and competition < 70

vidiq_score_title(title="[proposed title]")
→ Aim for score > 65

vidiq_trending_videos(category="AI tools" or "AI agents")
→ Surface trending angles to incorporate
```

### Video metadata template

For every YouTube video:

```
Title: [Keyword-optimized, ≤ 60 chars, score > 65 via vidiq_score_title]
Description:
  Line 1-2: Hook — what problem this video solves
  Line 3: [timestamps if long video]
  Line 4+: Resources mentioned
  Last section: Course/offer CTA + link
  Tags: [10-15 tags from vidiq_keyword_research output]
Thumbnail: Score via vidiq_score_thumbnail before uploading
```

### Channel performance check

Weekly: `vidiq_channel_analytics` → surface to owner:
- Views + watch time trend
- Top performing video this week
- Subscriber growth
- Any outlier videos (`vidiq_outliers`) — study these for content patterns

---

## IP Protection Rules

Course content is proprietary. These rules are non-negotiable:

**Never**:
- Paste raw lesson scripts into external tools (Gamma, email, Slack, etc.) without owner permission
- Share course structure, module breakdown, or pricing strategy externally
- Publish course content to public channels without explicit owner sign-off
- Grant or revoke student access without owner authorization

**Always**:
- Work with content in Notion (private workspace) by default
- Treat lesson scripts, business processes, and course architecture as confidential
- When in doubt about what can be shared: ask owner before acting
- Log any content that leaves the private workspace (even to Gamma) in the audit trail
