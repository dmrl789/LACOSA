# LACOSA Web Frontend

A Vite + React (TypeScript) client that consumes the LACOSA FastAPI backend and provides a mobile-first dashboard experience.

## Prerequisites

- Node.js 18+
- npm 9+
- A running instance of the LACOSA API (see the repository root README)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment template and configure the API URL if different from the default:
   ```bash
   cp .env.example .env
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Visit the app at the URL printed in the terminal (defaults to [http://localhost:5173](http://localhost:5173)).

The home view triggers a `/health` request on load. A badge in the hero area will turn green when the API responds with `{ "status": "ok" }`, giving you an immediate signal that CORS and connectivity are working end-to-end.

## Available Scripts

- `npm run dev` – Run the Vite dev server with hot module replacement.
- `npm run build` – Create an optimized production build.
- `npm run preview` – Preview the production build locally.

## Environment Variables

| Name | Description | Default |
| ---- | ----------- | ------- |
| `VITE_API_BASE_URL` | Base URL for the FastAPI backend. Used by the health check and feature APIs. | `http://localhost:8000` |

## Troubleshooting

- **CORS errors** – Ensure the backend `.env` includes `http://localhost:5173` in `LACOSA_CORS_ORIGINS`.
- **API timeouts** – Confirm the FastAPI server is running and accessible from the browser. You can hit `http://localhost:8000/health` directly to confirm.

