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

1. **Install dependencies** (preferably in a virtual environment):
   ```bash
   pip install -r requirements.txt
   ```
2. **Run the API locally**:
   ```bash
   uvicorn app.main:app --reload
   ```
3. **Explore the interactive docs** at [http://localhost:8000/docs](http://localhost:8000/docs).

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
