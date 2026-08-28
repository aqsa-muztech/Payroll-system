import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

class Organization(models.Model):
    """Client Companies created ONLY by Super Admin App"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class User(AbstractUser):
    class Roles(models.TextChoices):
        SUPER_ADMIN = 'SUPER_ADMIN', 'Super Admin'     # Portal 1 (Super Admin App)
        ORG_ADMIN = 'ORG_ADMIN', 'Organization Admin'   # Portal 2 (Org CEO/CTO)
        HR_MANAGER = 'HR_MANAGER', 'HR Manager'         # Portal 2 (HR)
        EMPLOYEE = 'EMPLOYEE', 'Employee'               # Portal 2 (Staff)

    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.EMPLOYEE)
    organization = models.ForeignKey(
        Organization, 
        on_delete=models.CASCADE, 
        related_name='users', 
        null=True, 
        blank=True
    )