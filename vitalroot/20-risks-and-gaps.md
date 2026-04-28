# 20 — Risks, Gaps & Recommendations

## Risk Register

### Critical Risks

#### RISK-01: Medical Liability Without Clinical Oversight
**Level:** Critical
**Description:** Any health platform in this space is one piece of bad advice away from a serious liability event — especially for kidney disease users where dietary errors can be acutely dangerous.

**Mitigations:**
- All condition-specific content requires clinician review before publish (enforced in CMS)
- Global disclaimers on every surface
- Chatbot hard-coded guardrails that cannot be overridden by user prompting
- Kidney disease users get extra caution on ALL herb/supplement content regardless of general herb safety profile
- Regular content review schedule (every 6 months, earlier if medical guidelines change)
- Legal counsel to review content standards before launch (health law specialty)
- Retain at least 1 MD and 2 RDs as advisors with formal review contracts

**Residual risk after mitigations:** Medium. Cannot be fully eliminated; requires ongoing diligence.

---

#### RISK-02: Crisis Escalation Failure
**Level:** Critical
**Description:** A user in genuine mental health crisis receives inadequate escalation — either the system misses it or the resources offered are wrong/outdated.

**Mitigations:**
- Multi-signal crisis detection (keywords + semantic classifier + explicit disclosure)
- Explicit safety question in "I'm struggling today" flow (not left to AI inference alone)
- Crisis resources stored in admin-editable CMS (no code deploy to update 988 contact)
- Crisis resource URLs tested weekly (automated uptime check)
- No AI response after crisis disclosure — safety-only response, human resources only
- Monthly internal testing of all escalation paths
- Staff training on recognizing patterns in safety event logs

**Gap identified:** The platform currently has no warm handoff to a human counselor. In Phase 2, explore integration with Crisis Text Line's partner API to enable warm transfer within app.

---

#### RISK-03: Chatbot Tone Drift / Prompt Injection
**Level:** High
**Description:** Claude API models can sometimes be manipulated through adversarial user prompts ("ignore your previous instructions") or can drift in tone over long conversations.

**Mitigations:**
- System prompt includes explicit instructions for handling attempts to bypass safety rules
- Conversation length limit (30 messages → new session prompt reset)
- Rate limiting (20 chatbot requests/minute) prevents rapid injection attempts
- Monthly audit of sampled conversations for tone drift
- Safety classifier runs in parallel — not dependent on model's self-compliance

**Recommendation:** Implement an independent safety classifier (simpler model or rule-based) that checks every AI response before streaming to client. Do not rely solely on Claude's internal adherence.

---

#### RISK-04: Cultural Representation Gaps
**Level:** High
**Description:** If we don't have authentic, well-researched representation across all promised cuisines, users from underrepresented communities will feel the same dismissal they feel everywhere else — and we'll lose them, likely permanently.

**Mitigations:**
- Before launch: explicit review by community advisors for each cuisine category (not just dietitians — also cooks and community members)
- Recipe testing: all published recipes tested by someone from that food tradition
- Do not launch a cuisine category with fewer than 8 recipes — better to say "coming soon"
- Hire or contract writers with lived cultural experience for each cuisine cluster
- Community advisory panel (Phase 2): paid advisors from target communities who review content quarterly

**Current gap:** No formal community advisory structure exists yet. This must be built before content library expands.

---

### High Risks

#### RISK-05: SEO Content Quality at Scale
**Description:** Programmatic SEO pages (recipe × condition, city pages) will generate hundreds of pages. If page quality is low, Google may penalize the entire domain.

**Mitigations:**
- Minimum content standards per programmatic page type (defined in `11-seo-strategy.md`)
- No programmatic page launches without unique intro copy
- Quality threshold: page must have ≥5 verified resources (city pages) or ≥3 recipes (cuisine × condition)
- Monitor for manual actions in Google Search Console
- Start with 20 city pages, evaluate quality signal before expanding to 200

---

#### RISK-06: Data Privacy for Health Information
**Description:** Users share sensitive health condition information. A breach or improper data use would be catastrophic to trust.

**Mitigations:**
- Conditions stored as enum keys (not free text) — minimizes sensitivity
- No PHI collected that triggers HIPAA without explicit BAA
- Encrypt all user data at rest (Neon encryption + application-level for conditions)
- Zero third-party data selling or sharing — stated explicitly in privacy policy
- Data deletion: user-initiated account deletion removes all personal data within 30 days
- GDPR-aware data architecture even if US-only at launch (right to export, right to delete)
- Annual penetration testing starting Year 1

---

#### RISK-07: AI Cost Scaling
**Description:** Claude Opus 4-7 is expensive at scale. If chatbot usage is high, AI costs could become unsustainable.

**Mitigations:**
- Prompt caching on static system prompt (90% cost reduction on cached tokens)
- Conversation context window limit (last 15 messages, not full history)
- Use claude-sonnet-4-6 for lower-stakes operations (recipe suggestions, search)
- Rate limiting per user (20 req/min, daily limit in free tier)
- Free tier: 20 chatbot messages/day limit; VitalRoot+ unlimited
- Monitor cost per user monthly; adjust limits if needed

---

#### RISK-08: User Retention After Onboarding
**Description:** Many health apps see 80%+ drop-off after Week 1. If we don't deliver immediate, personalized value, users leave before the product can help them.

**Mitigations:**
- Day 1 value delivery: first recipe shown must feel genuinely personalized (cuisine + condition match)
- No empty states at onboarding completion — pre-populated feed from Day 1
- Week 1 email sequence (gentle, non-pushy, personalized to their stated goal)
- "I'm struggling today" flow is prominently accessible — meets users where they are
- No streak mechanics that punish absence
- Re-engagement flow at Day 7 inactivity (gentle, not guilt-based)

---

## Identified Gaps

### Gap 1: PCOS / Hormonal Conditions Not Explicitly in MVP Condition List

Tanya's persona (PCOS) is a large user segment (1 in 10 women of reproductive age) with significant overlap with insulin resistance and weight health. PCOS is not in the MVP condition list.

**Recommendation:** Add PCOS as a sub-category under "Weight & Wellness" at MVP with:
- Condition tag on relevant recipes (insulin-resistance-aware, anti-inflammatory)
- Herb pages for inositol and berberine (commonly used for PCOS, needed for safety + evidence info)
- Blog article: "PCOS, Insulin Resistance, and Food: What Actually Helps"

---

### Gap 2: No Mental Health Professional Integration

The chatbot can detect crisis and escalate to 988, but it cannot connect users to therapists who specialize in chronic illness adjustment, disordered eating recovery, or caregiver burnout.

**Recommendation (Phase 2):**
- Add `mental_health` as a resource type in local resource finder
- Partner with Psychology Today or Headway for therapist directory data
- Filter for: chronic illness experience, sliding scale, telehealth
- Chatbot should offer this proactively when Tanya-like patterns detected (disordered eating history, food anxiety language)

---

### Gap 3: Caregiver Mode Is on the Roadmap But Not Designed

Marcus (caregiver persona) represents a significant segment who can't currently use the app effectively. Caregiver needs are architecturally different from patient needs.

**Recommendation for Caregiver Mode Design (Phase 2):**
- Caregiver creates their own account, links to care recipient's account (with explicit consent)
- Caregiver sees: care recipient's condition filters applied to their recipe/exercise browsing
- Caregiver can share content to care recipient
- Multi-condition filtering (Marcus needs diabetes + CHF simultaneously)
- Caregiver emotional wellness section: caregiver burnout content, respite resources, support groups for caregivers

---

### Gap 4: Offline / Low-Connectivity Access

Many target users (rural, lower-income, older device users) may have limited internet access. A fully online app fails them.

**Recommendation (Phase 2):**
- Cache last 10 viewed recipes locally (PWA service worker)
- Cache user's saved recipes for offline access
- Cache today's exercise and recipe suggestion offline
- Offline indicator in UI when connection lost

---

### Gap 5: No Clinical Lab Value Integration

Users like David (pre-hypertension) and Marlene (high A1C) would benefit from tracking their actual lab numbers over time — not just behaviors.

**Recommendation (Phase 2):**
- Manual lab value logging: A1C, fasting glucose, blood pressure, cholesterol panels
- Visual trend charts (A1C over 12 months is powerful for motivation)
- Lab value targets shown (based on ADA, AHA guidelines) with careful disclaimer framing
- "Prepare for your lab conversation" chatbot feature: input recent values, get plain-language interpretation and questions to ask your doctor

---

## What's Missing From This Architecture Document

| Missing Element | Severity | Recommendation |
|----------------|----------|---------------|
| Revenue model unit economics model | High | Build before Phase 2 pricing decisions |
| Full accessibility audit framework | High | Engage disability community testers before launch |
| Content moderation playbook | High | Required before any user-generated content |
| App store submission plan | Medium | iOS/Android submission 6 weeks before launch target |
| Influencer/community marketing plan | Medium | Identify diabetes and CKD community advocates |
| B2B product spec | Medium | Needed before Phase 3 employer licensing |
| Data retention and deletion SLAs | High | Required for privacy policy and legal compliance |
| International expansion plan | Low | US-first; revisit at Month 18 |
| Clinical trial / outcomes measurement | Low | Long-term credibility and B2B sales tool |
| Insurance billing / CPT code mapping | Low | Long-term if pursuing clinical reimbursement |

---

## Final Recommendations

### Before Any Code Is Written
1. **Secure clinical advisors** — minimum 1 MD, 2 RDs under formal contract. Without this, content cannot be published.
2. **Establish community advisors** — paid relationships with 2–3 community members from primary target demographics (Black women with diabetes, Latino CKD patients, caregivers).
3. **Get health law counsel** — one session with a health law attorney reviewing your content standards and disclaimers before launch.

### At Launch
4. **Do not launch with fewer than 25 recipes** — an empty recipe library immediately signals to users that the platform isn't ready.
5. **Do not launch a cuisine category without 8+ recipes** — partial representation is worse than honest "coming soon."
6. **Red-team the chatbot before launch** — hire 5–10 beta testers specifically to try to break the safety guardrails.

### For Sustainable Growth
7. **Measure empathy, not just engagement** — build qualitative user feedback loops. Monthly 5-minute check-in survey. Track "felt seen" as a metric alongside DAU.
8. **Invest in food photography** — the difference between a platform that feels real and one that feels generic is often the photos. Budget $5,000–10,000 for diverse, authentic food photography at launch.
9. **Build the newsletter audience from Day 1** — organic email list is the most resilient owned channel if search or social algorithms shift.
10. **Be honest about what you're not** — users who come expecting telehealth will be disappointed. Clear positioning from the first touchpoint prevents churn from expectation mismatch.
