# authentication/models.py

import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

class Organization(models.Model):
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
        SUPER_ADMIN = 'SUPER_ADMIN', 'Super Admin'           
        ORG_ADMIN = 'ORG_ADMIN', 'Organization Admin'        
        HR_MANAGER = 'HR_MANAGER', 'HR Manager'               
        EMPLOYEE = 'EMPLOYEE', 'Employee'                    

    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.EMPLOYEE)
    
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

class EmployeeProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='employees')
    
    system_emp_code = models.CharField(max_length=50, unique=True, blank=True)
    org_emp_code = models.CharField(max_length=50, blank=True, null=True)
    designation = models.CharField(max_length=100)
    band = models.CharField(max_length=50, blank=True, null=True)
    department = models.CharField(max_length=100)
    manager_name = models.CharField(max_length=100, blank=True, null=True)
    
    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')])
    father_husband_name = models.CharField(max_length=100, blank=True, null=True)
    cnic = models.CharField(max_length=20, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    province = models.CharField(max_length=100, blank=True, null=True)
    
    doj = models.DateField(help_text="Date of Joining")
    dos = models.DateField(null=True, blank=True, help_text="Date of Separation")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.system_emp_code})"


class SalaryStructure(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.OneToOneField(EmployeeProfile, on_delete=models.CASCADE, related_name='salary_structure')
    
    gross_salary = models.DecimalField(max_digits=12, decimal_places=2)
    
    basic_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    house_rent = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    utilities_allowance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    conveyance_allowance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    medical_allowance = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def save(self, *args, **kwargs):
        gross = float(self.gross_salary or 0)
        self.basic_salary = gross * 0.50
        self.house_rent = self.basic_salary * 0.50
        self.utilities_allowance = self.basic_salary * 0.20
        self.conveyance_allowance = self.basic_salary * 0.20
        self.medical_allowance = self.basic_salary * 0.10
        super().save(*args, **kwargs)