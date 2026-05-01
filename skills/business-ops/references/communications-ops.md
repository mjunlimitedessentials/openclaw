# CommsOps — Communications & Customer Operations

## Table of Contents

1. [Inbox Triage Protocol](#inbox-triage-protocol)
2. [Email Priority Classification](#email-priority-classification)
3. [Customer Reply Templates](#customer-reply-templates)
4. [Lead Qualification Framework](#lead-qualification-framework)
5. [Follow-Up Tracking](#follow-up-tracking)
6. [Escalation Rules](#escalation-rules)
7. [Tone & Brand Voice](#tone--brand-voice)

---

## Inbox Triage Protocol

Run inbox triage on every daily briefing and on demand. Never send — always draft for owner review.

### Step 1: Pull and classify

```
search_threads(query="is:unread", max_results=50)
→ classify each thread by priority tier (see below)
→ group: URGENT / ACTION_NEEDED / FYI / NOISE
```

### Step 2: Surface to owner

Report format:
```
URGENT (X threads):
  - [subject] from [sender] — [1-line summary] — [recommended action]

ACTION NEEDED (X threads):
  - [subject] from [sender] — [1-line summary] — [recommended action]

FYI (X threads): [brief list, no action needed]

NOISE (X threads): [archived/labeled automatically]
```

### Step 3: Draft responses for URGENT threads

For each URGENT thread, prepare a draft using the appropriate template (see below).
Present draft to owner with: "Draft ready for [sender] — approve, edit, or discard?"

---

## Email Priority Classification

### URGENT (respond within 4 hours)

- Stripe payment failure follow-up from customer
- Refund request — route to FinanceOps + draft empathetic response
- Student locked out of course / access issue
- Existing paying customer with unresolved complaint
- Legal notice or threat (DO NOT REPLY — escalate to owner immediately)
- Media/press inquiry

Apply Gmail label: `CUSTOMER/urgent` or `LEGAL`

### ACTION NEEDED (respond within 24 hours)

- New course enrollment question
- Hot lead (shows budget + timeline signals)
- Partnership or collaboration inquiry
- Speaking or appearance request
- Vendor/tool renewal notice

Apply Gmail label: `LEAD/hot` or `VENDOR`

### FYI (no reply needed, keep for reference)

- Receipts and invoices
- Newsletter confirmations
- Cold outreach that is not relevant
- Platform notifications (YouTube, social, etc.)

Apply Gmail label: `FYI`

### NOISE (archive)

- Spam
- Mass marketing emails with no business relevance
- Duplicate notifications

Action: `label_thread` with `ARCHIVE` or `spam` → do not surface.

---

## Customer Reply Templates

Always personalize the `[NAME]` and `[SPECIFIC_DETAIL]` placeholders before presenting to owner.

### Template: Course Access Issue

```
Subject: Re: Course Access — Let's Fix This

Hi [NAME],

Thank you for reaching out — I'm sorry you're having trouble accessing [SPECIFIC_DETAIL].

I've looked into your account and [FINDING]. Here's what I'd like to do:
[ACTION — e.g., "I'll resend your login link" / "I've reset your access"].

Please try again now and let me know if you're still seeing the issue. I'm here to make sure
you get the full value of what you've enrolled in.

[OWNER_NAME]
MJU Unlimited Essentials
```

### Template: Refund Request (Empathetic, Pre-Decision)

```
Subject: Re: Refund Request

Hi [NAME],

Thank you for reaching out. I've received your refund request for [COURSE/PRODUCT] and I want
to make sure this is handled fairly and quickly for you.

I'm reviewing your case now and will follow up within [24/48] hours with next steps.

In the meantime, if there's something specific that didn't meet your expectations, I'd genuinely
like to hear it — your feedback helps me improve.

[OWNER_NAME]
MJU Unlimited Essentials
```

Note: Do NOT confirm or deny refund approval in this template. Wait for FinanceOps assessment.

### Template: Lead Follow-Up (Warm)

```
Subject: Re: [THEIR_SUBJECT]

Hi [NAME],

Thanks for your interest in [COURSE/PROGRAM] — great timing to be looking at this.

[1-2 sentences connecting their situation to the value of the offer]

The best next step is [SPECIFIC_ACTION — e.g., booking a quick call / joining the waitlist].
Here's [LINK/DETAIL].

Looking forward to connecting.

[OWNER_NAME]
MJU Unlimited Essentials
```

### Template: General Inquiry (Neutral)

```
Subject: Re: [THEIR_SUBJECT]

Hi [NAME],

Thanks for reaching out. [DIRECT_ANSWER_TO_THEIR_QUESTION].

[Any follow-up or CTA if relevant]

Let me know if you have other questions.

[OWNER_NAME]
MJU Unlimited Essentials
```

### Template: Legal / Sensitive (Internal only — do NOT send)

```
[DO NOT REPLY TO THIS EMAIL — ESCALATE TO OWNER]

Thread: [SUBJECT]
From: [SENDER]
Received: [DATE]
Classification: LEGAL / SENSITIVE
Summary: [1-paragraph neutral summary of the claim or concern]
Recommended action: Owner should consult legal counsel before any response.
```

---

## Lead Qualification Framework

When a lead comes in, assess these signals before routing to owner:

### Budget Signals (0–3 points)

- Mentions a budget or range explicitly: +3
- Role suggests decision-making authority (founder, exec, director): +2
- Asks about pricing: +1
- No budget signals: 0

### Timeline Signals (0–3 points)

- "Ready to start now" / "this week" / "this month": +3
- "Next quarter" / "planning ahead": +2
- "Just exploring": +1
- No timeline mentioned: 0

### Fit Signals (0–3 points)

- Pain point aligns directly with AI Agent course or automation services: +3
- General interest in AI/automation: +2
- Adjacent topic (not direct fit): +1
- No fit: 0

### Routing:

- **7–9 points**: HOT LEAD — notify owner immediately, draft warm response
- **4–6 points**: WARM LEAD — draft follow-up, add to `LEAD/warm` label
- **0–3 points**: COLD — file under `LEAD/cold`, no immediate action

---

## Follow-Up Tracking

For every thread that needs a follow-up:

1. Label with `FOLLOW-UP/[date]` in Gmail
2. Log in Notion "Open Threads" database: `notion-create-pages` (CommsOps write)
3. At each daily briefing, surface threads where follow-up date has passed

Follow-up timing rules:
- Customer complaint: follow up if no reply within 48h
- Hot lead: follow up if no reply within 24h
- Warm lead: follow up if no reply within 72h
- Refund pending review: follow up if FinanceOps has not resolved within 24h

---

## Escalation Rules

**Escalate immediately to owner (stop all drafting, do not respond)**:

- Any email containing legal terms: lawsuit, attorney, breach, demand, cease, desist, subpoena
- Any email from a journalist, media outlet, or public figure
- Any email threatening public review or social media campaign
- Any email from a competitor or suspected bad actor
- Refund requests > $200 (route to FinanceOps for owner review)
- Any situation where the right response is genuinely ambiguous

**Do NOT escalate** (handle with templates):
- Routine access issues
- Standard refund requests (send template first, route to FinanceOps)
- General course questions with clear answers
- Cold sales outreach (label as NOISE)

---

## Tone & Brand Voice

All customer communications for MJU Unlimited Essentials must be:

- **Direct**: Get to the point fast. Respect the reader's time.
- **Warm but professional**: Personal, not casual. Not corporate-speak.
- **Confident**: Speak with authority. No hedging like "I think maybe possibly..."
- **Action-oriented**: Every email should have one clear next step.
- **Honest**: Never make promises that can't be kept. If unsure, say "I'll confirm and follow up."

Avoid:
- Excessive exclamation marks
- Vague apologies ("I'm sorry you feel that way")
- Jargon the customer wouldn't know
- Passive-aggressive or condescending tone
- Over-promising on timelines

Length: Most emails should be 3–5 sentences. Use short paragraphs. No walls of text.
