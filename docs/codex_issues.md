# LACOSA MVP Issue Backlog

The following issues are aligned with the "LACOSA — Codex Execution Plan & TODO" and are ready to be copy-pasted into GitHub. Each issue references the relevant phase(s) of the roadmap and provides a checklist of the key tasks.

---

## Issue 1 — Scaffold DX (lint, type, pre-commit, Makefile)

**Context**
- Phase 0 — Repo hygiene & DX.

**Body**
```
### Context
Set up a consistent local developer experience so contributors can lint, format, and test the project reliably.

### Tasks
- [ ] Add a `Makefile` with targets: `make setup`, `make run`, `make test`, `make lint`, and `make fmt`.
- [ ] Introduce `ruff`, `black`, and `mypy` configuration files and ensure they run cleanly.
- [ ] Create `.env.example` capturing ports, CORS origins, log level, and any other runtime configuration.
- [ ] Generate a pinned `requirements.lock` (or similar) and update the README with installation instructions.
- [ ] Configure `pre-commit` hooks for ruff/black/isort/mypy and document how to enable them locally.
```

---

## Issue 2 — Containerize & CI (Dockerfile, compose, GitHub Actions)

**Context**
- Phase 7 — Packaging & deployment.

**Body**
```
### Context
Ensure the API can be built and tested in a reproducible container environment and verify changes in CI.

### Tasks
- [ ] Add a multi-stage Dockerfile that builds dependencies and runs the FastAPI app with gunicorn + uvicorn workers as a non-root user.
- [ ] Provide a `docker-compose.yml` that optionally includes Redis for rate limiting/analytics while supporting local development.
- [ ] Configure GitHub Actions workflows for CI (lint, type check, tests) and CD (build image, push artifact, deploy to staging when appropriate).
- [ ] Document the container workflow in the README.
```

---

## Issue 3 — Models & OpenAPI Examples (all routers)

**Context**
- Phase 1 — API polish (FastAPI).

**Body**
```
### Context
Improve API discoverability by ensuring routes are grouped logically and documented with Pydantic models and sample payloads.

### Tasks
- [ ] Organize routers under `app/api/*` by domain (safety, housing, schools, culture, transport, community, concierge, utilities, etc.).
- [ ] Ensure every route uses explicit request/response Pydantic models defined in `app/models/*`.
- [ ] Add OpenAPI examples for all endpoints, including success and error responses.
- [ ] Define a shared error model and install a global exception handler so errors render consistently.
```

---

## Issue 4 — Data loaders + Palermo seeds complete

**Context**
- Phase 2 — Data layer & seed content.

**Body**
```
### Context
Move dataset logic into typed services and ensure Palermo (the initial city) has complete coverage across all domains described in the README.

### Tasks
- [ ] Convert existing CSV/JSON assets in `app/data` into typed loaders under `app/services/data_loader.py` (or similar module).
- [ ] Validate and expand Palermo seed data for safety zones, rentals, schools, events, transport options, community groups, relocation packs, etc.
- [ ] Add completeness checks/tests to avoid regressions in required seed datasets.
```

---

## Issue 5 — Lisbon city skeleton + city switch

**Context**
- Phase 2 — Data layer & seed content.

**Body**
```
### Context
Introduce a second city to exercise the multi-city architecture and verify that clients can discover and switch between catalogs.

### Tasks
- [ ] Add a minimal Lisbon dataset covering each major domain (utilities, housing, schools, events, etc.) sufficient for testing.
- [ ] Update loaders/services to support city selection and expose the available cities via `GET /api/utilities/cities`.
- [ ] Ensure endpoints respond correctly when a city is requested that lacks specific data (graceful fallbacks).
```

---

## Issue 6 — Concierge: RAG MVP with sources

**Context**
- Phase 3 — AI Concierge (MVP → RAG).

**Body**
```
### Context
Replace the rule-based concierge with a retrieval-augmented generation (RAG) service that cites its sources.

### Tasks
- [ ] Create `app/services/concierge.py` that exposes a pluggable concierge interface.
- [ ] Build a local JSON knowledge base with embeddings index, retrieval pipeline, and an LLM call stub gated by environment configuration.
- [ ] Return structured responses including `sources: []` with passage spans for each answer, as described in the README.
- [ ] Add guardrails to enforce allowed topics, city scoping, and an explicit “no data available” fallback to reduce hallucinations.
```

---

## Issue 7 — Auth + usage plans + rate limiting

**Context**
- Phase 4 — Auth, plans, and quotas.

**Body**
```
### Context
Introduce basic API key authentication and enforce per-plan quotas to manage consumption.

### Tasks
- [ ] Implement API key middleware that reads `X-API-Key` and validates against an in-memory store (future: Redis).
- [ ] Define usage plans: free (60 req/min), pro (600 req/min), internal (unlimited) and wire them into rate limiting.
- [ ] Add per-key analytics counters for total requests, 4xx/5xx counts, and cache hits.
- [ ] Document auth usage and rate limits in the README and OpenAPI.
```

---

## Issue 8 — Live alerts + SSE stream

**Context**
- Phase 5 — Live alerts & realtime.

**Body**
```
### Context
Provide both polling and server-sent events interfaces for city alerts so clients can react to updates quickly.

### Tasks
- [ ] Implement `GET /api/utilities/alerts` returning timestamped alerts with a `since` query parameter for polling.
- [ ] Add an SSE endpoint at `/api/utilities/alerts/stream` powered by a mock alert generator service.
- [ ] Normalize alert severities and provide a fallback polling strategy for clients that cannot use SSE.
- [ ] Document usage patterns and add tests for both endpoints.
```

---

## Issue 9 — Search & filters: rentals/schools/events

**Context**
- Phase 2 — Data layer & seed content.

**Body**
```
### Context
Expose useful filter/query capabilities to make key catalogs (rentals, schools, events) more actionable.

### Tasks
- [ ] Add query parameters for rentals (price range, bedrooms, neighborhood, amenities) and ensure validation.
- [ ] Add filters for schools (type, grade range, language, neighborhood) with input validation and documentation.
- [ ] Add filters for events (date range, category, cost) with appropriate sorting.
- [ ] Update tests and OpenAPI examples to demonstrate filter usage.
```

---

## Issue 10 — Testing expansion + schema snapshots

**Context**
- Phase 6 — Quality, tests, and security.

**Body**
```
### Context
Expand coverage so every router is exercised and responses stay consistent via schema snapshots.

### Tasks
- [ ] Add endpoint smoke tests covering each route referenced in the README (health, utilities/cities, alerts, safety/zones, housing/rentals, schools/directory, shopping/essentials, shopping/markets, culture/events, transport/options, community/profiles, community/groups, concierge/ask, relocation/packs).
- [ ] Capture JSON schema snapshots for responses using pytest+pydantic tooling.
- [ ] Implement fuzz tests for query parameters (bounds checking, invalid enums) to harden the API.
- [ ] Ensure coverage thresholds meet or exceed 95% for routers and services.
```

---

## Issue 11 — Security headers & error model

**Context**
- Phase 1 — API polish & Phase 6 — Security.

**Body**
```
### Context
Harden the API surface with consistent errors and secure default headers.

### Tasks
- [ ] Finalize a shared error response model and connect it to the global exception handler.
- [ ] Add FastAPI middleware configuring security headers (CORS, CSP baseline for docs UI, HSTS if appropriate).
- [ ] Audit endpoints for missing error handling and update tests to cover failure paths.
```

---

## Issue 12 — Docs: Quickstart, Auth, Examples, Next Steps

**Context**
- Phase 8 — Docs & demos.

**Body**
```
### Context
Round out documentation with practical usage examples and next steps for contributors.

### Tasks
- [ ] Expand the README with a quickstart guide, API auth instructions, curl examples, and city scoping notes.
- [ ] Publish a Postman collection or `.http` request samples for each endpoint.
- [ ] Turn the README "Next Steps" section into tracked issues and keep it in sync with project status.
- [ ] Capture the overall roadmap/milestone plan in the repository (e.g., `docs/`), referencing the issues above.
```

---
