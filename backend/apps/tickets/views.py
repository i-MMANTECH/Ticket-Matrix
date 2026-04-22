# Emmanuel Aro's project submission for evaluation.
from django.db.models import Count, Q
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .filters import TicketFilter
from .models import Comment, Ticket
from .serializers import (
    CommentSerializer,
    TicketCreateSerializer,
    TicketDetailSerializer,
    TicketListSerializer,
)


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.select_related("customer").prefetch_related("comments")
    filterset_class = TicketFilter
    search_fields = ["subject", "description", "reference", "customer__name"]
    ordering_fields = ["created_at", "updated_at", "priority", "status"]
    lookup_field = "id"

    def get_serializer_class(self):
        if self.action == "list":
            return TicketListSerializer
        if self.action in {"create", "update", "partial_update"}:
            return TicketCreateSerializer
        return TicketDetailSerializer

    @action(detail=True, methods=["get", "post"], url_path="comments")
    def comments(self, request, id=None):
        """List or add comments for a single ticket."""
        ticket = self.get_object()

        if request.method == "GET":
            serializer = CommentSerializer(ticket.comments.all(), many=True)
            return Response(serializer.data)

        serializer = CommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(ticket=ticket)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TicketStatsView(APIView):
    """Aggregation endpoint powering the dashboard.

    Returns:
        - totals: overall ticket counts grouped by status
        - by_priority: counts grouped by priority
        - by_category: counts grouped by category
        - completion_rate: resolved+closed / total (0 when there are no tickets)
    """

    def get(self, request):
        qs = Ticket.objects.all()
        total = qs.count()

        status_counts = (
            qs.values("status")
            .annotate(count=Count("id"))
            .order_by("status")
        )
        priority_counts = (
            qs.values("priority")
            .annotate(count=Count("id"))
            .order_by("priority")
        )
        category_counts = (
            qs.values("category")
            .annotate(count=Count("id"))
            .order_by("category")
        )

        # Completion rate: count anything that has reached a terminal state
        completed = qs.filter(
            Q(status=Ticket.Status.RESOLVED) | Q(status=Ticket.Status.CLOSED)
        ).count()
        completion_rate = round((completed / total) * 100, 2) if total else 0.0

        # Normalise into status_map keyed by Status value for easy frontend lookup
        status_map = {choice.value: 0 for choice in Ticket.Status}
        for row in status_counts:
            status_map[row["status"]] = row["count"]

        return Response(
            {
                "total": total,
                "completed": completed,
                "completion_rate": completion_rate,
                "by_status": status_map,
                "by_priority": list(priority_counts),
                "by_category": list(category_counts),
            }
        )


class CommentViewSet(viewsets.ModelViewSet):
    """Standalone comment endpoint for direct CRUD when needed."""

    queryset = Comment.objects.select_related("ticket")
    serializer_class = CommentSerializer