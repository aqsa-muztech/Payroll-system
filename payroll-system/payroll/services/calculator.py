# payroll/services/calculator.py

from decimal import Decimal
from payroll.models import SalaryStructure, MonthlyComponent, PayrollPeriod


class PayrollCalculator:

    def __init__(self, employee_profile, period: PayrollPeriod):
        self.employee = employee_profile
        self.period = period
        self.structure = getattr(employee_profile, "salary_structure", None)

    def calculate_net_pay(self):
        if not self.structure:
            raise ValueError("Employee missing a defined salary structure.")

        # Base calculations
        gross = self.structure.gross_salary
        basic = self.structure.basic_salary

        # Fetch monthly additions & deductions
        components = MonthlyComponent.objects.filter(
            employee=self.employee, period=self.period
        )
        bonuses = sum(c.amount for c in components if c.component_type == "BONUS")
        reimbursements = sum(c.amount for c in components if c.component_type == "REIMBURSEMENT")
        deductions = sum(c.amount for c in components if c.component_type == "DEDUCTION")

        # Basic statutory logic (e.g., 8% PF)
        emp_pf = basic * Decimal("0.08") if self.structure.is_pf_eligible else Decimal("0")

        total_earnings = gross + bonuses + reimbursements
        total_deductions = deductions + emp_pf
        net_pay = total_earnings - total_deductions

        return {
            "gross": gross,
            "total_earnings": total_earnings,
            "total_deductions": total_deductions,
            "net_pay": net_pay,
        }