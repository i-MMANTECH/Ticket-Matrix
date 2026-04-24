# Emmanuel Aro's project submission for evaluation.
from __future__ import annotations

import uuid

from django.db import models


class Customer(models.Model):
    """A customer who can raise tickets against the platform."""

    class Tag(models.TextChoices):
        NONE = "", "—"
        VIP = "vip", "VIP Customer"
        FREQUENT = "frequent", "Frequent Buyer"
        NEW = "new", "New"

    CHANNEL_CHOICES = ("instagram", "facebook", "whatsapp", "email", "sms")

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=32, blank=True, default="")
    company = models.CharField(max_length=150, blank=True, default="")
    avatar_url = models.URLField(blank=True, default="")
    tag = models.CharField(
        max_length=16, choices=Tag.choices, default=Tag.NONE, blank=True
    )
    channels = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["email"])]

    def __str__(self) -> str:
        return f"{self.name} <{self.email}>"
