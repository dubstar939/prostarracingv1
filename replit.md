# Pro Star-Racing

A React + Three.js racing game running on a custom Express + Vite dev server.

## Stack

- **Runtime:** Node.js 20
- **Frontend:** React 19, Vite 6, Tailwind CSS v4, Three.js (`@react-three/fiber`, `@react-three/drei`, `@react-three/cannon`)
- **Server:** Express with Vite middleware (dev) / static `dist` (prod)
- **Language:** TypeScript (`tsx` for runtime)
- **Optional API:** Google Gemini (`@google/genai`) — uses `GEMINI_API_KEY` env var if present

## Project Layout

- `server.ts` — Express server that mounts Vite in middleware mode (dev) or serves the built `dist/` (prod)
- `index.html` — Vite entrypoint
- `src/` — React app source (game logic, components, services)
- `vite.config.ts` — Vite config with React + Tailwind plugins and `@` alias to project root
- `generate-cover.ts` — Optional Gemini cover generator script

## Replit Setup

- The dev workflow (`Start application`) runs `npm run dev`, which boots `server.ts` on port **5000** with host `0.0.0.0`.
- Vite dev middleware has `allowedHosts: true` so the Replit iframe proxy works.
- HMR is disabled for compatibility with the Replit proxy (full page reload on save).
- Dev responses send no-cache headers so the preview iframe always shows fresh content.

## Deployment

Configured for **Autoscale**:
- Build: `npm run build`
- Run: `npm run start` (serves the built SPA via Express on `$PORT`, defaults to 5000)
