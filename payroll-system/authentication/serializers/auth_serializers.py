# authentication/serializers/auth_serializers.py

from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from authentication.models import User, Organization


class SuperAdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        email = attrs.get("email", "").strip().lower()
        password = attrs.get("password", "")

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({"error": "Invalid email or password."})

        if not user.is_super_admin():
            raise serializers.ValidationError({"error": "You are not authorized as a Super Admin."})

        if not user.check_password(password):
            raise serializers.ValidationError({"error": "Invalid email or password."})

        if not user.is_active:
            raise serializers.ValidationError({"error": "User account is disabled."})

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


class ClientLoginSerializer(serializers.Serializer):
    org_name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        org_name = attrs.get("org_name", "").strip()
        email = attrs.get("email", "").strip().lower()
        password = attrs.get("password", "")

        try:
            organization = Organization.objects.get(name__iexact=org_name, is_active=True)
        except Organization.DoesNotExist:
            raise serializers.ValidationError({"error": "Organization not found or inactive."})

        try:
            user = User.objects.get(email__iexact=email, organization=organization)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {"error": "Invalid email or user does not belong to this organization."}
            )

        if not user.check_password(password):
            raise serializers.ValidationError({"error": "Invalid email or password."})

        if not user.is_active:
            raise serializers.ValidationError({"error": "User account is disabled."})

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