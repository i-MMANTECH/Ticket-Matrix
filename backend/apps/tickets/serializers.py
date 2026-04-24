# Emmanuel Aro's project submission for evaluation.
from rest_framework import serializers

from apps.customers.models import Customer
from apps.customers.serializers import CustomerSerializer

from .models import Comment, Ticket


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = [
            "id",
            "ticket",
            "author_name",
            "author_email",
            "content",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
        extra_kwargs = {"ticket": {"required": False}}


class TicketListSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    comments_count = serializers.IntegerField(source="comments.count", read_only=True)

    class Meta:
        model = Ticket
        fields = [
            "id",
            "reference",
            "customer",
            "subject",
            "priority",
            "category",
            "status",
            "assignee",
            "progress",
            "comments_count",
            "created_at",
            "updated_at",
        ]


class TicketDetailSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Ticket
        fields = [
            "id",
            "reference",
            "customer",
            "subject",
            "description",
            "priority",
            "category",
            "status",
            "assignee",
            "progress",
            "comments",
            "created_at",
            "updated_at",
        ]


class TicketCreateSerializer(serializers.ModelSerializer):
    """Accepts an existing customer_id OR an inline customer payload.

    Lets the frontend "New Ticket" modal create everything in one POST when
    the requester isn't already in the system.
    """

    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(),
        source="customer",
        required=False,
        write_only=True,
    )
    customer = CustomerSerializer(read_only=True)
    customer_name = serializers.CharField(write_only=True, required=False)
    customer_email = serializers.EmailField(write_only=True, required=False)

    class Meta:
        model = Ticket
        fields = [
            "id",
            "reference",
            "customer",
            "customer_id",
            "customer_name",
            "customer_email",
            "subject",
            "description",
            "priority",
            "category",
            "status",
            "assignee",
            "progress",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "reference", "created_at", "updated_at"]

    def validate(self, attrs):
        if not attrs.get("customer") and not (
            attrs.get("customer_name") and attrs.get("customer_email")
        ):
            raise serializers.ValidationError(
                "Provide either customer_id, or both customer_name and customer_email."
            )
        return attrs

    def create(self, validated_data):
        customer = validated_data.pop("customer", None)
        name = validated_data.pop("customer_name", None)
        email = validated_data.pop("customer_email", None)

        if not customer:
            customer, _ = Customer.objects.get_or_create(
                email=email, defaults={"name": name},
            )
        validated_data["customer"] = customer
        return super().create(validated_data)