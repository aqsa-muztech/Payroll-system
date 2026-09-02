# payroll/models/components.py

import uuid
from django.db import models
from authentication.models.employee import EmployeeProfile
from .base import PayrollPeriod


class MonthlyComponent(models.Model):
    COMPONENT_TYPES = [
        ("BONUS", "Bonus"),
        ("REIMBURSEMENT", "Reimbursement"),
        ("DEDUCTION", "Deduction"),
        ("ARREARS", "Arrears"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE)
    period = models.ForeignKey(PayrollPeriod, on_delete=models.CASCADE)
    component_type = models.CharField(max_length=20, choices=COMPONENT_TYPES)
    name = models.CharField(max_length=100)  # e.g., "Festive Bonus", "TA/DA", "Salary Advance"
    amount = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.employee.system_emp_code} - {self.name}: {self.amount}"