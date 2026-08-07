# ALTAVIA

Aerospace / UAV studio site. React + Vite + Tailwind v4 + Framer Motion + React Three Fiber.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```

## Deploy

This is a standard static Vite build (`dist/`), so it deploys as-is to Vercel, Netlify,
Cloudflare Pages, or any static host:

- **Vercel / Netlify**: connect the repo — both auto-detect Vite (`npm run build`, output `dist`). No extra config needed.
- **Any static host**: run `npm run build` and upload the contents of `dist/`.
