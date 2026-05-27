# LEAD MAGNET — THE 7-QUESTION AI READINESS CHECK
**For:** Faith-Led and Community-Rooted Businesses
**By:** Anchored AI Operations
**Format:** 1-page PDF (download instantly) + 5-email nurture + 15-min call CTA
**Where it lives:** Landing page → opt-in → email delivers PDF + adds to nurture sequence
**Primary avatar:** Pastor Linda (Avatar A), secondary: Attorney Tasha (Avatar B)

---

## COVER PAGE COPY

> **THE 7-QUESTION AI READINESS CHECK**
> *For faith-led and community-rooted businesses ready to stop drowning in voicemails, missed leads, and scattered systems.*
>
> Built by Anchored AI Operations.
> Faith-first. Community-first. Compliance-native.
> A MJUEM Co. brand.

---

## PAGE 1 — THE 7 QUESTIONS

> *Answer honestly. Each "yes" is worth 1 point. Each "no" or "not sure" is 0.*

**1. Time** — *In the last 7 days, did at least one lead or member go more than 24 hours without a response from your team?*
☐ Yes (you have a response-time problem AI can fix in 30 days)
☐ No

**2. Data** — *Are your member/client records in one system that your whole team can access today?*
☐ Yes
☐ No (you have a data fragmentation problem)

**3. Voice** — *Do you regularly miss phone calls because you or your team are in meetings, services, or court?*
☐ Yes (Agent 508™ was built for this)
☐ No

**4. Compliance** — *If a regulator asked you to show consent records for every text or call you've sent in the last 90 days, could you?*
☐ Yes
☐ No (TCPA risk — this is fixable)

**5. Team** — *Is at least one person on your team spending more than 5 hours per week on tasks a well-built AI agent could handle?*
☐ Yes
☐ No

**6. Trust** — *When you imagine AI in your business, do you worry it will sound robotic, miss the cultural tone, or replace the human relationship?*
☐ Yes (this is the most common YES — and the most fixable)
☐ No

**7. Leverage** — *Do you know exactly which 1–2 workflows in your business would produce the biggest return if automated this quarter?*
☐ Yes
☐ No

---

## PAGE 2 — SCORING

**Add up your YES answers:**

| Score | What it means |
|-------|---------------|
| **0–2** | **Foundation phase.** Your business is ready for systems before AI. Start with the **Anchored Starter** ($2,997) to install a foundation that AI can sit on. |
| **3–4** | **Readiness phase.** You have real pain and real signal. **Anchored Starter** is the right entry — you'll feel relief within 30 days. |
| **5–6** | **Acceleration phase.** You're losing money every week you wait. **Anchored Pro** ($9,997 + $497/mo) is the right tier. |
| **7** | **Anchor-account phase.** Multi-channel, multi-team, multi-location. **Anchored Enterprise** is built for you. |

---

## PAGE 3 — WHAT TO DO NEXT

> **However you scored — your next step is the same:**
> **Book a free 15-minute Anchored Check-In.**
>
> We'll walk through your score, pinpoint the *one* workflow that would unlock the most time or revenue, and tell you honestly whether you need us or not.
>
> No pitch. No pressure. Faith-first, community-first, culture-first.
>
> **Book at:** anchoredaiops.com/check-in
>
> — Mona Jackson-Ham, CEO · MJUEM Co.

---

## TECHNICAL SPECS — HOW TO BUILD IT

**Tools:**
- **Canva** (free) — design the 3-page PDF using the script above
- **GHL** — hosts the opt-in form, delivers the PDF, runs the nurture
- **Stripe** — collects payment after the call (not needed for the magnet itself)

**Opt-in form fields (keep it short):**
1. First name
2. Email
3. *Optional:* Phone (for SMS — TCPA consent checkbox required)
4. *Optional:* Business type — Church / Law firm / Other (drives avatar tagging)

**TCPA consent line on the form (required if collecting phone):**
> *"By checking this box, I agree to receive automated text messages from Anchored AI Operations at the number provided. Message and data rates may apply. Consent is not a condition of purchase. Reply STOP to opt out."*

**After-opt-in flow:**
1. Instant thank-you page with PDF download button
2. Email 1 (immediate): subject *"Your AI Readiness Check is inside ⚓"* — PDF link + call CTA
3. Add tag: `lead-magnet-readiness-check`
4. Enroll in the 5-email nurture sequence (see FUNNEL_MAP.md)

---

## DESIGN NOTES

- **Color palette:** Deep navy (#0b1020), gold (#f5c860), teal accents (#46e0c8) — matches the brand HTML.
- **Typography:** Serif for headings (DM Serif Display), clean sans for body (Inter).
- **Imagery:** Anchor icon, no stock photos, no AI-generated faces in v1.
- **Footer:** "© MJUnlimited Essential Marketing Co. · Anchored AI Operations · Bowie, MD"

---

## OPTIONAL V2 — INTERACTIVE WEB VERSION

Once volume justifies it, convert the PDF into an interactive web quiz on the same domain. GHL has a built-in survey/quiz tool. The web version captures email *and* the answer set — which lets us auto-tag leads by exact pain (e.g., "voice problem" vs "data problem") and send a tailored nurture sequence per pain. This is a v2 upgrade — ship the PDF first.
