# authentication/models/employee.py

import uuid
from django.db import models

from .user import User
from .organization import Organization


class EmployeeProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="profile"
    )
    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="employees"
    )

    system_emp_code = models.CharField(max_length=50, unique=True, blank=True)
    org_emp_code = models.CharField(max_length=50, blank=True, null=True)
    designation = models.CharField(max_length=100)
    band = models.CharField(max_length=50, blank=True, null=True)
    department = models.CharField(max_length=100)
    manager_name = models.CharField(max_length=100, blank=True, null=True)

    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(
        max_length=20,
        choices=[("Male", "Male"), ("Female", "Female"), ("Other", "Other")],
    )
    father_husband_name = models.CharField(max_length=100, blank=True, null=True)
    cnic = models.CharField(max_length=20, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    province = models.CharField(max_length=100, blank=True, null=True)

    doj = models.DateField(help_text="Date of Joining")
    dos = models.DateField(null=True, blank=True, help_text="Date of Separation")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = "authentication"

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.system_emp_code})"