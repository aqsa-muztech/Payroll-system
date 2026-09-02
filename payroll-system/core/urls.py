from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    # Django Admin
    path(
        "django-admin/",
        admin.site.urls
    ),

    # Super Admin Portal
    path(
        "api/admin/",
        include("authentication.admin.urls")
    ),

    # Client Portal
    path(
        "api/client/",
        include("authentication.client.urls")
    ),

    # Payroll API
    path("api/payroll/", include("payroll.urls")),

    # JWT Refresh
    path(
        "api/auth/token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh"
    ),
]