# Deploy JARVIS HQ — a public, no-login shareable link

The Claude **artifacts** (linked in `README.md`) are perfect for you when signed in,
but they're **private by default** — anyone else sees "Sign in" until you make them
public from the artifact's Share menu.

For a link **anyone can open with no login** (clients, teammates), host the folder
on a free static host. All three surfaces (HQ, Console, Brain) work together because
they're served from one place with their normal relative links.

> Deploy the **`jarvis/` folder**. Its `index.html` redirects to `hq/`, and the HQ
> tiles link to `./brain/` and `./showcase/` — all relative, so everything just works.

## Option A — Netlify Drop (fastest, no account needed to try)
1. Go to **https://app.netlify.com/drop**
2. Drag the **`jarvis` folder** onto the page.
3. You get a public URL instantly (e.g. `random-name.netlify.app`). Open it → it
   lands on HQ. Share that link with anyone.
4. Make a free account to keep it permanent and set a custom name.

## Option B — Cloudflare Pages / Vercel (permanent, free)
- **Vercel:** `npm i -g vercel` then run `vercel` inside the `jarvis` folder, follow
  the prompts → public URL.
- **Cloudflare Pages:** create a project, connect the repo (set the build output /
  root directory to `jarvis`), deploy.

## Option C — GitHub Pages (from this repo)
Note: this repo is **private**, so Pages needs GitHub Pro/Team, or make a small
public repo containing just the `jarvis/` folder.
1. Repo **Settings → Pages** → Source: your branch, folder: `/jarvis` (or `/root`
   if you put the files at the repo root of a dedicated public repo).
2. Pages gives you `https://<user>.github.io/<repo>/` → open `/hq/`.

## Notes
- The public site shows the **demo** console (the offline simulation) — which is
  exactly what you want to share. The **live** console only talks to *your* gateway
  and only from a machine that can reach it (localhost / your tunnel), so live mode
  isn't used on a public URL.
- Don't deploy `showcase/config.js` (it holds your gateway token — it's gitignored,
  so it won't be in the repo anyway).
- Want the site to open on HQ at the root? It already does — `jarvis/index.html`
  redirects to `hq/`.
