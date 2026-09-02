# payroll/admin.py

from django.contrib import admin
from .models import PayrollPeriod, TaxSlab, SalaryStructure, MonthlyComponent

@admin.register(PayrollPeriod)
class PayrollPeriodAdmin(admin.ModelAdmin):
    list_display = ("year", "month", "status", "created_at")

@admin.register(SalaryStructure)
class SalaryStructureAdmin(admin.ModelAdmin):
    list_display = ("employee", "gross_salary", "is_pf_eligible", "is_eobi_eligible")

@admin.register(MonthlyComponent)
class MonthlyComponentAdmin(admin.ModelAdmin):
    list_display = ("employee", "period", "component_type", "name", "amount")

@admin.register(TaxSlab)
class TaxSlabAdmin(admin.ModelAdmin):
    list_display = ("min_income", "max_income", "fixed_tax", "tax_rate_percentage")