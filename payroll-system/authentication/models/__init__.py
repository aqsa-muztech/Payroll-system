# authentication/models/__init__.py

from .organization import Organization
from .user import User
from .employee import EmployeeProfile
from .salary import SalaryStructure

__all__ = [
    "Organization",
    "User",
    "EmployeeProfile",
    "SalaryStructure",
]