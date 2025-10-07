# LACOSA

Local Companion for Expats & Nomads (LACOSA) is an API-first prototype that brings the product requirements document (PRD) to life. It exposes curated city intelligence for Palermo across safety, housing, schools, lifestyle, community, transport, and relocation workflows.

## Project Structure

```
app/
  api/            # FastAPI routers grouped by feature area
  data/           # Seed datasets backing each endpoint
  models/         # Pydantic schemas shared across routers
  services/       # Helper utilities (data loading, concierge logic)
  main.py         # FastAPI application entrypoint
LACOSA_PRD.md     # Product requirements document
requirements.txt  # Python dependencies
```

## Getting Started

1. **Create an environment file** so runtime configuration can be managed per deployment:
   ```bash
   cp .env.example .env
   ```
   Edit the values to match your environment (allowed origins, log level, secrets, etc.).

2. **Install dependencies** (preferably in a virtual environment):
   ```bash
   pip install -r requirements.txt
   ```
3. **Run the API locally**:
   ```bash
   uvicorn app.main:app --reload
   ```
4. **Explore the interactive docs** at [http://localhost:8000/docs](http://localhost:8000/docs).

## LACOSA — Dev Quickstart (API + Mobile)

### 1) Run locally (no Docker)

**API**
```bash
cp .env.example .env
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# http://localhost:8000/health
# http://localhost:8000/docs
```

**Mobile (Vite + React + TS)**

```bash
cd lacosa-mobile
cp .env.example .env   # optional: define VITE_API_BASE_URL=http://localhost:8000
npm install
npm run dev
# http://localhost:5173
```

### 2) Run with Docker Compose

```bash
docker compose up --build
# web:  http://localhost:5173
# api:  http://localhost:8000
```

The mobile app calls:

- `VITE_API_BASE_URL` if set, or
- `/api/*` via Vite proxy to the API (configured in `vite.config.ts`).

### Running with Docker

The project ships with a production-ready multi-stage image that runs Gunicorn with
Uvicorn workers under a non-root user. Build and start the container with:

```bash
docker build -t lacosa-api .
docker run --env-file .env -p 8000:8000 lacosa-api
```

## Frontend & Mobile Clients

The repository includes two Vite-powered clients that consume the FastAPI backend:

- [`frontend/`](frontend/README.md) – Web dashboard optimised for mobile layouts. Run `npm install && npm run dev` and configure the API base URL via `.env`.
- [`lacosa-mobile/`](lacosa-mobile/README.md) – Mobile shell prototype with bottom navigation parity. Also configure via `.env`.

Both projects expect `VITE_API_BASE_URL` to point to the backend (defaults to `http://localhost:8000`) and surface a `/health` badge to confirm connectivity.

## Available Endpoints

| Feature Area | Endpoint | Description |
| --- | --- | --- |
| Health | `GET /health` | Service heartbeat for uptime checks. |
| City Selector | `GET /api/utilities/cities` | List of supported launch cities. |
| Live Alerts | `GET /api/utilities/alerts` | Safety and mobility alerts with timestamps. |
| Safety Heatmap | `GET /api/safety/zones` | Neighborhood risk levels and trends. |
| Housing & Rentals | `GET /api/housing/rentals` | Filterable rental listings with verification flags. |
| Schools Directory | `GET /api/schools/directory` | Curriculum- and level-based lookup for schools. |
| Food & Lifestyle | `GET /api/shopping/essentials` | Curated essentials (pharmacies, electronics). |
| Cafés & Nightlife | `GET /api/lifestyle/venues` | Filterable list of cafés, restaurants, and bars with expat-friendly tags. |
| Markets & Deliveries | `GET /api/shopping/markets` | Market schedules plus delivery partners. |
| Arts & Culture | `GET /api/culture/events` | Upcoming events with AI summaries. |
| Transport | `GET /api/transport/options` | Trusted transport providers and safety notes. |
| Community | `GET /api/community/profiles` | Expat profiles with interest filters. |
| Groups | `GET /api/community/groups` | Interest-based groups and member counts. |
| AI Concierge | `GET /api/concierge/ask?query=...` | Rule-based concierge stub returning sourced answers. |
| Relocation Packs | `GET /api/relocation/packs` | Visa, healthcare, and cultural starter kits. |

## Testing

Run the automated smoke tests to ensure core flows work as expected:

```bash
pytest
```

## Next Steps

- Extend the seed data with additional cities (Lisbon, Bali) and real integrations.
- Replace the rule-based concierge with a Retrieval-Augmented Generation (RAG) workflow.
- Layer authentication, premium entitlements, and realtime messaging per the PRD roadmap.
