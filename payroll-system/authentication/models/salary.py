# authentication/models/salary.py

import uuid
from decimal import Decimal
from django.db import models

from .employee import EmployeeProfile


class SalaryStructure(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.OneToOneField(
        EmployeeProfile, on_delete=models.CASCADE, related_name="salary_structure"
    )

    gross_salary = models.DecimalField(max_digits=12, decimal_places=2)

    basic_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    house_rent = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    utilities_allowance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    conveyance_allowance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    medical_allowance = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    class Meta:
        app_label = "authentication"

    def save(self, *args, **kwargs):
        gross = self.gross_salary or Decimal("0")
        self.basic_salary = gross * Decimal("0.50")
        self.house_rent = self.basic_salary * Decimal("0.50")
        self.utilities_allowance = self.basic_salary * Decimal("0.20")
        self.conveyance_allowance = self.basic_salary * Decimal("0.20")
        self.medical_allowance = self.basic_salary * Decimal("0.10")
        super().save(*args, **kwargs)