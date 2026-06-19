# Portfolio — Next.js 15 cinematic build

A premium AI-engineer portfolio: Next.js 15 + React 19 + TypeScript, Tailwind v4,
Framer Motion, GSAP, Lenis smooth scroll, and React Three Fiber for the hero scene.

## Quick start

```bash
npm install
cp .env.example .env       # optional — only used for NEXT_PUBLIC_SITE_URL and notify email
npm run dev                # http://localhost:3000
```

Production build:

```bash
npm run build && npm start
```

## What's inside

```
app/
  layout.tsx              # metadata, fonts, root providers
  page.tsx                # composes all sections
  globals.css             # Tailwind v4 + @theme tokens
  api/contact/route.ts    # POST endpoint, validates + rate-limits + persists JSONL
components/
  providers/              # Lenis (smooth scroll), global wrappers
  ui/                     # Nav, MagneticButton, SectionHeader, ScrollProgress, BackgroundFX
  sections/               # Hero · About · Experience · Projects · Pipeline · Skills · Education · Contact
lib/
  data.ts                 # all portfolio content (edit me!)
  utils.ts                # cn(), easing
```

## Editing content

All copy lives in `lib/data.ts` — profile, experiences, projects, skills, education, socials.
Change strings there and the whole site updates.

## Backend

`POST /api/contact` accepts `{ name, email, subject?, message }`, validates,
rate-limits to 5/IP/15min, and appends to `.data/messages.jsonl`.
Set `CONTACT_NOTIFY_EMAIL` in `.env` to log notifications server-side (wire a real
email provider — Resend / SendGrid / SES — when you deploy).

To read submissions:

```bash
cat .data/messages.jsonl
```

## Tech notes

- **Lenis** smooth scroll runs on every page; native scroll behavior is disabled. The Nav
  uses `window.__lenis.scrollTo(...)` for anchor jumps.
- **Custom cursor** activates only on hover-fine devices.
- **R3F scene** is `next/dynamic` with `ssr:false` so Three.js never ships to the SSR
  bundle.
- **Tailwind v4** with `@theme` tokens — no JS config file needed.
- **Reduced motion** is respected globally (`prefers-reduced-motion`).

## Deploying to Vercel

The repo is plug-and-play with Vercel — no config needed.

### Make the URL look professional

The default Vercel subdomain is temporary and long. Add a custom domain in the Vercel dashboard
so the site looks branded, for example:

```bash
prasiddha.com
www.prasiddha.com
portfolio.prasiddha.com
```

After connecting the domain, set `NEXT_PUBLIC_SITE_URL` to that final URL in Vercel.

### Option A — Vercel CLI (fastest)

```bash
npm install -g vercel       # one-time
vercel login                 # opens your browser
vercel                       # preview deploy
vercel --prod                # production deploy
```

The CLI auto-detects Next.js, asks a couple of questions, and uploads. After the
first deploy it remembers the project in `.vercel/` so re-deploys are one command.

### Option B — GitHub → Vercel dashboard

1. Push this repo to GitHub.
2. Go to <https://vercel.com/new>, "Import Git Repository", select the repo.
3. Vercel auto-detects **Next.js**. Keep all defaults. Click **Deploy**.
4. Every push to `main` triggers a production build; every PR gets a preview URL.

### Environment variables (optional)

In the Vercel dashboard → Project Settings → Environment Variables:

| Key                     | Value                                | Purpose                          |
|-------------------------|--------------------------------------|----------------------------------|
| `NEXT_PUBLIC_SITE_URL`  | `https://your-domain.com`            | SEO / OG / canonical URLs        |
| `CONTACT_NOTIFY_EMAIL`  | `you@example.com`                    | Tagged on function logs          |

### Contact form on Vercel

The form's JSONL writer falls back to **function logs** on serverless (the filesystem
is read-only). Submissions are visible via:

```bash
vercel logs <deployment-url> --since 1h
```

For real persistence, swap the file-write in `app/api/contact/route.ts` for one of:

- **Resend** (cleanest — send yourself an email per submission)
- **Vercel KV** / **Postgres** (durable storage)
- A Discord/Slack webhook

## Performance

Route `/`: ~13 kB page JS / ~160 kB total first load (includes Three.js + R3F + drei).
The 3D scene is `next/dynamic` with `ssr:false` so Three.js never lands in the SSR bundle.
