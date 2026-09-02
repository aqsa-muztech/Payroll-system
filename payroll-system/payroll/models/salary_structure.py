# payroll/models/salary_structure.py

import uuid
from decimal import Decimal
from django.db import models
from authentication.models.employee import EmployeeProfile


class SalaryStructure(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.OneToOneField(
        EmployeeProfile, on_delete=models.CASCADE, related_name="salary_structure"
    )
    gross_salary = models.DecimalField(max_digits=12, decimal_places=2)

    # Statutory eligibility flags
    is_eobi_eligible = models.BooleanField(default=True)
    is_pf_eligible = models.BooleanField(default=True)
    is_social_security_eligible = models.BooleanField(default=False)

    @property
    def basic_salary(self):
        return self.gross_salary * Decimal("0.50")

    @property
    def house_rent(self):
        return self.basic_salary * Decimal("0.50")

    @property
    def utilities_allowance(self):
        return self.basic_salary * Decimal("0.20")

    @property
    def conveyance_allowance(self):
        return self.basic_salary * Decimal("0.20")

    @property
    def medical_allowance(self):
        return self.basic_salary * Decimal("0.10")

    def __str__(self):
        return f"{self.employee.system_emp_code} - Gross: {self.gross_salary}"