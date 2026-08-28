from rest_framework.views import APIView
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status

from authentication.models import User, Organization
from authentication.permissions import IsSuperAdmin
from authentication.serializers import SuperAdminLoginSerializer


# ============================================================
# SUPER ADMIN LOGIN
# Email + Password
# ============================================================
class SuperAdminLoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = SuperAdminLoginSerializer(
            data=request.data
        )

        if serializer.is_valid():
            return Response(
                serializer.validated_data,
                status=status.HTTP_200_OK,
            )

        errors = serializer.errors

        error_msg = errors.get("error")

        if isinstance(error_msg, list):
            error_msg = error_msg[0]

        if not error_msg:
            error_msg = errors

        return Response(
            {"error": error_msg},
            status=status.HTTP_400_BAD_REQUEST,
        )


# ============================================================
# CREATE ORGANIZATION
# Super Admin Only
# ============================================================
@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsSuperAdmin])
def create_organization(request):

    data = request.data

    org_name = str(
        data.get("org_name", "")
    ).strip()

    org_slug = str(
        data.get("org_slug", "")
    ).strip().lower()

    admins_data = data.get("admins", [])

    # --------------------------------------------------------
    # ORGANIZATION VALIDATION
    # --------------------------------------------------------

    if not org_name:
        return Response(
            {
                "error": "Organization name is required."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not org_slug:
        return Response(
            {
                "error": "Organization slug is required."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if Organization.objects.filter(
        slug=org_slug
    ).exists():

        return Response(
            {
                "error": "Organization slug already exists."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # --------------------------------------------------------
    # ADMINS VALIDATION
    # --------------------------------------------------------

    if not isinstance(admins_data, list):
        return Response(
            {
                "error": "Admins must be provided as a list."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if len(admins_data) < 1:
        return Response(
            {
                "error": (
                    "At least 1 Founder/Admin "
                    "is required."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if len(admins_data) > 5:
        return Response(
            {
                "error": (
                    "Maximum 5 Founders/Admins "
                    "are allowed per organization."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # --------------------------------------------------------
    # VALIDATE EACH ADMIN
    # --------------------------------------------------------

    request_usernames = set()

    for index, admin in enumerate(admins_data):

        if not isinstance(admin, dict):
            return Response(
                {
                    "error": (
                        f"Invalid data for "
                        f"Founder/Admin #{index + 1}."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        username = str(
            admin.get("username", "")
        ).strip()

        password = str(
            admin.get("password", "")
        ).strip()

        email = str(
            admin.get("email", "")
        ).strip().lower()

        # Username
        if not username:
            return Response(
                {
                    "error": (
                        f"Username is required for "
                        f"Founder/Admin #{index + 1}."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Password
        if not password:
            return Response(
                {
                    "error": (
                        f"Password is required for "
                        f"Founder/Admin #{index + 1}."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Duplicate username in request
        if username.lower() in request_usernames:
            return Response(
                {
                    "error": (
                        f'Username "{username}" '
                        f"is duplicated."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        request_usernames.add(
            username.lower()
        )

        # Existing username
        if User.objects.filter(
            username__iexact=username
        ).exists():

            return Response(
                {
                    "error": (
                        f'Username "{username}" '
                        f"already exists."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Email is OPTIONAL
        if email and User.objects.filter(
            email__iexact=email
        ).exists():

            return Response(
                {
                    "error": (
                        f'Email "{email}" '
                        f"already exists."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    # --------------------------------------------------------
    # CREATE ORGANIZATION
    # --------------------------------------------------------

    organization = Organization.objects.create(
        name=org_name,
        slug=org_slug,
    )

    # --------------------------------------------------------
    # CREATE ORGANIZATION ADMINS
    # --------------------------------------------------------

    created_admins = []

    for admin in admins_data:

        username = str(
            admin.get("username", "")
        ).strip()

        password = str(
            admin.get("password", "")
        ).strip()

        email = str(
            admin.get("email", "")
        ).strip().lower()

        first_name = str(
            admin.get("first_name", "")
        ).strip()

        last_name = str(
            admin.get("last_name", "")
        ).strip()

        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            first_name=first_name,
            last_name=last_name,
            role=User.Roles.ORG_ADMIN,
            organization=organization,
        )

        created_admins.append(
            {
                "id": str(user.id),
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
            }
        )

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return Response(
        {
            "message": (
                f'Organization "{organization.name}" '
                f"created successfully."
            ),
            "organization": {
                "id": str(organization.id),
                "name": organization.name,
                "slug": organization.slug,
                "is_active": organization.is_active,
            },
            "admins": created_admins,
        },
        status=status.HTTP_201_CREATED,
    )


# ============================================================
# LIST ALL ORGANIZATIONS
# Super Admin Only
# ============================================================
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsSuperAdmin])
def list_organizations(request):

    organizations = Organization.objects.all().order_by(
        "name"
    )

    organizations_data = []

    for organization in organizations:

        admins = User.objects.filter(
            organization=organization,
            role=User.Roles.ORG_ADMIN,
        )

        admins_data = []

        for admin in admins:

            admins_data.append(
                {
                    "id": str(admin.id),
                    "username": admin.username,
                    "email": admin.email,
                    "first_name": admin.first_name,
                    "last_name": admin.last_name,
                    "role": admin.role,
                }
            )

        organizations_data.append(
            {
                "id": str(organization.id),
                "name": organization.name,
                "slug": organization.slug,
                "is_active": organization.is_active,
                "created_at": organization.created_at,
                "admins_count": admins.count(),
                "admins": admins_data,
            }
        )

    return Response(
        {
            "count": organizations.count(),
            "organizations": organizations_data,
        },
        status=status.HTTP_200_OK,
    )