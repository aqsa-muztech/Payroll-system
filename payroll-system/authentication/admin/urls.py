from django.urls import path

from . import views


urlpatterns = [
    # Super Admin Login
    path(
        "login/",
        views.SuperAdminLoginView.as_view(),
        name="admin-login",
    ),

    # Organization Management
    path(
        "organizations/create/",
        views.create_organization,
        name="admin-create-org",
    ),

    path(
        "organizations/",
        views.list_organizations,
        name="admin-list-orgs",
    ),
]