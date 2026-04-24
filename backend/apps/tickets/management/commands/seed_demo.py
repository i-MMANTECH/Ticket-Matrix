# Emmanuel Aro's project submission for evaluation.
"""Populate the database with deterministic demo data.

Idempotent: safe to run multiple times. Wipes prior demo rows by email/subject.
Useful so the dashboard, tickets list, and details views are populated for
reviewers without needing to manually create data.
"""
from __future__ import annotations

import random
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from apps.customers.models import Customer
from apps.tickets.models import Comment, Ticket


DEMO_CUSTOMERS = [
    {"name": "Adaeze Okafor",     "email": "adaeze@nativetalk.test",   "company": "Nativetalk Africa",   "phone": "+234 810 179 0957", "tag": "vip",      "channels": ["instagram", "facebook", "whatsapp"]},
    {"name": "Tunde Bakare",      "email": "tunde@nativetalk.test",    "company": "Bakare Holdings",     "phone": "+234 802 411 8842", "tag": "frequent", "channels": ["whatsapp", "email"]},
    {"name": "Chiamaka Eze",      "email": "chiamaka@nativetalk.test", "company": "Eze & Co",            "phone": "+234 814 553 2210", "tag": "vip",      "channels": ["facebook", "whatsapp"]},
    {"name": "Ibrahim Suleiman",  "email": "ibrahim@nativetalk.test",  "company": "Suleiman Logistics",  "phone": "+234 808 661 7745", "tag": "frequent", "channels": ["instagram", "whatsapp"]},
    {"name": "Funke Adebayo",     "email": "funke@nativetalk.test",    "company": "Adebayo Foods",       "phone": "+234 803 920 4118", "tag": "new",      "channels": ["whatsapp"]},
    {"name": "Ogechi Arinze",     "email": "ogechi@nativetalk.test",   "company": "Arinze Studio",       "phone": "+234 810 179 0957", "tag": "vip",      "channels": ["instagram", "facebook", "whatsapp"]},
    {"name": "Salim Yusuf",       "email": "salim@nativetalk.test",    "company": "Yusuf Trading",       "phone": "+234 909 220 1180", "tag": "frequent", "channels": ["sms", "whatsapp"]},
    {"name": "Kemi Onayemi",      "email": "kemi@nativetalk.test",     "company": "Onayemi Health",      "phone": "+234 705 884 9011", "tag": "new",      "channels": ["email"]},
]

DEMO_TICKETS = [
    {"subject": "Customer Cannot Access Account – Requires Refund", "description": "Customer reports login failure after password reset attempt.",                                "priority": "high",   "category": "account",         "status": "in_progress", "assignee": "Support Tier 2", "progress": 40},
    {"subject": "Product Installation & Training Required",         "description": "Enterprise customer needs full setup with staff training.",                                  "priority": "medium", "category": "technical",       "status": "on_hold",     "assignee": "Onboarding",     "progress": 60},
    {"subject": "Refund Already Issued — Confirm Closure",          "description": "Customer reports login failure after password reset attempt and refund was processed.",     "priority": "high",   "category": "billing",         "status": "resolved",    "assignee": "Finance",        "progress": 100},
    {"subject": "Schedule Demo Call for New Plan",                  "description": "Customer reports login failure after password reset attempt and would like a sales call.",  "priority": "low",    "category": "general",         "status": "open",        "assignee": "Sales",          "progress": 0},
    {"subject": "Voice Broadcast Quality Investigation",            "description": "Recipients report static and dropped audio on outbound voice broadcasts.",                   "priority": "medium", "category": "technical",       "status": "on_hold",     "assignee": "Voice Eng",      "progress": 60},
    {"subject": "Bulk SMS Campaign Stuck on Upload",                "description": "Trying to launch a campaign to 5,000 contacts but the dashboard returns a generic error.",  "priority": "urgent", "category": "technical",       "status": "in_progress", "assignee": "Support Tier 2", "progress": 25},
    {"subject": "Add CSV Export to Delivery Reports",               "description": "Need to download delivery reports as CSV for finance reconciliation.",                       "priority": "medium", "category": "feature_request", "status": "open",        "assignee": "Product",        "progress": 0},
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
        random.seed(7)

        customers = []
        for payload in DEMO_CUSTOMERS:
            customer, _ = Customer.objects.update_or_create(
                email=payload["email"],
                defaults={
                    "name":     payload["name"],
                    "company":  payload["company"],
                    "phone":    payload["phone"],
                    "tag":      payload["tag"],
                    "channels": payload["channels"],
                },
            )
            customers.append(customer)

        # Wipe and rebuild demo tickets so re-runs stay deterministic
        Ticket.objects.filter(subject__in=[t["subject"] for t in DEMO_TICKETS]).delete()

        now = timezone.now()
        for index, payload in enumerate(DEMO_TICKETS):
            customer = customers[index % len(customers)]
            ticket = Ticket.objects.create(customer=customer, **payload)
            # Spread created_at across recent months to make the dashboard
            # bar chart look interesting.
            backdate = now - timedelta(days=random.randint(2, 200))
            Ticket.objects.filter(pk=ticket.pk).update(created_at=backdate, updated_at=backdate)

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
