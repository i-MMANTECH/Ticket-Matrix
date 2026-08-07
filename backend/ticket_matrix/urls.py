# Emmanuel Aro's project submission for evaluation.
"""Root URL configuration for the Ticket Matrix backend."""
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView


def healthcheck(_request):
    return JsonResponse({"status": "ok", "service": "ticket-matrix-backend"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", healthcheck, name="healthcheck"),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/swagger/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/docs/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    path("api/", include("apps.tickets.urls")),
    path("api/", include("apps.customers.urls")),
]