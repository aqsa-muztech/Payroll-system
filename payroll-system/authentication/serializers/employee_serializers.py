# authentication/serializers/employee_serializers.py

import re
from django.db import transaction
from rest_framework import serializers

from authentication.models import User, EmployeeProfile
from payroll.models import SalaryStructure


class CreateEmployeeSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    gross_salary = serializers.DecimalField(
        max_digits=12, decimal_places=2, write_only=True
    )

    class Meta:
        model = EmployeeProfile
        fields = [
            "email", "password", "first_name", "last_name",
            "designation", "band", "department", "manager_name",
            "dob", "gender", "father_husband_name", "cnic", "city", "province",
            "doj", "dos", "gross_salary",
        ]

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return email

    def validate_cnic(self, value):
        if value and EmployeeProfile.objects.filter(cnic=value).exists():
            raise serializers.ValidationError("An employee with this CNIC already exists.")
        return value

    def create(self, validated_data):
        request = self.context.get("request")
        org = request.user.organization

        email = validated_data.pop("email").strip().lower()
        password = validated_data.pop("password")
        first_name = validated_data.pop("first_name")
        last_name = validated_data.pop("last_name")
        gross_salary = validated_data.pop("gross_salary")

        with transaction.atomic():
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                role=User.Roles.EMPLOYEE,
                organization=org,
            )

            # Global level check (Taki duplicate unique key constraint fail na ho)
            existing_codes = EmployeeProfile.objects.filter(
                system_emp_code__startswith="EMP-"
            ).values_list("system_emp_code", flat=True)

            max_num = 0
            for code in existing_codes:
                match = re.search(r"EMP-(\d+)", code)
                if match:
                    num = int(match.group(1))
                    if num > max_num:
                        max_num = num

            # Jab tak unique system_emp_code na mil jaye, code safe generate karein
            next_num = max_num + 1
            system_emp_code = f"EMP-{next_num:04d}"
            
            while EmployeeProfile.objects.filter(system_emp_code=system_emp_code).exists():
                next_num += 1
                system_emp_code = f"EMP-{next_num:04d}"

            profile = EmployeeProfile.objects.create(
                user=user,
                organization=org,
                system_emp_code=system_emp_code,
                org_emp_code=system_emp_code,
                **validated_data,
            )

            SalaryStructure.objects.create(
                employee=profile, gross_salary=gross_salary
            )

            return profile