# FinanceOps — Revenue & Financial Operations

## Table of Contents

1. [Daily Finance Checks](#daily-finance-checks)
2. [Stripe Operations Reference](#stripe-operations-reference)
3. [Revenue Reporting](#revenue-reporting)
4. [Subscription Management](#subscription-management)
5. [Invoicing Workflow](#invoicing-workflow)
6. [Refund Protocol](#refund-protocol)
7. [Dispute Handling](#dispute-handling)
8. [Anomaly Detection Rules](#anomaly-detection-rules)
9. [Authorization Thresholds](#authorization-thresholds)

---

## Daily Finance Checks

Run these every morning as part of daily briefing:

```
1. list_payment_intents (last 24h, status=failed)     → flag failed payments
2. list_disputes (status=needs_response)               → urgent: respond within 7 days
3. list_subscriptions (status=past_due)                → customers to contact
4. retrieve_balance                                     → current available balance
5. list_invoices (status=open, due_date=today)        → invoices due today
```

Surface counts only in daily briefing. Drill into details on request.

---

## Stripe Operations Reference

### Read Operations (no confirmation needed)

| Operation | Tool | Notes |
|---|---|---|
| List customers | `list_customers` | Filter by email, date, status |
| Search customer | `search_stripe_resources` | Use email or name |
| View subscription | `list_subscriptions` | Filter by customer, status |
| Check balance | `retrieve_balance` | Available + pending |
| List invoices | `list_invoices` | Filter by status, customer |
| List disputes | `list_disputes` | Always check `needs_response` |
| List refunds | `list_refunds` | Audit trail |
| Payment history | `list_payment_intents` | Filter by status, date |
| List coupons | `list_coupons` | Active discounts |
| Fetch resource | `fetch_stripe_resources` | By Stripe ID |

### Write Operations (require confirmation)

| Operation | Tool | Confirmation threshold |
|---|---|---|
| Issue refund | `create_refund` | Always confirm; auto-approve ≤ $50 only if customer complaint is valid |
| Create invoice | `create_invoice` + `create_invoice_item` | Confirm amount and customer |
| Finalize invoice | `finalize_invoice` | Confirm before sending |
| Cancel subscription | `cancel_subscription` | Always confirm with owner |
| Update subscription | `update_subscription` | Confirm plan change and effective date |
| Create coupon | `create_coupon` | Confirm: discount %, duration, max redemptions |
| Create payment link | `create_payment_link` | Confirm product and price |
| Create product | `create_product` | Confirm before creating |
| Create price | `create_price` | Confirm amount and billing period |

---

## Revenue Reporting

When asked for revenue report, calculate and present:

**MRR (Monthly Recurring Revenue)**:
- Sum all active subscription amounts normalized to monthly
- Segment by plan tier if multiple tiers exist

**Key metrics to include**:
```
MRR:           $X,XXX
New MRR:       $XXX  (new subscriptions this month)
Churned MRR:   $XXX  (cancelled/expired this month)
Net MRR Change: +/- $XXX
Active subs:   XX
Past due:      XX  ← flag if > 0
Disputes open: XX  ← flag if > 0
Refunds (30d): $XXX
```

**Trend check**: Compare current MRR to 30d, 60d, 90d ago using `stripe_api_execute` with date filters.

For detailed analytics use `vidiq_channel_analytics` if YouTube is a revenue channel.

---

## Subscription Management

### Customer Lifecycle States

```
Trial → Active → Past Due → Cancelled/Churned
                    ↓
              Grace Period (72h) → Dunning email draft → Owner reviews
```

### Past Due Protocol

When a subscription is `past_due`:

1. Check how many days past due via `fetch_stripe_resources`
2. Check if customer has contacted support (search Gmail via CommsOps)
3. Draft a polite payment reminder email — do not send without owner approval
4. If > 7 days past due + no contact: surface to owner for decision (cancel vs. outreach)

### Cancellation Protocol

When cancelling a subscription:
1. Confirm with owner first
2. Check if customer has open refund eligibility
3. Record reason in customer notes via `stripe_api_execute` (metadata update)
4. Hand off to CommsOps to draft a retention email if owner wants to attempt save

### Upgrade/Downgrade

For plan changes:
1. Confirm new plan ID and proration behavior with owner
2. Use `update_subscription` with `proration_behavior=create_prorations`
3. Log change in Notion customer record (ContentOps or directly)

---

## Invoicing Workflow

For one-off invoices (consulting, custom work):

```
1. create_customer (if new) — confirm email and name
2. create_invoice (customer_id, collection_method='send_invoice', days_until_due=7)
3. create_invoice_item (invoice_id, amount in cents, description)
4. Review with owner → confirm amounts
5. finalize_invoice → triggers Stripe email to customer
6. Monitor: list_invoices to track payment
```

Never finalize an invoice without owner review of the line items.

---

## Refund Protocol

### Auto-approve criteria (≤ $50, all must be true):

- Customer purchased within 30 days
- Customer has not previously received a refund
- Stated reason is a valid product/access issue (not "changed mind" for digital goods)
- No dispute currently open for this payment

### Standard process:

```
1. Verify purchase: fetch_stripe_resources (payment_intent or charge ID)
2. Check refund history: list_refunds (customer)
3. Assess eligibility against criteria above
4. If auto-approve: create_refund → notify owner of action taken
5. If above threshold: present case to owner with recommendation
6. Draft CommsOps response to customer (do not send until refund confirmed)
```

### Partial refunds:

For partial refunds (e.g., course partial completion), always confirm percentage with owner.

---

## Dispute Handling

Disputes (chargebacks) are high-priority — Stripe requires a response within 7 days.

### On receiving a dispute:

1. Immediately flag to owner: "DISPUTE ALERT: [customer] filed chargeback for $[amount] — respond by [date]"
2. Gather evidence via `fetch_stripe_resources`:
   - Purchase receipt / payment confirmation
   - Course access logs (if available)
   - Any communication records (from CommsOps)
3. Submit evidence via `update_dispute` with supporting documentation
4. Never ignore a dispute — uncontested disputes always result in a loss + $15 fee

**Evidence to always collect**:
- Proof of purchase (Stripe payment confirmation)
- Proof of delivery (course access granted, emails sent)
- Communications with customer (from Gmail)
- Terms of service acceptance timestamp if available

---

## Anomaly Detection Rules

Flag immediately to owner when:

| Condition | Threshold | Action |
|---|---|---|
| Failed payments spike | > 3 in one hour | ALERT owner |
| Chargeback filed | Any | ALERT immediately |
| Refund rate | > 5% of monthly revenue | WARN owner |
| Revenue drop | > 20% week-over-week | WARN owner |
| Duplicate charge | Same customer, same amount, within 1h | ALERT, check before any action |
| Unusual geolocation | Card country ≠ customer's usual country | WARN |

---

## Authorization Thresholds

| Action | Limit | Requires |
|---|---|---|
| Refund | ≤ $50 | Auto-approve if criteria met |
| Refund | > $50 | Owner confirmation |
| Coupon | Any | Owner confirmation + audit log |
| Subscription cancel | Any | Owner confirmation |
| New product/price | Any | Owner confirmation |
| Invoice finalize | Any | Owner review of line items |
| Dispute response | Any | Owner review of evidence |
