# Emmanuel Aro's project submission for evaluation.
from rest_framework import serializers

from .models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "company",
            "avatar_url",
            "tag",
            "channels",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_channels(self, value):
        allowed = set(Customer.CHANNEL_CHOICES)
        bad = [c for c in value if c not in allowed]
        if bad:
            raise serializers.ValidationError(
                f"Unsupported channel(s): {bad}. Allowed: {sorted(allowed)}."
            )
        return value
