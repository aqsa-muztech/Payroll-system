# authentication/client/urls.py
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

    # Admin / User Management
    path(
        "users/create/",
        views.create_co_admin_or_employee,
        name="client-create-user",
    ),

    # Employee Management & Initial Salary Setup
    path(
        "employees/",
        views.get_all_employees,
        name="client-get-employees",
    ),
    path(
        "employees/add/",
        views.add_employee,
        name="client-add-employee",
    ),
    # Employee Self-Service
    path(
        "employee/me/",
        views.get_employee_me,
        name="client-employee-me",
    ),
]