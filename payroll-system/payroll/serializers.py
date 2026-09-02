# payroll/serializers.py

from rest_framework import serializers
from .models import PayrollPeriod, SalaryStructure, MonthlyComponent


class PayrollPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayrollPeriod
        fields = "__all__"


class SalaryStructureSerializer(serializers.ModelSerializer):
    basic_salary = serializers.ReadOnlyField()
    house_rent = serializers.ReadOnlyField()
    utilities_allowance = serializers.ReadOnlyField()

    class Meta:
        model = SalaryStructure
        fields = "__all__"


class MonthlyComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyComponent
        fields = "__all__"