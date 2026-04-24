<!-- Emmanuel Aro's project submission for evaluation. -->

# Ticket Matrix — Nativetalk Ticketing Module

A full-stack ticketing module built as **Emmanuel Aro's project submission for evaluation** at the Tech4mation Ltd internship. It replicates the Nativetalk CRM ticketing experience (Dashboard, Tickets inbox, New Ticket flow) and extrapolates the missing **Ticket Details** view and **Comment** thread directly from the existing visual language.

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router, TypeScript) · Tailwind CSS · SWR |
| Backend | Django 5 · Django REST Framework · django-filter · django-cors-headers |
| Database | Supabase Postgres (free tier) — SQLite fallback if `DATABASE_URL` is unset |
| Container | Docker · `docker-compose` (single command spins up the full stack) |
| API Testing | Postman v2.1.0 collection in [`docs/postman/`](docs/postman) |

> **Design rule:** zero border-radius across the entire surface. The reset is enforced both by overriding `borderRadius` in [tailwind.config.ts](frontend/tailwind.config.ts) **and** by a `*` rule in [globals.css](frontend/src/app/globals.css#L24) so stray inline radii cannot leak through.

---

## Repository layout

```
ticket-matrix-redefined/
├── backend/                    Django REST API
│   ├── apps/
│   │   ├── customers/          Customer model + CRUD
│   │   └── tickets/            Ticket + Comment models, CRUD, stats endpoint, seeder
│   ├── ticket_matrix/          Django project (settings, urls, wsgi/asgi)
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── frontend/                   Next.js 15 App Router project
│   ├── src/
│   │   ├── app/
│   │   │   ├── (dashboard)/dashboard/      → /dashboard
│   │   │   └── (dashboard)/tickets/        → /tickets, /tickets/[id]
│   │   ├── components/         layout, dashboard, tickets, ui primitives
│   │   └── lib/                api client, formatters
│   ├── Dockerfile
│   ├── tailwind.config.ts      Hard borderRadius reset → 0
│   └── .env.example
├── docs/
│   └── postman/                Importable Postman collection + step-by-step guide
├── docker-compose.yml
├── .gitignore
└── README.md  (you are here)
```

---

## 1. Prerequisites

- **Docker Desktop** (or any Docker engine ≥ 24) — only hard requirement.
- A free **Supabase** account: https://supabase.com (used for the Postgres database).
- *(Optional, for non-Docker dev)* Python 3.12 and Node.js 20.

---

## 2. Clone the repository

```bash
git clone <your-fork-or-repo-url> ticket-matrix-redefined
cd ticket-matrix-redefined
```

---

## 3. Provision Supabase (free tier)

1. Sign in at https://app.supabase.com and click **New project**.
2. Pick the **Free** plan, choose a region close to you, set a **strong database password**, and create the project.
3. Once the project is provisioned (≈ 2 minutes), open **Project Settings → Database**.
4. Scroll to **Connection string**. You'll see two URIs:
   - **Direct connection** (port `5432`) — fine for migrations/admin.
   - **Connection pooling** (port `6543`, *Transaction* mode) — **use this** for the running app, it scales much better on the free tier.
5. Copy the **Connection pooling** URI — it looks like:

   ```
   postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
   ```

> Replace `[YOUR-PASSWORD]` in the URI with the actual database password you set in step 2.

---

## 4. Wire up environment variables

### Backend

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and set:

```ini
DJANGO_SECRET_KEY=<generate a long random string>
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,backend
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Paste the Supabase Connection pooling URI from step 3
DATABASE_URL=postgresql://postgres.xxxxx:YOURPASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

> If you skip `DATABASE_URL`, Django automatically falls back to a local SQLite file at `backend/db.sqlite3` so you can still develop offline.

### Frontend

```bash
cp frontend/.env.example frontend/.env.local
```

Default value is correct when running with Docker Compose:

```ini
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

---

## 5. Run the stack with Docker (recommended)

From the repo root:

```bash
docker compose up --build
```

This:

- Builds the `backend` image (Python 3.12-slim) and runs `manage.py migrate` then `runserver` on port **8000**.
- Builds the `frontend` image (Node 20-alpine) and runs `next dev` on port **3000**.
- Mounts your source folders into the containers for hot reload.

Open:

- **App:** http://localhost:3000 (auto-redirects to `/dashboard`)
- **API:** http://localhost:8000/api/health/
- **Django admin:** http://localhost:8000/admin/

### Verify the Supabase connection (recommended)

```bash
docker compose exec backend python manage.py db_check
# native: cd backend && python manage.py db_check
```

Reports the engine, host, database name, user, and Postgres server version. Falls back to a clear error if `DATABASE_URL` is unset or wrong.

### Seed demo data (optional but recommended)

```bash
docker compose exec backend python manage.py seed_demo
```

You'll get 5 customers, 7 tickets across every status/priority, and threaded comments — enough to make the dashboard, status breakdown, and inbox feel real immediately.

### Create an admin user

```bash
docker compose exec backend python manage.py createsuperuser
```

---

## 6. Run without Docker (alternative)

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo         # optional
python manage.py runserver 0.0.0.0:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 7. API surface

Base URL: `http://localhost:8000/api`

| Verb | Path | Purpose |
|---|---|---|
| `GET` | `/health/` | Liveness probe |
| `GET` | `/customers/` | List customers (paginated) |
| `POST` | `/customers/` | Create a customer |
| `GET/PATCH/DELETE` | `/customers/{id}/` | Retrieve / update / delete a customer |
| `GET` | `/tickets/` | List tickets — supports `?status=`, `?priority=`, `?category=`, `?search=`, `?ordering=` |
| `POST` | `/tickets/` | Create a ticket. Pass `customer_id` **or** `customer_name` + `customer_email` to upsert the customer in one call |
| `GET/PATCH/DELETE` | `/tickets/{id}/` | Retrieve / update / delete a ticket |
| `GET` | `/tickets/{id}/comments/` | List comments for a ticket |
| `POST` | `/tickets/{id}/comments/` | Add a comment to a ticket |
| `GET` | `/tickets/stats/` | **Aggregation endpoint** powering the dashboard: `total`, `completed`, `completion_rate`, `by_status`, `by_priority`, `by_category` |
| `GET/POST/PATCH/DELETE` | `/comments/` | Standalone comment CRUD (admin/edge cases) |

### Postman

Import [`docs/postman/TicketMatrix.postman_collection.json`](docs/postman/TicketMatrix.postman_collection.json) and follow the [step-by-step guide](docs/postman/README.md). The collection auto-saves `customer_id` / `ticket_id` from create requests so the rest of the flow runs end-to-end.

---

## 8. Frontend pages

| Route | Description |
|---|---|
| `/dashboard` | Top metric cards (Total / Open / In progress / Resolved), the **Tickets Completion Rate** semicircle gauge, status breakdown bars, and recent tickets table. |
| `/tickets` | Filterable inbox (status / priority / search) with the responsive **+ New Ticket** modal. |
| `/tickets/[id]` | **Extrapolated Ticket Details** view: subject, description, customer card, threaded conversation, status switcher, and **Add a Comment** composer. |

All pages are responsive (single-column mobile → multi-column desktop), keyboard-accessible, and re-validate via SWR after any mutation.

---

## 9. Deployment (free-tier only)

| Service | Provider | Notes |
|---|---|---|
| Frontend | **Vercel** Hobby | `cd frontend && vercel --prod`. Set `NEXT_PUBLIC_API_BASE_URL` to your deployed API. |
| Backend | **Render** Free Web Service or **Fly.io** | Use the existing `Dockerfile`. Set `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=False`, `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `DATABASE_URL` env vars. Start command: `gunicorn ticket_matrix.wsgi --bind 0.0.0.0:$PORT`. |
| Database | **Supabase** Free | Project provisioned in step 3. The app uses the Connection-pooling URI so it survives the free tier's connection cap. |

After deploying the backend, update `frontend/.env.local` (and Vercel env vars) so `NEXT_PUBLIC_API_BASE_URL` points at the deployed API, then add the Vercel domain to `CORS_ALLOWED_ORIGINS` on the backend.

---

## 10. CORS / mobile-responsiveness checklist

These are the two AI blind spots called out in the brief — both handled:

- **CORS:** `corsheaders` is in `INSTALLED_APPS`, `CorsMiddleware` is the very first middleware, and `CORS_ALLOWED_ORIGINS` reads from the env so dev / prod stay aligned. CSRF trusted origins mirror the same list. ([backend/ticket_matrix/settings.py](backend/ticket_matrix/settings.py))
- **Responsiveness:** Desktop sidebar shows at `lg+`; below `lg` a hamburger in the topbar opens a slide-in drawer ([MobileNav.tsx](frontend/src/components/layout/MobileNav.tsx)). The Customers page uses a full table at `md+` and a stacked card list below `md` ([customers/page.tsx](frontend/src/app/(dashboard)/customers/page.tsx)). Tickets render as cards that flow `flex-col → flex-row` at `sm`. All grids step from `grid-cols-1` → `grid-cols-2/3/4` at standard breakpoints. Manually verified at 360 / 768 / 1024 / 1440 px.

---

## 11. Plan compliance — mapping the brief to this repo

This table maps every requirement from the assessment brief (`Ticket-Matrix Plan.docx`) to the file or commit that implements it, so reviewers can audit the submission line-by-line.

### Phase 1 — Frontend & UI Extrapolation

| Brief item | Where it lives |
|---|---|
| Replicate Figma: **Dashboard** (top metric cards + completion-rate chart) | [frontend/src/app/(dashboard)/dashboard/page.tsx](frontend/src/app/(dashboard)/dashboard/page.tsx), [MetricCard.tsx](frontend/src/components/dashboard/MetricCard.tsx), [CompletionChart.tsx](frontend/src/components/dashboard/CompletionChart.tsx), [QuickActions.tsx](frontend/src/components/dashboard/QuickActions.tsx) |
| Replicate Figma: **Tickets List** (status tiles + card list with progress) | [frontend/src/app/(dashboard)/tickets/page.tsx](frontend/src/app/(dashboard)/tickets/page.tsx), [TicketCard.tsx](frontend/src/components/tickets/TicketCard.tsx), [StatusMetricCard.tsx](frontend/src/components/tickets/StatusMetricCard.tsx) |
| Replicate Figma: **New Ticket Modal** (functional form posting to API) | [NewTicketModal.tsx](frontend/src/components/tickets/NewTicketModal.tsx) |
| **Extrapolated Ticket Details** view (not in Figma) | [frontend/src/app/(dashboard)/tickets/[id]/page.tsx](frontend/src/app/(dashboard)/tickets/[id]/page.tsx) |
| **Extrapolated Add-Comment** flow (not in Figma) | [CommentComposer.tsx](frontend/src/components/tickets/CommentComposer.tsx) |
| Bonus: **Customers** page also rendered from the Figma set | [frontend/src/app/(dashboard)/customers/page.tsx](frontend/src/app/(dashboard)/customers/page.tsx), [NewCustomerModal.tsx](frontend/src/components/customers/NewCustomerModal.tsx), [ChannelIcons.tsx](frontend/src/components/customers/ChannelIcons.tsx), [TagBadge.tsx](frontend/src/components/customers/TagBadge.tsx) |
| Routing: **View Ticket** click → dynamic detail page | `Link href={\`/tickets/\${id}\`}` in [TicketCard.tsx](frontend/src/components/tickets/TicketCard.tsx) |
| Strict design-system rule: **zero border-radius** across the surface | [tailwind.config.ts](frontend/tailwind.config.ts) (radius tokens remapped to 0) + global `*` rule in [globals.css](frontend/src/app/globals.css) |

### Phase 2 — Backend & Architecture

| Brief item | Where it lives |
|---|---|
| **Customer** model (Name, Email, plus phone/company/tag/channels) | [apps/customers/models.py](backend/apps/customers/models.py) |
| **Ticket** model (FK Customer; subject/description/priority/category/status + assignee/progress) | [apps/tickets/models.py](backend/apps/tickets/models.py) |
| **Comment** model (FK Ticket; content + timestamp + author) | [apps/tickets/models.py](backend/apps/tickets/models.py) |
| Standard CRUD: list / create / retrieve tickets, add comments | [apps/tickets/views.py](backend/apps/tickets/views.py), [apps/customers/views.py](backend/apps/customers/views.py) |
| **Logic challenge — aggregation endpoint for completion-rate chart** | `TicketStatsView` at [apps/tickets/views.py](backend/apps/tickets/views.py) → exposed at `GET /api/tickets/stats/` (ORM `.values().annotate(Count())` over status / priority / category, plus `TruncMonth` series for the bar chart) |

### Phase 3 — Delivery & Git Workflow

| Brief item | Where it lives |
| --- | --- |
| GitHub repository (public/shared) | [Tech4mation/EmmanuelEvaluation2](https://github.com/Tech4mation/EmmanuelEvaluation2) |
| **Atomic, descriptive commits** | `git log --oneline` — every commit follows `feat:` / `chore:` / `docs:` and isolates a single concern (e.g. `feat(frontend): rebuild dashboard with metric tiles, bar chart, and quick actions`) |
| **Detailed README** with clone / setup / run instructions | This file (sections 1-10) |
| **Postman collection** for manual API verification | [docs/postman/TicketMatrix.postman_collection.json](docs/postman/TicketMatrix.postman_collection.json) + [step-by-step guide](docs/postman/README.md) |

### Architectural blind-spots called out in the brief

| Blind spot | Resolution |
| --- | --- |
| **CORS between Next.js and Django** | `CorsMiddleware` placed first; `CORS_ALLOWED_ORIGINS` + `CSRF_TRUSTED_ORIGINS` read from env ([settings.py](backend/ticket_matrix/settings.py)) so dev (`localhost:3000`) and prod (Vercel) stay aligned. |
| **Mobile responsiveness** | Hamburger drawer below `lg` ([MobileNav.tsx](frontend/src/components/layout/MobileNav.tsx)), Customers swaps to card list below `md`, ticket cards stack `flex-col → flex-row` at `sm`, modals constrained with `max-w-xl` + inner scroll. |
| **Frontend ↔ backend context hand-off** | Single typed API client at [frontend/src/lib/api.ts](frontend/src/lib/api.ts) mirrors every DRF serializer's shape, so any model field added on the backend is one type bump away from rendering. |

### Free-tier choices (per submission constraint)

| Layer | Provider |
| --- | --- |
| Database | **Supabase Free tier** — Postgres via Connection-pooling URI |
| Frontend hosting | **Vercel Hobby** — instructions in §9 |
| Backend hosting | **Render Free Web Service** (or **Fly.io** free allowance) — instructions in §9 |

---

## 12. Authorship

Every major structural file in this repository — `manage.py`, `next.config.js`, `docker-compose.yml`, the Django settings module, all React entry points, this README — carries the watermark **"Emmanuel Aro's project submission for evaluation."** as a top-of-file comment.
