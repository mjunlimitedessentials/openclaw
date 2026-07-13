#!/usr/bin/env bash
# J.A.R.V.I.S. 2 — bootstrap & validate
# Scaffolds the workspace + config, checks prerequisites, and validates the
# example config JSON. Safe to re-run: it never overwrites existing files.
#
# Usage:
#   ./jarvis/setup.sh            # scaffold into ~/jarvis and ~/.openclaw
#   JARVIS_HOME=~/work/jarvis ./jarvis/setup.sh   # custom workspace path
set -euo pipefail

SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
JARVIS_HOME="${JARVIS_HOME:-$HOME/jarvis}"
OPENCLAW_DIR="${OPENCLAW_STATE_DIR:-$HOME/.openclaw}"

say()  { printf '\033[1;36m▸ %s\033[0m\n' "$*"; }
ok()   { printf '\033[1;32m✓ %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m! %s\033[0m\n' "$*"; }
copy_if_absent() { # src dst
  if [ -e "$2" ]; then warn "exists, skipping: $2"; else mkdir -p "$(dirname "$2")"; cp -R "$1" "$2"; ok "created $2"; fi
}

say "JARVIS 2 setup"
echo "  source:     $SRC_DIR"
echo "  workspace:  $JARVIS_HOME"
echo "  openclaw:   $OPENCLAW_DIR"
echo

# 1) Prerequisites -----------------------------------------------------------
say "Checking prerequisites"
if command -v node >/dev/null 2>&1; then
  NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
  if [ "$NODE_MAJOR" -ge 22 ]; then ok "node $(node -v)"; else warn "node $(node -v) — OpenClaw needs Node >= 22"; fi
else
  warn "node not found — install Node >= 22 (https://nodejs.org)"
fi
command -v openclaw >/dev/null 2>&1 && ok "openclaw present" || warn "openclaw not found — run: npm install -g openclaw@latest"
command -v mcporter >/dev/null 2>&1 && ok "mcporter present" || warn "mcporter not found (optional) — npm install -g mcporter"
echo

# 2) Scaffold workspace ------------------------------------------------------
say "Scaffolding workspace ($JARVIS_HOME)"
mkdir -p "$JARVIS_HOME"
copy_if_absent "$SRC_DIR/JARVIS.md"    "$JARVIS_HOME/JARVIS.md"
copy_if_absent "$SRC_DIR/HEARTBEAT.md" "$JARVIS_HOME/HEARTBEAT.md"
copy_if_absent "$SRC_DIR/skills"       "$JARVIS_HOME/skills"
copy_if_absent "$SRC_DIR/supabase"     "$JARVIS_HOME/supabase"
echo

# 3) Scaffold OpenClaw config + env -----------------------------------------
say "Scaffolding OpenClaw config ($OPENCLAW_DIR)"
mkdir -p "$OPENCLAW_DIR"
copy_if_absent "$SRC_DIR/openclaw.jarvis.example.json" "$OPENCLAW_DIR/openclaw.json"
copy_if_absent "$SRC_DIR/.env.jarvis.example"          "$OPENCLAW_DIR/.env"
echo

# 4) Validate JSON -----------------------------------------------------------
say "Validating config JSON"
for f in "$SRC_DIR/openclaw.jarvis.example.json" "$SRC_DIR/mcp/mcporter.jarvis.example.json"; do
  if node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" "$f" 2>/dev/null; then
    ok "valid: $(basename "$f")"
  else
    warn "INVALID JSON: $f"
  fi
done
echo

# 5) Next steps --------------------------------------------------------------
say "Next steps"
cat <<EOF
  1. Edit  $JARVIS_HOME/JARVIS.md   → fill in Business context + Pre-authorized actions
  2. Edit  $OPENCLAW_DIR/openclaw.json → set workspace to "$JARVIS_HOME",
           skills.load.extraDirs to "$JARVIS_HOME/skills", and your timezone
  3. Edit  $OPENCLAW_DIR/.env       → add TELEGRAM_BOT_TOKEN + your model key
  4. Wire sub-agents: merge servers from $SRC_DIR/mcp/mcporter.jarvis.example.json
           into your mcporter config, then: mcporter list
  5. Long-term memory: apply $JARVIS_HOME/supabase/schema.sql to your Supabase project
  6. Start it:  openclaw onboard --install-daemon   (first time)  then  openclaw gateway
  7. Message your Telegram bot: "What's my day look like?"

  Full walkthrough: $SRC_DIR/README.md   ·   Command cheatsheet: $SRC_DIR/CHEATSHEET.md
EOF
ok "Setup scaffold complete."
