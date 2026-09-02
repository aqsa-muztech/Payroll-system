# payroll/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from authentication.models import EmployeeProfile
from .models import PayrollPeriod, SalaryStructure, MonthlyComponent
from .serializers import (
    PayrollPeriodSerializer,
    SalaryStructureSerializer,
    MonthlyComponentSerializer,
)
from .services.calculator import PayrollCalculator


class PayrollPeriodViewSet(viewsets.ModelViewSet):
    queryset = PayrollPeriod.objects.all()
    serializer_class = PayrollPeriodSerializer


class SalaryStructureViewSet(viewsets.ModelViewSet):
    queryset = SalaryStructure.objects.all()
    serializer_class = SalaryStructureSerializer


class MonthlyComponentViewSet(viewsets.ModelViewSet):
    queryset = MonthlyComponent.objects.all()
    serializer_class = MonthlyComponentSerializer


@api_view(["POST"])
def calculate_employee_payroll(request):

    employee_id = request.data.get("employee_id")
    period_id = request.data.get("period_id")

    try:
        employee = EmployeeProfile.objects.get(id=employee_id)
        period = PayrollPeriod.objects.get(id=period_id)
    except (EmployeeProfile.DoesNotExist, PayrollPeriod.DoesNotExist):
        return Response(
            {"error": "Invalid employee or payroll period ID."},
            status=status.HTTP_404_NOT_FOUND,
        )

    try:
        calc = PayrollCalculator(employee, period)
        result = calc.calculate_net_pay()
        return Response(result, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)