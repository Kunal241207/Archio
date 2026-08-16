# Archio

An AI-first design environment for visualizing, rendering, and shipping architectural projects — built with React Router v7, TypeScript, and TailwindCSS v4.

## Stack

- **React Router v7** — file-based routing with SSR
- **React 19** — UI framework
- **TailwindCSS v4** — utility-first styling with custom theme tokens
- **TypeScript** — strict types throughout
- **Puter.js** — auth, cloud storage, and Workers for serverless KV
- **Lucide React** — icons
- **Vite** — dev server and bundler

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_PUTER_WORKER_URL=https://your-worker-subdomain.puter.work
```

Replace `your-worker-subdomain` with your actual Puter Worker deployment URL.

### 3. Deploy Puter Worker

Deploy `lib/puter.worker.js` to Puter Workers. This handles project storage in the KV store:

- **POST** `/api/projects/save` — Save a project with source image and metadata
- **GET** `/api/projects/list` — List all user projects
- **GET** `/api/projects/get?id={id}` — Get a specific project by ID

Update your `.env.local` with the deployed worker URL.

### 4. Start Development Server

```bash
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
    home.tsx                    # Landing page with upload and project list
    visualizer.$id.tsx          # Project visualizer page
  root.tsx                      # App shell, auth state, font links
  app.css                       # Global styles and BEM component classes
components/
  Navbar.tsx                    # Top navigation with auth
  Upload.tsx                    # Drag-and-drop file upload with progress
  ui/
    Button.tsx                  # Reusable button with BEM variant/size props
lib/
  puter.action.ts               # Puter auth and project CRUD operations
  puter.hosting.ts              # Puter hosting for image uploads
  puter.worker.js               # Puter Worker with KV storage endpoints
  ai.action.ts                  # AI integration helpers
  constants.ts                  # App-wide constants (URLs, intervals)
  utils.ts                      # Utility functions
```

## Features

- **Drag-and-Drop Upload**: Upload floor plans (JPG, PNG, JPEG, WEBP) with real-time progress
- **Puter Authentication**: Sign in/out with Puter.js
- **Cloud Storage**: Images hosted on Puter hosting, project metadata in KV store
- **Project History**: View and access all saved projects
- **Serverless Architecture**: Puter Workers handle backend logic without servers

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
