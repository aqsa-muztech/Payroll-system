# authentication/models/user.py

from django.db import models
from django.contrib.auth.models import AbstractUser

from .organization import Organization


class User(AbstractUser):
    """Custom user model supporting Multi-Tenancy and Role Hierarchy"""

    class Roles(models.TextChoices):
        SUPER_ADMIN = "SUPER_ADMIN", "Super Admin"
        ORG_ADMIN = "ORG_ADMIN", "Organization Admin"
        HR_MANAGER = "HR_MANAGER", "HR Manager"
        EMPLOYEE = "EMPLOYEE", "Employee"

    role = models.CharField(
        max_length=20, choices=Roles.choices, default=Roles.EMPLOYEE
    )

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="users",
        null=True,
        blank=True,
    )

    class Meta:
        app_label = "authentication"

    def is_super_admin(self):
        return self.role == self.Roles.SUPER_ADMIN or self.is_superuser

    def is_org_admin(self):
        return self.role == self.Roles.ORG_ADMIN