# Deploy JARVIS 2 to Render.com (always-on cloud)

This puts JARVIS 2 on the internet, running 24/7, reachable from your phone —
no PC required. Cost: **Render Starter, ~$7/mo** (always-on + persistent disk).

You do **everything from a browser**. Total time: ~15 minutes, most of it
waiting for the first build.

> 🔐 **Golden rule:** your Claude key and passwords go ONLY into Render's
> **Environment** settings (private). Never paste a secret into chat, a file,
> or a commit.

---

## What you need first

1. A **Render account** — sign up free at https://render.com (GitHub login is easiest).
2. A **fresh Anthropic (Claude) API key** — https://console.anthropic.com → API Keys → Create Key. Copy it once; you'll paste it into Render in Step 4.
3. *(Optional, for texting JARVIS)* a **Telegram bot token** — message @BotFather → `/newbot` → copy the token.
4. *(Optional, for the premium butler voice)* an **ElevenLabs API key** — https://elevenlabs.io → Profile → API key.

---

## Step 1 — Start the Blueprint

1. Go to the Render Dashboard → **New +** → **Blueprint**.
2. Connect your GitHub and pick the repo **`mjunlimitedessentials/openclaw`**.
3. Render finds `render.yaml` automatically and shows a service named **`jarvis-2`**.
4. Confirm the branch is **`claude/jarvis-2-ai-assistant-6g95ce`**.
5. Click **Apply**.

Render now starts building the Docker image. **This first build takes ~8–12
minutes** (it compiles the whole app). That's normal — leave it running.

---

## Step 2 — While it builds, understand what got set for you

The blueprint already configured:

| Setting | Value | Why |
|---|---|---|
| Port | `8080` | The port JARVIS listens on |
| Bind | `--bind lan` | So Render can reach it from outside |
| Disk | `/data`, 1 GB | Durable memory + workspace (survives restarts) |
| `OPENCLAW_GATEWAY_TOKEN` | auto-generated | Bearer token for the API / live console |

You only need to fill in the **secret** values yourself — that's Step 3–4.

---

## Step 3 — Set your control-panel password

1. Open the **`jarvis-2`** service → **Environment** tab.
2. Find **`OPENCLAW_GATEWAY_PASSWORD`** → click **Add value**.
3. Type a strong password only you know. This is how you'll log into JARVIS's
   web panel. Save.

---

## Step 4 — Add your Claude key (and optional tokens)

Still on the **Environment** tab, click the value field for each and paste:

- **`ANTHROPIC_API_KEY`** → your fresh `sk-ant-...` key. **(required)**
- **`TELEGRAM_BOT_TOKEN`** → your @BotFather token. *(optional)*
- **`ELEVENLABS_API_KEY`** → your ElevenLabs key. *(optional — premium voice)*

Click **Save Changes**. Render redeploys automatically with the new values.

> If you ever expose a key by accident, revoke it at the provider and paste a
> new one here. Rotating is one click.

---

## Step 5 — Open JARVIS

1. When the service shows **Live** (green), copy its URL — it looks like
   `https://jarvis-2-xxxx.onrender.com`.
2. Open it in your browser. You'll get the JARVIS **control panel** login.
3. Log in with the **`OPENCLAW_GATEWAY_PASSWORD`** you set in Step 3.

You're in. From the panel you can chat with JARVIS, finish wiring the
persona/skills, and connect channels.

---

## Step 6 — Finish the persona + channels (in the panel)

The control panel is where JARVIS becomes *yours*:

- **Model** — confirm it's using your Claude key (Opus).
- **Persona** — load the JARVIS charter from `jarvis/JARVIS.md` and the
  config in `jarvis/openclaw.jarvis.example.json` (skills allowlist, voice,
  timezone, "call me MJ").
- **Telegram** — if you set the token, enable the channel and lock the DM
  policy to just you, then message your bot to say hello.
- **Voice** — with `ELEVENLABS_API_KEY` set, JARVIS speaks in the Daniel
  (British butler) voice on every reply.

> I can walk you through each of these live once the service is up — just tell
> me the URL is green and we'll go one at a time.

---

## Wiring the live web console (optional)

To make the showcase console at `jarvis/showcase/` talk to this cloud JARVIS
instead of the offline demo, copy `config.example.js` → `config.js` and set:

```js
window.JARVIS = {
  enabled: true,
  endpoint: "https://jarvis-2-xxxx.onrender.com",   // your Render URL, no trailing /v1
  token: "<OPENCLAW_GATEWAY_TOKEN from Render → Environment>",
  model: "default",
};
```

`config.js` is gitignored — never commit it. See `showcase/LIVE.md` for CORS notes.

---

## Costs & controls

- **Starter plan** is ~$7/mo and stays awake. The **Free** plan sleeps after
  15 min idle and has **no disk**, so JARVIS would forget everything — not
  suitable for an always-on assistant.
- Suspend anytime from the Render dashboard to stop billing.
- The `/data` disk is your durable brain; deleting the service deletes it, so
  export anything precious first.

---

## Troubleshooting

- **Build fails early** → check the **Logs** tab. Usually a transient npm/registry
  blip; click **Manual Deploy → Clear build cache & deploy**.
- **"Live" but the URL won't load** → confirm `OPENCLAW_GATEWAY_PASSWORD` is set
  (the gateway refuses an external bind without auth) and that both `PORT` and
  `OPENCLAW_GATEWAY_PORT` are `8080`.
- **Can't log in** → you're using the password from Step 3, not the Claude key.
- **JARVIS won't answer** → verify `ANTHROPIC_API_KEY` is set and valid, then
  **Manual Deploy** to restart.
