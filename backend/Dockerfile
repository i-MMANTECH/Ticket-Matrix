# Emmanuel Aro's project submission for evaluation.
# Backend image: Django REST Framework on Python 3.12-slim.

FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# System deps for psycopg (Postgres) and basic build tooling
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
        curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .

EXPOSE 8000

# Production-friendly default: apply migrations, seed demo data (idempotent),
# then start Gunicorn. Honours $PORT (Render injects this) but falls back to
# 8000 for local Docker. Compose overrides this CMD with `runserver` for
# hot-reload during local dev.
CMD sh -c "python manage.py migrate --noinput && python manage.py seed_demo && gunicorn ticket_matrix.wsgi --bind 0.0.0.0:${PORT:-8000} --workers 2"
