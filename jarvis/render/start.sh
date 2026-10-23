#!/usr/bin/env bash
# JARVIS 2 — Render startup.
# Seeds the persistent workspace on the mounted /data disk (so the persona and
# memory survive redeploys), then starts the gateway with the Render config.
set -euo pipefail

WORKSPACE="${OPENCLAW_WORKSPACE:-/data/workspace}"
STATE_DIR="${OPENCLAW_STATE_DIR:-/data/.openclaw}"
REPO_JARVIS="/app/jarvis"

mkdir -p "$WORKSPACE" "$STATE_DIR"

# Seed persona + heartbeat into the workspace once (don't clobber edits made in the panel).
for f in JARVIS.md HEARTBEAT.md; do
  if [ ! -f "$WORKSPACE/$f" ] && [ -f "$REPO_JARVIS/$f" ]; then
    cp "$REPO_JARVIS/$f" "$WORKSPACE/$f"
    echo "seeded $WORKSPACE/$f"
  fi
done

echo "JARVIS 2 gateway starting — workspace=$WORKSPACE state=$STATE_DIR config=${OPENCLAW_CONFIG_PATH:-<default>}"
exec node openclaw.mjs gateway --allow-unconfigured --bind lan
