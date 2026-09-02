# payroll/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PayrollPeriodViewSet,
    SalaryStructureViewSet,
    MonthlyComponentViewSet,
    calculate_employee_payroll,
)

router = DefaultRouter()
router.register(r"periods", PayrollPeriodViewSet)
router.register(r"salary-structures", SalaryStructureViewSet)
router.register(r"components", MonthlyComponentViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("calculate/", calculate_employee_payroll, name="calculate-payroll"),
]