import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

class Organization(models.Model):
    """Tenant model representing client companies (e.g., ABC Corp, XYZ Inc)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class User(AbstractUser):
    """Custom user model supporting Multi-Tenancy and Role Hierarchy"""
    class Roles(models.TextChoices):
        SUPER_ADMIN = 'SUPER_ADMIN', 'Super Admin'           # Platform Software Owner
        ORG_ADMIN = 'ORG_ADMIN', 'Organization Admin'         # CEO, CTO, Director
        HR_MANAGER = 'HR_MANAGER', 'HR Manager'               # HR Team
        EMPLOYEE = 'EMPLOYEE', 'Employee'                     # Regular Employee

    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.EMPLOYEE)
    
    # Nullable for SUPER_ADMIN because they operate above specific organizations
    organization = models.ForeignKey(
        Organization, 
        on_delete=models.CASCADE, 
        related_name='users', 
        null=True, 
        blank=True
    )

    def is_super_admin(self):
        return self.role == self.Roles.SUPER_ADMIN or self.is_superuser

    def is_org_admin(self):
        return self.role == self.Roles.ORG_ADMIN