# Going live — connect the console to your real JARVIS

By default the Capabilities Console (`showcase/index.html`) is an **offline
simulation** — canned responses, no network. Flip it to **live** and it talks to
your actual OpenClaw gateway over the gateway's OpenAI-compatible
**`/v1/responses`** endpoint, so JARVIS answers with your real tools and data.

## 1. Run your gateway
Get JARVIS running first (see `../README.md`):
```bash
./jarvis/setup.sh
openclaw onboard --install-daemon   # first time
openclaw gateway                     # starts the gateway (note its URL + port)
```
Have your **gateway token** ready (`OPENCLAW_GATEWAY_TOKEN` from `~/.openclaw/.env`).

## 2. Point the console at it
```bash
cp jarvis/showcase/config.example.js jarvis/showcase/config.js
```
Edit `config.js`:
```js
window.JARVIS = {
  endpoint: "http://localhost:8788",   // your gateway base URL (no /v1)
  token: "your-OPENCLAW_GATEWAY_TOKEN", // "" if unauthenticated on loopback
  model: "default",
};
```
`config.js` is **gitignored** — it holds a token, so it never gets committed.

## 3. Serve and open
```bash
npx serve jarvis           # then open /showcase/ (or /hq/ and click the console)
```
The header flips to **"connected to gateway"**, the greeting says *live*, and every
message you send (chips included) POSTs to your gateway and streams back the real
answer. On an error it tells you exactly what failed.

## How the wiring works
- **Request:** `POST {endpoint}/v1/responses`
  `Authorization: Bearer {token}`
  `{ "model": "default", "input": "<your message>", "stream": false }`
- **Reply:** read from `output[].content[]` where `type == "output_text"`.
- Code lives in `liveSend()` inside `index.html` — swap `stream:false` handling for
  SSE if you want token-by-token streaming (the gateway emits
  `response.output_text.delta` events).

## CORS (the usual gotcha)
A browser page calling the gateway is a cross-origin request. Serve the page from
an origin your gateway allows, or run both behind the same reverse proxy / tunnel.
If you see a CORS error in the console, that's the fix — not a token problem. See
`docs.openclaw.ai` for the gateway's allowed-origins / proxy settings.

## Safety
- Only point the browser at a gateway **you control** (localhost or your own TLS).
- The token grants access to your assistant — treat `config.js` like a password
  file. It's gitignored for that reason.
- JARVIS keeps its **draft-don't-send** and confirm-before-irreversible rules in
  live mode — those live in the persona/skills, not this UI.
