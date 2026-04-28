# 10 — Safety Rules, Escalation Logic & Disclaimers

## Safety Philosophy

VitalRoot operates on a harm-reduction-first model. The platform is educational and supportive, not clinical. Safety design must be proactive (not just reactive), layered (multiple catch points), and dignified (users are never made to feel surveilled or alarmed unnecessarily).

---

## Safety Rule Tiers

### Tier 1: Platform-Wide (Always Active)

These apply across all surfaces — website, app, chatbot, CMS content.

| Rule | Implementation |
|------|---------------|
| Medical disclaimer on every condition page | Footer element + inline callout at top of every condition/herb page |
| "Not a substitute for professional medical advice" | Global footer, Terms of Service, chatbot system prompt |
| No diagnostic language | Content style guide enforced; CMS validation; chatbot guardrail |
| No medication replacement claims | CMS validation; chatbot system prompt hard rule |
| Medical reviewer name + date on reviewed content | Required CMS field; displayed as badge on frontend |
| Reviewed-by badge required for: condition pages, herb pages, exercise pages with medical relevance | CMS enforces required reviewer field before publish |

---

### Tier 2: Condition-Specific Safety Rules

#### Kidney Disease (CKD) — Highest Caution Level

| Rule | Reason | Implementation |
|------|--------|---------------|
| ALL herb/supplement pages include CKD-specific caution block | Kidneys process and concentrate many compounds; many herbs are nephrotoxic | Mandatory CKD callout component in herb page template |
| Recipes tagged kidney_safe or kidney_caution must include potassium/phosphorus per serving | Renal dietitians need this data | Required nutrition fields for kidney-tagged recipes |
| Kidney-caution recipes get warning banner, not just tag | Passive tags are missed; active warnings are seen | UI: amber warning banner with text "Special note for kidney disease" |
| Chatbot adds CKD caution to ALL herb/supplement responses for CKD users | System prompt + context injection | Dynamic context flag triggers extra caution module |
| No "high-potassium foods are healthy" claims without CKD context | Blanket healthy food claims can harm CKD users | Content style guide; chatbot guardrail |

#### Diabetes

| Rule | Reason |
|------|--------|
| Blood sugar management content always recommends working with provider on medication | Users may be tempted to change medication based on food/herb effects |
| Herb interaction with diabetes medications (especially Metformin, insulin) always noted | Several herbs significantly affect blood sugar |
| A1C advice is informational only — no "you can normalize A1C with diet alone" claims | This claim could cause harm if user stops medication |

#### Heart Disease / Blood Thinners

| Rule | Reason |
|------|--------|
| Warfarin/anticoagulant users get dietary vitamin K consistency guidance, not avoidance | Avoidance is wrong; consistency is correct — misguiding this is medically dangerous |
| Any content mentioning fish oil, CoQ10, garlic, or vitamin E supplements flags anticoagulant interaction | These have meaningful interactions |
| Exercise content for heart disease users includes warning signs to stop (chest pain, shortness of breath) | Legal and medical safety |

#### Brain Recovery / TBI / Post-Stroke

| Rule | Reason |
|------|--------|
| All brain-related content carries prominent educational-only disclaimer | TBI and stroke recovery vary wildly; advice that helps one person can harm another |
| No neurological condition-specific supplement claims without strong evidence rating | Supplement market exploits brain health desperation |
| Cognitive fatigue acknowledged in UX (short sessions, low-complexity design for these users) | James persona; accessibility |

---

### Tier 3: Chatbot Escalation Rules

#### Crisis / Mental Health Safety Protocol

**Trigger detection method:** Keyword matching + semantic similarity classifier running in parallel with generation.

**Level 1 — Hopelessness Signal** (no active ideation detected)
```
Triggered by: "what's the point", "never going to get better", "giving up",
              "can't do this anymore", "I'm exhausted with all of this"

Response:
- Acknowledge warmly and specifically
- Ask one open question: "Can you tell me more about what's been hardest lately?"
- Do NOT rush to resources or alarm user
- Tone mode: sadness_aware
- Log: mood_signal_hopelessness (anonymized)
```

**Level 2 — Active Ideation Disclosed**
```
Triggered by: user confirms thoughts of self-harm or suicide (to the screening question)
              OR unprompted disclosure containing crisis language

Response:
1. Acknowledge with warmth: "Thank you for trusting me with that."
2. Provide resources immediately and clearly:
   - 988 Suicide & Crisis Lifeline (call or text)
   - Crisis Text Line (HOME to 741741)
3. Ask: "Would you like me to stay with you while you reach out?"
4. Do NOT continue wellness conversation in same session
5. Log: safety_event, type=crisis_ideation (anonymized, no message content stored)
6. Optional: offer to send crisis resources to email if user is willing to provide
```

**Level 3 — Medical Emergency**
```
Triggered by: "chest pain", "can't breathe", "stroke", "passed out",
              "my blood sugar is [extreme value]", "I think I'm having a heart attack"

Response:
"Please call 911 or go to your nearest emergency room immediately.
If you're alone, call 911 right now — I'll be here when you're safe."

STOP all other AI generation.
Log: safety_event, type=medical_emergency
```

---

### Tier 4: Content Safety Rules (CMS Enforced)

All content submitted to CMS is subject to:

| Check | Method |
|-------|--------|
| "This reverses diabetes" type claims | Style guide + editorial review |
| "Safe for everyone" supplement claims | CMS validation rule: herb pages cannot publish without safety/contraindication fields |
| Before/after weight transformation framing | Editorial standard: not permitted in any content |
| "You can stop your medication if you do this" | Hard prohibited phrase list; CMS flags on save |
| Clickbait health alarm framing | Editorial standard: no "This food is killing you" style content |
| Unreviewed herb/supplement efficacy claims | Required: evidence level field + reviewer |

---

## Legal Disclaimers

### Global Site Disclaimer (Footer)
```
VitalRoot Health provides educational and wellness information only.
Content on this site is not a substitute for professional medical advice,
diagnosis, or treatment. Always seek the advice of your physician or other
qualified health provider with any questions you may have regarding a
medical condition. Never disregard professional medical advice or delay
in seeking it because of something you read on this website.

If you are experiencing a medical emergency, call 911 immediately.
```

### Herb / Supplement Page Disclaimer (Top of every herb page)
```
Important: The information on this page is for educational purposes only
and is not medical advice. Herbs and supplements can interact with
medications and affect medical conditions — including effects on blood
sugar, blood pressure, kidney function, and medication effectiveness.

Always consult your doctor, pharmacist, or registered dietitian before
starting any herb or supplement, especially if you:
• Have kidney disease
• Take any prescription medications
• Have diabetes, heart disease, or any chronic condition
• Are pregnant or breastfeeding
```

### Kidney Disease Special Disclaimer (All herb pages for CKD users + kidney-caution recipes)
```
⚠ Kidney Disease Special Caution
If you have chronic kidney disease, your kidneys may process herbs and
supplements differently than someone with healthy kidney function.
Some herbs that are generally considered safe can be harmful for people
with CKD. Always discuss any herb, supplement, or new food with your
nephrologist or renal dietitian before use.
```

### Medical Review Badge Template
```
[Reviewed by: Dr. Jane Smith, RD, CDN]
[Last reviewed: November 2025]
[This content was reviewed by a registered dietitian for accuracy.
 It is updated regularly. Review date indicates the most recent clinical review.]
```

### Chatbot Disclaimer (Shown at start of each new conversation)
```
VitalRoot Companion is here to support and educate — not to provide
medical advice. I'm not a doctor, and nothing I share should replace
guidance from your healthcare team. If you're in crisis or having a
medical emergency, please call 911 or text 988.
```

---

## Escalation Response SLAs

| Event Type | Response Protocol | Timeline |
|-----------|-------------------|----------|
| Crisis ideation disclosed | Immediate in-chat resource display | Real-time (no delay) |
| Medical emergency indicated | Immediate 911 prompt | Real-time |
| Safety event logged | Staff review queue | Within 24 hours |
| High-risk content flagged in CMS | Editorial review before publish | Before publish (blocking) |
| User reports harmful content | Ticket to safety team | Within 4 hours business hours |

---

## Staff Safety Review Protocol

1. Weekly review of safety event log (anonymized, no message content)
2. Pattern detection: if multiple users from same region triggering hopelessness signals → alert team for possible community-level stressor
3. Monthly audit of chatbot responses for tone drift, off-guard-rail content
4. Quarterly clinical reviewer audit of all herb + condition content (check for outdated or harmful information)
5. Incident response plan: if harmful advice is discovered → immediate content takedown, user notification plan, public disclosure if warranted

---

## Crisis Resource Library (Always Current, Admin Editable)

| Resource | Contact | Available | Notes |
|----------|---------|-----------|-------|
| 988 Suicide & Crisis Lifeline | Call/text 988 | 24/7 | US only |
| Crisis Text Line | Text HOME to 741741 | 24/7 | US only |
| SAMHSA National Helpline | 1-800-662-4357 | 24/7 | Mental health + substance |
| NAMI HelpLine | 1-800-950-6264 | M–F 10am–10pm ET | Mental health |
| 911 | 911 | 24/7 | Medical emergencies |
| International Association for Suicide Prevention | https://www.iasp.info/resources/Crisis_Centres/ | — | International directory |
