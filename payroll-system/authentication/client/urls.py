from django.urls import path

from . import views


urlpatterns = [
    # Client Login
    path(
        "login/",
        views.ClientLoginView.as_view(),
        name="client-login",
    ),

    # Profile
    path(
        "profile/",
        views.get_profile,
        name="client-profile",
    ),

    # User Management
    path(
        "users/create/",
        views.create_co_admin_or_employee,
        name="client-create-user",
    ),
]