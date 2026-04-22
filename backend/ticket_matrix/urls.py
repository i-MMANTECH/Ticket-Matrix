# Emmanuel Aro's project submission for evaluation.
"""Root URL configuration for the Ticket Matrix backend."""
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def healthcheck(_request):
    return JsonResponse({"status": "ok", "service": "ticket-matrix-backend"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", healthcheck, name="healthcheck"),
    path("api/", include("apps.tickets.urls")),
    path("api/", include("apps.customers.urls")),
]