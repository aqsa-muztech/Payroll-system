from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from authentication.models import User, Organization


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