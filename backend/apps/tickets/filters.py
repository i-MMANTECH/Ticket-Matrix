# Emmanuel Aro's project submission for evaluation.
import django_filters

from .models import Ticket


class TicketFilter(django_filters.FilterSet):
    status = django_filters.MultipleChoiceFilter(choices=Ticket.Status.choices)
    priority = django_filters.MultipleChoiceFilter(choices=Ticket.Priority.choices)
    category = django_filters.MultipleChoiceFilter(choices=Ticket.Category.choices)
    customer = django_filters.UUIDFilter(field_name="customer__id")
    created_after = django_filters.DateTimeFilter(
        field_name="created_at", lookup_expr="gte"
    )
    created_before = django_filters.DateTimeFilter(
        field_name="created_at", lookup_expr="lte"
    )

    class Meta:
        model = Ticket
        fields = ["status", "priority", "category", "customer"]