# authentication/client/views.py

from rest_framework.views import APIView
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status

from authentication.models import User, EmployeeProfile
from authentication.permissions import IsOrgAdmin
from authentication.serializers import (
    ClientLoginSerializer,
    CreateEmployeeSerializer,
)


# ============================================================
# ORGANIZATION LOGIN
# ============================================================
class ClientLoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = ClientLoginSerializer(data=request.data)

        if serializer.is_valid():
            return Response(
                serializer.validated_data,
                status=status.HTTP_200_OK,
            )

        errors = serializer.errors

        error_msg = (
            errors.get("error", [None])[0]
            if isinstance(errors.get("error"), list)
            else errors.get("error")
        )

        if not error_msg:
            error_msg = errors

        return Response(
            {"error": error_msg},
            status=status.HTTP_400_BAD_REQUEST,
        )


# ============================================================
# GET LOGGED IN USER PROFILE
# ============================================================
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user

    if not user.organization and user.role != User.Roles.SUPER_ADMIN:
        return Response(
            {"error": "User is not assigned to any organization."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    return Response(
        {
            "id": str(user.id),
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
            "organization": (
                {
                    "id": str(user.organization.id),
                    "name": user.organization.name,
                    "slug": user.organization.slug,
                }
                if user.organization
                else None
            ),
        },
        status=status.HTTP_200_OK,
    )


# ============================================================
# CREATE CO-ADMIN / HR MANAGER
# ============================================================
@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsOrgAdmin])
def create_co_admin_or_employee(request):
    user = request.user
    data = request.data

    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", "")).strip()

    username = (
        str(data.get("username", "")).strip() or email.split("@")[0]
        if email
        else ""
    )

    first_name = str(data.get("first_name", "")).strip()
    last_name = str(data.get("last_name", "")).strip()

    target_role = data.get("role", User.Roles.EMPLOYEE)

    if not email:
        return Response(
            {"error": "Email is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not password:
        return Response(
            {"error": "Password is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if target_role not in [
        User.Roles.ORG_ADMIN,
        User.Roles.HR_MANAGER,
        User.Roles.EMPLOYEE,
    ]:
        return Response(
            {"error": "Invalid role specified."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if User.objects.filter(
        email__iexact=email,
        organization=user.organization,
    ).exists():
        return Response(
            {
                "error": (
                    "An account with this email address "
                    "already exists in your organization."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if User.objects.filter(username__iexact=username).exists():
        return Response(
            {"error": f'Username "{username}" already exists.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    new_user = User.objects.create_user(
        username=username,
        password=password,
        email=email,
        first_name=first_name,
        last_name=last_name,
        role=target_role,
        organization=user.organization,
    )

    return Response(
        {
            "message": f'User "{new_user.email}" created successfully.',
            "user": {
                "id": str(new_user.id),
                "username": new_user.username,
                "email": new_user.email,
                "first_name": new_user.first_name,
                "last_name": new_user.last_name,
                "role": new_user.role,
                "organization_id": (
                    str(new_user.organization.id)
                    if new_user.organization
                    else None
                ),
            },
        },
        status=status.HTTP_201_CREATED,
    )


# ============================================================
# ADD EMPLOYEE (PROFILE + INITIAL SALARY SETUP)
# ============================================================
@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsOrgAdmin])
def add_employee(request):
    """
    CLIENT APP: Add Employee with complete personal profile & automatic gross salary breakdown.
    """
    serializer = CreateEmployeeSerializer(
        data=request.data, context={"request": request}
    )
    if serializer.is_valid():
        profile = serializer.save()
        salary = getattr(profile, "salary_structure", None)

        return Response(
            {
                "message": f'Employee "{profile.user.get_full_name()}" created successfully.',
                "employee": {
                    "id": str(profile.id),
                    "system_emp_code": profile.system_emp_code,
                    "org_emp_code": profile.org_emp_code,
                    "name": profile.user.get_full_name(),
                    "email": profile.user.email,
                    "designation": profile.designation,
                    "department": profile.department,
                    "salary_breakdown": {
                        "gross_salary": salary.gross_salary if salary else 0,
                        "basic_salary": salary.basic_salary if salary else 0,
                        "house_rent": salary.house_rent if salary else 0,
                        "utilities_allowance": salary.utilities_allowance if salary else 0,
                        "conveyance_allowance": salary.conveyance_allowance if salary else 0,
                        "medical_allowance": salary.medical_allowance if salary else 0,
                    },
                },
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================================================
# GET ALL EMPLOYEES
# ============================================================
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsOrgAdmin])
def get_all_employees(request):
    """
    CLIENT APP: Get all employees for the requester's organization.
    """
    employees = EmployeeProfile.objects.filter(
        organization=request.user.organization
    ).select_related("user", "salary_structure")

    data = []
    for emp in employees:
        salary = getattr(emp, "salary_structure", None)
        data.append(
            {
                "id": str(emp.id),
                "system_emp_code": emp.system_emp_code,
                "org_emp_code": emp.org_emp_code,
                "name": emp.user.get_full_name(),
                "email": emp.user.email,
                "designation": emp.designation,
                "department": emp.department,
                "doj": emp.doj,
                "gross_salary": salary.gross_salary if salary else 0,
            }
        )

    return Response(data, status=status.HTTP_200_OK)

# ============================================================
# GET EMPLOYEE ME / ME DETAILS (FOR EMPLOYEE DASHBOARD)
# ============================================================
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_employee_me(request):
    """
    CLIENT APP: Fetch authenticated employee's profile and payroll details.
    """
    user = request.user

    try:
        profile = EmployeeProfile.objects.select_related(
            "organization", "salary_structure"
        ).get(user=user)
    except EmployeeProfile.DoesNotExist:
        return Response(
            {"error": "Employee profile not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    salary = getattr(profile, "salary_structure", None)

    return Response(
        {
            "profile": {
                "system_emp_code": profile.system_emp_code,
                "org_emp_code": profile.org_emp_code,
                "full_name": user.get_full_name(),
                "email": user.email,
                "designation": profile.designation,
                "department": profile.department,
                "band": profile.band,
                "manager_name": profile.manager_name,
                "doj": profile.doj,
                "cnic": profile.cnic,
                "city": profile.city,
                "province": profile.province,
                "organization_name": profile.organization.name,
            },
            "payroll": {
                "gross_salary": salary.gross_salary if salary else 0,
                "basic_salary": salary.basic_salary if salary else 0,
                "house_rent": salary.house_rent if salary else 0,
                "utilities_allowance": salary.utilities_allowance if salary else 0,
                "conveyance_allowance": salary.conveyance_allowance if salary else 0,
                "medical_allowance": salary.medical_allowance if salary else 0,
            },
        },
        status=status.HTTP_200_OK,
    )