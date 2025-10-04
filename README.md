# LACOSA

## GitHub Project Setup

Follow these steps to create a project board that tracks work derived from `LACOSA_PRD.md`:

1. Open the repository in GitHub and navigate to **Projects** → **New Project**.
2. Choose the **Board** layout and name the project **LACOSA Roadmap**.
3. Create the following columns:
   - **Backlog** – raw ideas and early research.
   - **Ready** – specification completed and development can start.
   - **In Progress** – active development items.
   - **Review** – work awaiting code review or QA sign-off.
   - **Done** – completed and accepted tasks.
4. When creating issues, set their **Project** field to **LACOSA Roadmap** so they automatically appear on the board.

## Suggested Labels

Use these labels to triage work quickly:

| Label | Purpose |
| --- | --- |
| `enhancement` | New feature requests and improvements. |
| `bug` | Defects or unexpected behavior. |
| `ui/ux` | Design-driven changes. |
| `data` | Data integrations, pipelines, or scraping tasks. |
| `AI` | LLM, chatbot, or other AI-driven work. |
| `good first issue` | Tasks suitable for new contributors. |
| `priority: high` | Critical work required for the MVP. |
| `priority: low` | Nice-to-have items. |

## First Issues to Create

Start by filing feature issues that map directly to major sections of the product requirements:

- [ ] **Safety Map MVP** — establish the geospatial database and heatmap UI.
- [ ] **AI Q&A MVP** — deliver a basic chat UI backed by a GPT stub that uses local data.
- [ ] **City Selector & Onboarding** — implement search plus the sign-in flow.
- [ ] **Social Graph Skeleton** — provide user profiles and direct messaging basics.
- [ ] **Events & Arts Integration** — build an event feed prototype.

Each issue should be linked to the corresponding section of `LACOSA_PRD.md`, include acceptance criteria, and be added to the **LACOSA Roadmap** project board.

## Issue Templates

Feature and bug requests should use the templates stored in `.github/ISSUE_TEMPLATE/` to keep the backlog consistent and actionable.
