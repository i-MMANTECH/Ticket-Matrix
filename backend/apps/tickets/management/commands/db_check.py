# Emmanuel Aro's project submission for evaluation.
"""Quick health check that the configured database is reachable.

Useful right after wiring DATABASE_URL to confirm the Supabase pooler URI
is valid before running migrations. Reports the engine, the resolved host,
and the version banner returned by the server.
"""
from __future__ import annotations

from urllib.parse import urlparse

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import connections, OperationalError


class Command(BaseCommand):
    help = "Verify the Django ↔ database connection (Supabase Postgres or SQLite fallback)."

    def handle(self, *args, **options):
        cfg = settings.DATABASES["default"]
        engine = cfg.get("ENGINE", "?")
        is_postgres = "postgres" in engine
        host = cfg.get("HOST") or "(local file)"
        name = cfg.get("NAME") or ""

        # If DATABASE_URL was provided, surface the host it parsed to so the
        # user can verify it points at Supabase rather than the SQLite fallback.
        url = settings.DATABASE_URL if hasattr(settings, "DATABASE_URL") else ""
        parsed_host = urlparse(url).hostname if url else None

        self.stdout.write(self.style.HTTP_INFO("Database settings"))
        self.stdout.write(f"  Engine: {engine}")
        self.stdout.write(f"  Host:   {parsed_host or host}")
        self.stdout.write(f"  Name:   {name}")
        if not is_postgres:
            self.stdout.write(self.style.WARNING(
                "  Note: Postgres engine NOT in use — falling back to SQLite. "
                "Set DATABASE_URL in backend/.env to wire up Supabase."
            ))

        try:
            conn = connections["default"]
            conn.ensure_connection()
            with conn.cursor() as cur:
                if is_postgres:
                    cur.execute("SELECT version(), current_database(), current_user;")
                    version, db_name, db_user = cur.fetchone()
                    self.stdout.write(self.style.SUCCESS("\nConnected ✓"))
                    self.stdout.write(f"  Server:   {version.splitlines()[0]}")
                    self.stdout.write(f"  Database: {db_name}")
                    self.stdout.write(f"  User:     {db_user}")
                else:
                    cur.execute("SELECT sqlite_version();")
                    self.stdout.write(self.style.SUCCESS("\nConnected ✓ (SQLite)"))
                    self.stdout.write(f"  SQLite version: {cur.fetchone()[0]}")
        except OperationalError as exc:
            self.stdout.write(self.style.ERROR("\nConnection failed ✗"))
            self.stdout.write(self.style.ERROR(str(exc)))
            self.stdout.write(self.style.WARNING(
                "\nTroubleshooting:\n"
                "  • Confirm DATABASE_URL in backend/.env contains the correct password\n"
                "    (URL-encode special chars: $ -> %24).\n"
                "  • Use the 'Connection pooling' (port 6543, Transaction mode) URI.\n"
                "  • Check the project isn't paused in the Supabase dashboard."
            ))
            raise SystemExit(1)
