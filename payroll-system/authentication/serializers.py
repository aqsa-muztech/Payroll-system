from django.db import transaction
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from authentication.models import User, Organization, EmployeeProfile, SalaryStructure


# ============================================================
# SUPER ADMIN LOGIN
# Email + Password
# ============================================================
class SuperAdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        required=True,
        write_only=True
    )

    def validate(self, attrs):
        email = attrs.get("email", "").strip().lower()
        password = attrs.get("password", "")

        # Find user by email
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {"error": "Invalid email or password."}
            )

        # Make sure this is a Super Admin
        if not user.is_super_admin():
            raise serializers.ValidationError(
                {"error": "You are not authorized as a Super Admin."}
            )

        # Check password
        if not user.check_password(password):
            raise serializers.ValidationError(
                {"error": "Invalid email or password."}
            )

        # Check active account
        if not user.is_active:
            raise serializers.ValidationError(
                {"error": "User account is disabled."}
            )

        # Generate JWT
        refresh = RefreshToken.for_user(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": str(user.id),
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "organization": None,
            },
        }


# ============================================================
# CLIENT LOGIN
# Organization Name + Email + Password
# ============================================================
class ClientLoginSerializer(serializers.Serializer):
    org_name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        required=True,
        write_only=True
    )

    def validate(self, attrs):
        org_name = attrs.get("org_name", "").strip()
        email = attrs.get("email", "").strip().lower()
        password = attrs.get("password", "")

        # ----------------------------------------------------
        # FIND ORGANIZATION
        # ----------------------------------------------------
        try:
            organization = Organization.objects.get(
                name__iexact=org_name,
                is_active=True
            )
        except Organization.DoesNotExist:
            raise serializers.ValidationError(
                {"error": "Organization not found or inactive."}
            )

        # ----------------------------------------------------
        # FIND USER INSIDE ORGANIZATION
        # ----------------------------------------------------
        try:
            user = User.objects.get(
                email__iexact=email,
                organization=organization
            )
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {
                    "error": (
                        "Invalid email or user does not "
                        "belong to this organization."
                    )
                }
            )

        # ----------------------------------------------------
        # CHECK PASSWORD
        # ----------------------------------------------------
        if not user.check_password(password):
            raise serializers.ValidationError(
                {"error": "Invalid email or password."}
            )

        # ----------------------------------------------------
        # CHECK USER ACTIVE
        # ----------------------------------------------------
        if not user.is_active:
            raise serializers.ValidationError(
                {"error": "User account is disabled."}
            )

        # ----------------------------------------------------
        # GENERATE JWT
        # ----------------------------------------------------
        refresh = RefreshToken.for_user(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": str(user.id),
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "organization": {
                    "id": str(organization.id),
                    "name": organization.name,
                    "slug": organization.slug,
                },
            },
        }


# ============================================================
# CREATE EMPLOYEE (User + Profile + Salary Structure)
# ============================================================
class CreateEmployeeSerializer(serializers.ModelSerializer):
    # User Credentials
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)

    # Initial Salary Input
    gross_salary = serializers.DecimalField(
        max_digits=12, decimal_places=2, write_only=True
    )

    class Meta:
        model = EmployeeProfile
        fields = [
            'email', 'password', 'first_name', 'last_name',
            'org_emp_code', 'designation', 'band', 'department', 'manager_name',
            'dob', 'gender', 'father_husband_name', 'cnic', 'city', 'province',
            'doj', 'dos', 'gross_salary'
        ]

    def create(self, validated_data):
        request = self.context.get('request')
        org = request.user.organization

        email = validated_data.pop('email').strip().lower()
        password = validated_data.pop('password')
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        gross_salary = validated_data.pop('gross_salary')

        with transaction.atomic():
            # 1. Base User Account Create Karein
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                role=User.Roles.EMPLOYEE,
                organization=org
            )

            # 2. System Code Auto-generate Karein (e.g., EMP-0001)
            emp_count = EmployeeProfile.objects.filter(organization=org).count() + 1
            system_emp_code = f"EMP-{emp_count:04d}"

            # 3. Employee Profile Save Karein
            profile = EmployeeProfile.objects.create(
                user=user,
                organization=org,
                system_emp_code=system_emp_code,
                **validated_data
            )

            # 4. Salary Structure Create Karein (Save method breakdown auto calculate kar dega)
            SalaryStructure.objects.create(
                employee=profile,
                gross_salary=gross_salary
            )

            return profile