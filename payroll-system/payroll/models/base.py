# payroll/models/base.py

import uuid
from django.db import models


class PayrollPeriod(models.Model):
    STATUS_CHOICES = [
        ("DRAFT", "Draft"),
        ("PROCESSING", "Processing"),
        ("COMPLETED", "Completed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    month = models.PositiveSmallIntegerField()  # 1 - 12
    year = models.PositiveIntegerField()        # e.g., 2026
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="DRAFT")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("month", "year")

    def __str__(self):
        return f"{self.year}-{self.month:02d} ({self.status})"


class TaxSlab(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    min_income = models.DecimalField(max_digits=12, decimal_places=2)
    max_income = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    fixed_tax = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax_rate_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    def __str__(self):
        return f"Income: {self.min_income} - {self.max_income} | Rate: {self.tax_rate_percentage}%"