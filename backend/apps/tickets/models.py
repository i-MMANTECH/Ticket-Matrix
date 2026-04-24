# Emmanuel Aro's project submission for evaluation.
from __future__ import annotations

import uuid

from django.db import models

from apps.customers.models import Customer


class Ticket(models.Model):
    class Priority(models.TextChoices):
        LOW = "low", "Low"
        MEDIUM = "medium", "Medium"
        HIGH = "high", "High"
        URGENT = "urgent", "Urgent"

    class Category(models.TextChoices):
        TECHNICAL = "technical", "Technical"
        BILLING = "billing", "Billing"
        ACCOUNT = "account", "Account"
        FEATURE_REQUEST = "feature_request", "Feature Request"
        GENERAL = "general", "General"

    class Status(models.TextChoices):
        OPEN = "open", "Open"
        IN_PROGRESS = "in_progress", "In Progress"
        ON_HOLD = "on_hold", "On Hold"
        RESOLVED = "resolved", "Resolved"
        CLOSED = "closed", "Closed"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reference = models.CharField(max_length=20, unique=True, editable=False)
    customer = models.ForeignKey(
        Customer, on_delete=models.CASCADE, related_name="tickets"
    )
    subject = models.CharField(max_length=180)
    description = models.TextField()
    priority = models.CharField(
        max_length=16, choices=Priority.choices, default=Priority.MEDIUM
    )
    category = models.CharField(
        max_length=32, choices=Category.choices, default=Category.GENERAL
    )
    status = models.CharField(
        max_length=16, choices=Status.choices, default=Status.OPEN
    )
    assignee = models.CharField(max_length=120, blank=True, default="")
    progress = models.PositiveSmallIntegerField(default=0)  # 0..100
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["priority"]),
            models.Index(fields=["category"]),
        ]

    def save(self, *args, **kwargs):
        if not self.reference:
            self.reference = f"TKT-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.reference} — {self.subject}"


class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket = models.ForeignKey(
        Ticket, on_delete=models.CASCADE, related_name="comments"
    )
    author_name = models.CharField(max_length=120)
    author_email = models.EmailField(blank=True, default="")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self) -> str:
        return f"Comment by {self.author_name} on {self.ticket.reference}"