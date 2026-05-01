#!/usr/bin/env bash
# Business Ops — Daily Briefing Environment Health Check
# Run before the AI agent daily briefing to verify all integrations are reachable.
# This script does NOT access live data — it checks tool/env availability only.

set -euo pipefail

PASS="✓"
FAIL="✗"
WARN="⚠"
ERRORS=0
WARNINGS=0

header() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  MJU Unlimited Essentials — Daily Briefing"
  echo "  $(date '+%A, %B %-d, %Y  %-I:%M %p')"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
}

check_env() {
  local label="$1"
  local var="$2"
  if [[ -n "${!var:-}" ]]; then
    echo "  $PASS $label"
  else
    echo "  $WARN $label — \$$var not set (agent will use MCP fallback)"
    ((WARNINGS++)) || true
  fi
}

check_cmd() {
  local label="$1"
  local cmd="$2"
  if command -v "$cmd" &>/dev/null; then
    echo "  $PASS $label ($cmd)"
  else
    echo "  $FAIL $label — '$cmd' not found in PATH"
    ((ERRORS++)) || true
  fi
}

check_openclaw_gateway() {
  echo "  Checking OpenClaw gateway..."
  if openclaw gateway status &>/dev/null 2>&1; then
    echo "  $PASS OpenClaw gateway running"
  else
    echo "  $WARN OpenClaw gateway not detected — agent may run standalone"
    ((WARNINGS++)) || true
  fi
}

section() {
  echo ""
  echo "  ── $1"
}

header

# ── Runtime
section "Runtime"
check_cmd "Node.js" "node"
check_cmd "OpenClaw CLI" "openclaw"

# ── MCP Integrations (env-based check)
section "MCP Integrations"
check_env "Stripe" "STRIPE_SECRET_KEY"
check_env "Notion" "NOTION_API_KEY"
check_env "Google Calendar" "GOOGLE_CALENDAR_API_KEY"
# Gmail uses OAuth — check for token file as proxy
if [[ -f "$HOME/.config/gmail/token.json" ]] || [[ -n "${GMAIL_OAUTH_TOKEN:-}" ]]; then
  echo "  $PASS Gmail (token present)"
else
  echo "  $WARN Gmail — no token file at ~/.config/gmail/token.json (MCP may handle auth)"
  ((WARNINGS++)) || true
fi

# ── OpenClaw Gateway
section "OpenClaw Gateway"
check_openclaw_gateway

# ── Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [[ $ERRORS -eq 0 && $WARNINGS -eq 0 ]]; then
  echo "  $PASS All systems ready. Proceed with AI briefing."
elif [[ $ERRORS -eq 0 ]]; then
  echo "  $WARN Ready with $WARNINGS warning(s). Briefing can proceed."
  echo "      Check warnings above — some integrations may be limited."
else
  echo "  $FAIL $ERRORS error(s) detected. Fix before running full briefing."
  echo "      $WARNINGS warning(s) also noted."
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Exit non-zero only on hard errors (missing required commands)
exit $ERRORS
