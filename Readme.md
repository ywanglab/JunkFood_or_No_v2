# Junk or No

A beginner-friendly Next.js app that tells users whether a typed food item is commonly considered junk food or not.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

`npm run build` creates the deployable OpenNext Worker bundle. Wrangler also
runs `npm run build:cloudflare` before a direct upload, ensuring that the
required `.open-next/worker.js` and compiled OpenNext configuration exist.

## Image recognition

Food-photo recognition uses the Cloudflare Workers AI binding and the
`@cf/moondream/moondream3.1-9B-A2B` image-to-text model. No separate API key or
one-time model-license request is required. The `AI` binding is declared in
`wrangler.jsonc` and becomes available after the app is redeployed.
