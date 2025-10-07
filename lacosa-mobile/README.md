# LACOSA Mobile Shell

Minimal Vite + React TypeScript scaffold for the LACOSA mobile companion. It renders a connectivity check against the FastAPI backend so you can confirm CORS and environment variables are wired correctly before building additional screens.

## Prerequisites

- Node.js 20+
- npm 10+
- A running instance of the LACOSA FastAPI backend

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. (Optional) Copy the environment template if you want to set a direct API base URL:
   ```bash
   cp .env.example .env
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) and verify the health status banner.

## Available Scripts

- `npm run dev` – Start the Vite development server.
- `npm run build` – Type-check and create a production build.
- `npm run preview` – Preview the production build locally.

## Environment Variables

| Name | Description | Default |
| ---- | ----------- | ------- |
| `VITE_API_BASE_URL` | Optional direct URL for the FastAPI backend. If omitted, the app uses `/api` and relies on the Vite proxy. | _(unset)_ |

## Development Notes

- The Vite dev server proxies `/api/*` requests to `http://localhost:8000` by default. Override via `VITE_API_PROXY_TARGET` when running in Docker Compose.
- Extend `src/App.tsx` with routes and views as you flesh out the mobile experience.
