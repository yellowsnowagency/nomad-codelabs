# NOMAD // CODELABS

The marketing site for **Nomad Code Labs** — a borderless software house.
Ultra-modern monospace minimalism with a "Terminal Atlas" aesthetic: true-black
canvas, hairline blueprint grid, a single signal-lime accent, a live
multi-timezone clock, and the product catalogue presented as a numbered
technical manifest.

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4**
- Type pairing: **Martian Mono** (display) + **IBM Plex Mono** (body)

## Structure

```
app/
  layout.tsx              Root layout — fonts, atlas backdrop, Nav + Footer
  page.tsx                Home — hero, manifest, approach, beta CTA
  beta/page.tsx           Beta program page
  products/[slug]/        Per-product subpages (SSG, one per catalogue entry)
  api/beta/route.ts       Beta waitlist intake endpoint
  lib/products.ts         Single source of truth for the product catalogue
  components/             Nav, Footer, WorldClock, Reveal, StatusPill, BetaForm
```

Every product lives in `app/lib/products.ts`. Add an entry there and it
automatically appears in the home manifest, the footer, the beta selector, and
gets its own statically-generated `/products/<slug>` page.

## Develop

```bash
npm run dev      # http://localhost:3000
npm run build    # production build (prerenders all product pages)
npm run start    # serve the production build
```

## Beta waitlist

`POST /api/beta` validates the email and acknowledges the signup. It currently
logs server-side — wire it to a store (Neon / Upstash on the Vercel Marketplace)
and **Resend** at the single `TODO(integration)` marker in
`app/api/beta/route.ts` to persist signups and send confirmations.

## Deploy

Optimised for Vercel. Push the repo and import it, or `vercel --prod`.

---

© 2026 Nomad Code Labs · Distributed · Nomad-based · Worldwide
