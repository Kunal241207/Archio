# Archio

An AI-first design environment for visualizing, rendering, and shipping architectural projects — built with React Router v7, TypeScript, and TailwindCSS v4.

## Stack

- **React Router v7** — file-based routing with SSR
- **React 19** — UI framework
- **TailwindCSS v4** — utility-first styling with custom theme tokens
- **TypeScript** — strict types throughout
- **Puter.js** — auth and cloud storage
- **Lucide React** — icons
- **Vite** — dev server and bundler

## Getting Started

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run typecheck` | Type-check with `tsc` |

## Project Structure

```
app/
  routes/
    home.tsx          # Landing page
  root.tsx            # App shell, auth state, font links
  app.css             # Global styles and BEM component classes
components/
  Navbar.tsx          # Top navigation
  ui/
    Button.tsx        # Reusable button with BEM variant/size props
lib/
  puter.action.ts     # Puter auth helpers
```

## Deployment

### Docker

```bash
docker build -t archio .
docker run -p 3000:3000 archio
```

### Manual

Deploy the output of `npm run build`:

```
build/
  client/   # Static assets
  server/   # SSR server
```

Compatible with any Node-capable host: Railway, Fly.io, Render, AWS ECS, Google Cloud Run.
