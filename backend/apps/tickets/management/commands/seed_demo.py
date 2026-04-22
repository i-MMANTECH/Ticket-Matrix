# Emmanuel Aro's project submission for evaluation.
"""Populate the database with deterministic demo data.

Idempotent: safe to run multiple times. Wipes prior demo rows by email/reference.
Useful so the dashboard, tickets list, and details views are populated for
reviewers without needing to manually create data.
"""
from __future__ import annotations

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.customers.models import Customer
from apps.tickets.models import Comment, Ticket


DEMO_CUSTOMERS = [
    {"name": "Adaeze Okafor", "email": "adaeze@nativetalk.test", "company": "Nativetalk Africa"},
    {"name": "Tunde Bakare", "email": "tunde@nativetalk.test", "company": "Bakare Holdings"},
    {"name": "Chiamaka Eze", "email": "chiamaka@nativetalk.test", "company": "Eze & Co"},
    {"name": "Ibrahim Suleiman", "email": "ibrahim@nativetalk.test", "company": "Suleiman Logistics"},
    {"name": "Funke Adebayo", "email": "funke@nativetalk.test", "company": "Adebayo Foods"},
]

DEMO_TICKETS = [
    {
        "subject": "Cannot send bulk SMS campaign",
        "description": "Trying to launch a campaign to 5,000 contacts but the dashboard returns a generic error after upload.",
        "priority": "urgent", "category": "technical", "status": "open",
        "assignee": "Support Tier 2",
    },
    {
        "subject": "Billing invoice for March is missing",
        "description": "I cannot find the March invoice in my account history. Please resend.",
        "priority": "medium", "category": "billing", "status": "in_progress",
        "assignee": "Finance",
    },
    {
        "subject": "Request: WhatsApp Business integration",
        "description": "Would love a native WhatsApp Business channel inside Nativetalk.",
        "priority": "low", "category": "feature_request", "status": "on_hold",
        "assignee": "Product",
    },
    {
        "subject": "Two-factor auth recovery codes expired",
        "description": "My 2FA codes no longer work and I cannot log in to the dashboard.",
        "priority": "high", "category": "account", "status": "resolved",
        "assignee": "Security",
    },
    {
        "subject": "Voice broadcast quality is poor",
        "description": "Recipients report static and dropped audio on outbound voice broadcasts.",
        "priority": "high", "category": "technical", "status": "in_progress",
        "assignee": "Voice Eng",
    },
    {
        "subject": "Add CSV export for delivery reports",
        "description": "Need to download delivery reports as CSV for finance reconciliation.",
        "priority": "medium", "category": "feature_request", "status": "open",
        "assignee": "Product",
    },
    {
        "subject": "Account suspended unexpectedly",
        "description": "My account was suspended without notice. Please review.",
        "priority": "urgent", "category": "account", "status": "closed",
        "assignee": "Trust & Safety",
    },
]

DEMO_COMMENTS = [
    "Thanks for raising this — investigating now.",
    "We've reproduced the issue internally and a fix is rolling out.",
    "Could you share a screenshot or error code from the console?",
    "Resolved in production. Please confirm on your end.",
]


class Command(BaseCommand):
    help = "Seed demo customers, tickets, and comments for the dashboard."

    @transaction.atomic
    def handle(self, *args, **options):
        customers = []
        for payload in DEMO_CUSTOMERS:
            customer, _ = Customer.objects.update_or_create(
                email=payload["email"],
                defaults={"name": payload["name"], "company": payload["company"]},
            )
            customers.append(customer)

        Ticket.objects.filter(subject__in=[t["subject"] for t in DEMO_TICKETS]).delete()

        for index, payload in enumerate(DEMO_TICKETS):
            customer = customers[index % len(customers)]
            ticket = Ticket.objects.create(customer=customer, **payload)
            for ci, body in enumerate(DEMO_COMMENTS[: 1 + (index % len(DEMO_COMMENTS))]):
                Comment.objects.create(
                    ticket=ticket,
                    author_name=customer.name if ci == 0 else "Support Agent",
                    author_email=customer.email if ci == 0 else "support@nativetalk.test",
                    content=body,
                )

        self.stdout.write(self.style.SUCCESS(
            f"Seeded {len(customers)} customers and {len(DEMO_TICKETS)} tickets."
        ))
