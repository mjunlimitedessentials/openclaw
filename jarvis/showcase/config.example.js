/* J.A.R.V.I.S. 2 showcase — LIVE config
 * ----------------------------------------------------------------------------
 * Copy this file to `config.js` (same folder) to make the console talk to your
 * REAL OpenClaw gateway instead of running the offline simulation.
 *
 *   cp jarvis/showcase/config.example.js jarvis/showcase/config.js
 *   # then edit the values below
 *
 * The console POSTs to `${endpoint}/v1/responses` (the gateway's OpenAI-compatible
 * Responses API) with `Authorization: Bearer ${token}`.
 *
 * SECURITY: config.js contains a token — it is gitignored. Never commit it, and
 * only point the browser at a gateway you control (localhost, or over your own
 * TLS/tunnel). See LIVE.md for CORS + safety notes.
 * ---------------------------------------------------------------------------- */
window.JARVIS = {
  // Must be true to leave the offline demo and talk to your gateway.
  // Leave false (or omit) and the console stays in safe demo mode.
  enabled: true,

  // Your gateway base URL (no trailing /v1). Examples:
  //   "http://localhost:8788"   (local daemon)
  //   "https://jarvis.yourdomain.com"
  endpoint: "http://localhost:8788",

  // Gateway auth token (OPENCLAW_GATEWAY_TOKEN). Leave "" if your gateway is
  // unauthenticated on loopback.
  token: "",

  // Model/agent to route to. "default" uses the gateway's default agent.
  model: "default",
};
