# authentication/client/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Client Authentication & Profile
    path("login/", views.ClientLoginView.as_view(), name="client-login"),
    path("profile/", views.get_profile, name="client-profile"),
    path("users/create/", views.create_co_admin_or_employee, name="client-create-user"),

    # Employee Management & Salary
    path("employees/", views.get_all_employees, name="client-get-employees"),
    path("employees/add/", views.add_employee, name="client-add-employee"),
    path("employee/me/", views.get_employee_me, name="client-employee-me"),
]