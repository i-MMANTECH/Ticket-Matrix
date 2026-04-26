<!-- Emmanuel Aro's project submission for evaluation. -->

# Deployment guide — free-tier stack

This walks through deploying the full stack on free tiers using **Vercel** (frontend) + **Render** (backend) + **Supabase** (database). Works with private GitHub repos.

```
Browser ──▶ Vercel (Next.js)  ──▶  Render (Django/DRF)  ──▶  Supabase Postgres
```

---

## Prerequisites

- The repo is pushed to GitHub (private is fine — both Vercel and Render support private repos via OAuth).
- Supabase project provisioned, `DATABASE_URL` known. (See main [README §3](../../README.md).)

---

## Part A — Backend on Render

The backend has to deploy first so we know the API URL before configuring the frontend.

1. Sign in at https://render.com (free, GitHub OAuth).
2. Click **New +** → **Web Service**.
3. Connect your GitHub account, then select **Tech4mation/EmmanuelEvaluation2** (private repos appear once you grant access).
4. Configure the service:
   - **Name:** `ticket-matrix-backend` (or anything you like — becomes part of the URL)
   - **Region:** closest to your users (Frankfurt works well for Africa)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** **Docker** (Render auto-detects the `backend/Dockerfile`)
   - **Instance Type:** **Free**
5. Add **Environment Variables** (Advanced section):

   | Key | Value |
   | --- | --- |
   | `DJANGO_SECRET_KEY` | A long random string (use `python -c "import secrets; print(secrets.token_urlsafe(64))"` locally) |
   | `DJANGO_DEBUG` | `False` |
   | `DJANGO_ALLOWED_HOSTS` | `ticket-matrix-backend.onrender.com` (use the actual hostname Render assigns) |
   | `CORS_ALLOWED_ORIGINS` | *Leave blank for now — we'll fill it in after the frontend deploys* |
   | `DATABASE_URL` | Your Supabase Connection-pooling URI (port `6543`, password URL-encoded) |

6. Override the **Start Command** to use Gunicorn for production:

   ```
   gunicorn ticket_matrix.wsgi --bind 0.0.0.0:$PORT --workers 2
   ```

7. Click **Create Web Service**. First build takes ~3 minutes.

8. Once it's live, run migrations and seed once via the **Shell** tab:

   ```
   python manage.py migrate
   python manage.py seed_demo
   ```

9. Note the URL Render assigned (e.g. `https://ticket-matrix-backend.onrender.com`). Sanity check:

   ```
   curl https://ticket-matrix-backend.onrender.com/api/health/
   ```

> **Free-tier note:** Render's free web service sleeps after 15 minutes of inactivity. The first request after a sleep takes 30–50 seconds to wake. This is fine for an evaluation submission but worth flagging to reviewers.

---

## Part B — Frontend on Vercel

1. Sign in at https://vercel.com (free, GitHub OAuth — install the Vercel GitHub app on the **Tech4mation** org so private repos appear).
2. Click **Add New** → **Project**.
3. Pick **Tech4mation/EmmanuelEvaluation2** from the list.
4. **Configure project** screen:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** click **Edit** and set it to `frontend` ⚠️ *crucial — without this Vercel will look at the repo root and fail.*
   - **Build Command, Output Directory, Install Command:** leave defaults
5. Expand **Environment Variables** and add:

   | Key | Value |
   | --- | --- |
   | `NEXT_PUBLIC_API_BASE_URL` | `https://ticket-matrix-backend.onrender.com/api` (the URL from Part A, with `/api` suffix) |

6. Click **Deploy**. First build takes ~2 minutes.
7. Vercel assigns a URL like `https://emmanuel-evaluation2.vercel.app`. Open it — the dashboard should load with your seeded data.

---

## Part C — Close the CORS loop

The backend doesn't yet know the Vercel domain. Without this, browser → API requests will be blocked.

1. In Render → **ticket-matrix-backend** → **Environment**, set:

   ```
   CORS_ALLOWED_ORIGINS = https://emmanuel-evaluation2.vercel.app
   ```

   (Use whatever URL Vercel assigned. Comma-separate if you have multiple, e.g. preview deployments.)

2. Render auto-redeploys. Wait ~30s, then refresh the Vercel app — the dashboard should now hit the live API.

---

## Part D — Custom domains (optional)

- **Vercel:** Project → **Settings** → **Domains** → add your domain → follow DNS instructions.
- **Render:** Service → **Settings** → **Custom Domain** → same flow.
- After adding a custom domain to Vercel, append it to `CORS_ALLOWED_ORIGINS` and `DJANGO_ALLOWED_HOSTS` on Render.

---

## Quick troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `Failed to load tickets` in the UI | CORS or wrong API URL | Confirm Vercel's `NEXT_PUBLIC_API_BASE_URL` ends in `/api` and that the Vercel domain is in Render's `CORS_ALLOWED_ORIGINS` |
| First page load takes 30+ seconds | Render free tier was asleep | Expected — only on the first request after 15 min idle |
| Vercel build fails on `peer dependency` | npm picked up React 19 ↔ next peer mismatch | Re-trigger build with `NPM_FLAGS=--legacy-peer-deps` env var on Vercel (we already have a clean install but this is the universal escape hatch) |
| `password authentication failed` in Render logs | `$` in Supabase password not URL-encoded | Re-encode `$` → `%24` in `DATABASE_URL` |
| Render times out on cold start | Free tier limit | Either accept the cold start (fine for eval) or upgrade to Render Starter ($7/mo) |
