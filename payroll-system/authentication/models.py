from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Roles(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        HR = 'HR', 'HR Manager'
        EMPLOYEE = 'EMPLOYEE', 'Employee'

    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.EMPLOYEE)
