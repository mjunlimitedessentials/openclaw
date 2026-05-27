# GHL WALKTHROUGH — STEP-BY-STEP (iOS-FRIENDLY)
**Platform:** GoHighLevel (GHL)
**Goal:** Build the Anchored AI Operations funnel — domain, landing page, lead magnet delivery, 5-email sequence, calendar, CRM pipeline, SMS, payments.
**Time to ship v1:** 6–10 focused hours.
**iOS note:** Install **LeadConnector by HighLevel** from the App Store. Most builds are easier on desktop, but day-to-day inbox + calendar runs great on iPhone.

---

## STEP 0 — PREREQUISITES (DO FIRST)

- [ ] Domain purchased: `anchoredaiops.com` (Namecheap or GoDaddy, ~$12/yr)
- [ ] Email mailbox: `hello@anchoredaiops.com` and `mona@anchoredaiops.com` via Google Workspace (~$7/mo each)
- [ ] Stripe account (stripe.com) — connected to your business bank once the S-Corp is formed; use personal stripe temporarily if you want to test
- [ ] A founder photo (head shot)
- [ ] The lead magnet PDF designed in Canva (use LEAD_MAGNET.md as the script)
- [ ] All homepage copy in front of you (HOMEPAGE_COPY.md)
- [ ] iPhone: install **LeadConnector** from App Store

---

## STEP 1 — SIGN UP FOR GHL

1. Go to **gohighlevel.com** on your laptop.
2. Pick the **Agency Unlimited Pro plan** ($497/mo) — gives you unlimited sub-accounts and SaaS reselling later.
   - Starter plan ($97/mo) works for v1 but limits scaling. Recommend Unlimited Pro from day 1.
3. 14-day free trial available — start there if you want to evaluate.
4. Enter business name: **MJUnlimited Essential Marketing Co.** (parent) — once S-Corp is live, switch billing to MJUEM Co.

---

## STEP 2 — CREATE THE AGENCY ACCOUNT + FIRST SUB-ACCOUNT

> GHL has a 2-level structure: your **Agency** (parent dashboard) + **Sub-accounts** (one per brand or client).

1. In agency dashboard, click **Sub-Accounts → Create**.
2. Sub-account name: **Anchored AI Operations**.
3. Business info:
   - Address: Bowie, MD
   - Phone: (203) 943-3579 (or new MD number — see Step 6)
   - Email: hello@anchoredaiops.com
   - Website: anchoredaiops.com
   - Timezone: America/New_York
4. Industry: **Marketing & Consulting**
5. Save. You now have a sub-account for your own business.

> **Why a sub-account for your own business?** It separates your operations from clients you'll later host on the same agency plan.

---

## STEP 3 — CONNECT DOMAIN + EMAIL

### 3a. Domain connection
1. Sub-account → **Settings → Domains → Add Domain**.
2. Enter `anchoredaiops.com`.
3. GHL gives you 2 DNS records (A record + CNAME).
4. Go to your domain registrar (Namecheap/GoDaddy) → DNS settings.
5. Paste the 2 records. Save. Wait 5–60 minutes for propagation.
6. Back in GHL, click **Verify**. Green checkmark = done.

### 3b. Email sending (Mailgun is recommended for deliverability)
1. Sub-account → **Settings → Email Services → Connect Mailgun** (or use GHL's built-in SMTP — fine for v1).
2. If using Mailgun (recommended): create free Mailgun account, add DNS records GHL provides, verify.
3. Set sending email to `mona@anchoredaiops.com`.

### 3c. Receiving mail at hello@ and mona@
- Google Workspace handles this separately (not GHL). Set MX records at your registrar pointing to Google.
- GHL only sends; Google Workspace receives.

---

## STEP 4 — BUILD THE LANDING PAGE (lead magnet)

1. Sub-account → **Sites → Funnels → New Funnel**.
2. Funnel name: **Readiness Check Funnel**.
3. Add Step 1: **Landing Page** (`/check`).
4. Use the **blank template** and import the design via the page builder.

### Use HOMEPAGE_COPY.md as the source. Build these blocks in order:

| Block | GHL element | Notes |
|-------|------------|-------|
| Hero | Section → Column → Headline + Subhead + Form | Form fields: First name, Email, Phone (optional, with TCPA consent checkbox), Business Type dropdown |
| Trust strip | Section → 4 text columns | Faith-first / MD-based / US-only / TCPA-aligned |
| Who this is for | 3-column section | One card per avatar |
| Pricing | 3-column section | Featured middle column |
| Why us | 2-column section | Photo left, founder copy right |
| FAQ | Accordion element | 3 questions |
| Footer CTA | Full-width section | Big button to opt-in form |

### Add Step 2: **Thank-You Page** (`/check-thanks`)
- Headline: *"Your check is on its way. Open your email."*
- Download button: link to the PDF (hosted in GHL > Media)
- Calendar embed: 15-minute call (set up in Step 5 below)

### Set the form's destination:
- Form → On submit → Redirect to `/check-thanks` AND trigger workflow "Lead Magnet Delivery" (built in Step 7).

---

## STEP 5 — SET UP THE CALENDAR (15-min call)

1. Sub-account → **Calendars → Create Calendar**.
2. Name: **Anchored Check-In (15 min)**.
3. Duration: 15 minutes. Buffer: 10 minutes before/after.
4. Availability: Mon–Fri, 10a–4p ET (adjust to your reality).
5. Form fields on booking: Name, Email, Phone, "What's the #1 thing eating your time right now?"
6. Confirmation: auto-email + auto-SMS reminder 24h and 1h before.
7. Embed code: copy and paste into the `/check-thanks` page (Step 4).

---

## STEP 6 — SET UP PHONE NUMBER + SMS (TCPA-CRITICAL)

> Required for Agent 508 delivery AND for the SMS branch of your nurture.

### 6a. Buy a number
1. Sub-account → **Settings → Phone Numbers → Add Number**.
2. Pick a **Maryland** area code (240 or 301) for local trust.
3. Cost: ~$1/month + ~$0.015 per call/SMS.

### 6b. Register for A2P 10DLC (REQUIRED in the US)
1. Sub-account → **Settings → Phone Numbers → A2P 10DLC**.
2. Submit Brand registration (uses your business EIN — needs S-Corp formed first; you can register as sole proprietor temporarily and update later).
3. Submit Campaign registration:
   - Campaign type: **Mixed (marketing + customer service)**
   - Sample messages (provide 2):
     - *"Hi {{first_name}}, this is Mona at Anchored AI Operations. You scored a {{score}} on your Readiness Check. Want to walk through it on a 15-min call? Reply YES or book here: anchoredaiops.com/call. Reply STOP to opt out."*
     - *"Quick reminder: your Anchored Check-In with Mona is in 1 hour. Need to reschedule? anchoredaiops.com/call. Reply STOP to opt out."*
4. Approval takes 1–7 business days. **Without 10DLC, US carriers will block your texts.**

### 6c. Set TCPA defaults in GHL
1. Workflows → Settings → SMS Compliance:
   - Auto-handle STOP, UNSTOP, HELP keywords: **ON**
   - Quiet hours: 8a–9p recipient local time
2. On every form that captures phone, the consent checkbox is mandatory.

---

## STEP 7 — BUILD THE WORKFLOWS (the email + SMS nurture)

> This is where the 5-email sequence from FUNNEL_MAP.md becomes real.

1. Sub-account → **Automation → Workflows → New Workflow**.
2. Name: **Lead Magnet Delivery + Nurture**.
3. Trigger: **Form Submitted → "Readiness Check Opt-In"**.

### Build these actions in order:
- **Send Email (immediate):** Subject *"Your AI Readiness Check is inside ⚓"* — body from FUNNEL_MAP.md Email 1. Attach the PDF.
- **Add Tag:** `lead-magnet-readiness-check`
- **If/Else Branch:** Did they check the SMS consent box?
  - YES → **Send SMS (immediate):** Welcome text + PDF link
  - NO → continue
- **Wait 1 day → Send Email 2** (story)
- **Wait 2 days → Send Email 3** (voicemail pain)
- **Wait 2 days → Send Email 4** (case study)
- **Wait 2 days → Send Email 5** (last call)
- **Wait 3 days → Send Email 6** (closing the file, monthly nurture)
- **End workflow OR transfer to monthly nurture workflow**

### Branch: If they book a call
- Add trigger: "Appointment Booked" → remove from nurture → add to "Pre-Call Sequence" workflow

---

## STEP 8 — BUILD THE CRM PIPELINE

1. Sub-account → **Opportunities → Pipelines → New Pipeline**.
2. Pipeline name: **Anchored Sales**.
3. Stages (in order):
   1. **Opted In** — they downloaded the PDF
   2. **Engaged** — opened 2+ emails or clicked a link
   3. **Call Booked** — calendar booking exists
   4. **Showed Up** — appointment marked attended
   5. **Pitched** — proposal sent
   6. **Won — Starter** / **Won — Pro** / **Won — Enterprise**
   7. **Nurture (Not Now)**
   8. **Lost**
4. Automation: form submission auto-creates an opportunity in "Opted In."
5. Automation: appointment booked → moves to "Call Booked."

---

## STEP 9 — STRIPE / PAYMENTS

1. Sub-account → **Payments → Integrations → Stripe → Connect**.
2. Log into your Stripe account, authorize GHL.
3. Create products:
   - **Anchored Starter** — $2,997 one-time
   - **Anchored Starter Retainer** — $297/mo recurring
   - **Anchored Pro** — $9,997 one-time
   - **Anchored Pro Retainer** — $497/mo recurring
   - **Anchored Enterprise** — $24,997 one-time
   - **Anchored Enterprise Retainer** — $1,497/mo recurring
4. Each product gets a **payment link**. These can be sent in email or embedded on a hidden "post-call checkout" page.

---

## STEP 10 — TRACKING + SEO

1. **Google Search Console:** Sub-account → Settings → Tracking → Add custom HTML in `<head>`. Verify via the HTML method.
2. **Google Analytics 4:** same place, paste GA4 tag.
3. **Schema markup (JSON-LD):** paste from SEO_PLAN.md section 5 into the same Tracking area, set to fire on the homepage only.
4. **Submit sitemap:** Sub-account → Sites → Funnels → Sitemap URL (auto-generated). Submit to Google Search Console.

---

## STEP 11 — TEST THE WHOLE FUNNEL

Before going live:
- [ ] Use your personal Gmail to opt in via the live form
- [ ] Confirm PDF downloaded
- [ ] Confirm Email 1 arrived in inbox (not spam)
- [ ] Wait 24h and confirm Email 2
- [ ] Book a test call on your own calendar
- [ ] Confirm SMS reminder fires
- [ ] Run through Stripe checkout in test mode
- [ ] Open the site on your iPhone — check every page in Safari + Chrome
- [ ] Lighthouse audit (built into Chrome DevTools) — fix anything red

---

## STEP 12 — GO LIVE

- [ ] Switch domain DNS to "live" (it's already pointed if Step 3 went smoothly)
- [ ] Announce via email to your existing list
- [ ] Post on LinkedIn + Instagram
- [ ] Pin a Google Business Profile post
- [ ] Tell 5 trusted contacts personally and ask for feedback

---

## iOS DAILY USAGE — LEADCONNECTOR APP

Once it's live, your iPhone runs the daily ops:

- **Inbox** — see every new opt-in and reply in one place
- **Calendar** — booked calls appear instantly
- **CRM** — swipe to move opportunities through stages
- **Conversations** — text and email a lead from your phone, replies sync back
- **Push notifications** — get pinged when a Pro / Enterprise lead opts in

> Recommend: turn ON push notifications for "Form Submitted" + "Appointment Booked." Mute everything else.

---

## COMMON GOTCHAS

| Problem | Fix |
|--------|-----|
| Emails landing in spam | Use Mailgun, warm the domain by sending to a few trusted contacts first, add SPF + DKIM records |
| SMS not sending | A2P 10DLC not yet approved — wait for it |
| Calendar shows wrong timezone | Sub-account timezone vs. calendar timezone mismatch |
| Form not redirecting | Page settings → On submit → Redirect URL |
| Stripe products don't show | Make sure you're using the same Stripe account in test/live mode consistently |
| Custom code not loading | Tracking section requires Sub-account level, not Agency level |

---

## WHAT GOOD LOOKS LIKE (DAY 30)

- 100+ visitors
- 30+ opt-ins
- 4–8 calls booked
- 1–3 closed (Starter or Pro)
- A2P 10DLC approved
- All emails reaching inbox (not spam)
- iPhone is your daily cockpit

Next: **SKOOL_WALKTHROUGH.md**
