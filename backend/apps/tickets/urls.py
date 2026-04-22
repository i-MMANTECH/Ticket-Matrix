# Emmanuel Aro's project submission for evaluation.
from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import CommentViewSet, TicketStatsView, TicketViewSet

router = DefaultRouter()
router.register(r"tickets", TicketViewSet, basename="ticket")
router.register(r"comments", CommentViewSet, basename="comment")

urlpatterns = [
    path("tickets/stats/", TicketStatsView.as_view(), name="ticket-stats"),
    *router.urls,
]