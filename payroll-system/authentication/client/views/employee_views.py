# authentication/client/views/employee_views.py

from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status

from authentication.models import EmployeeProfile
from authentication.permissions import IsOrgAdmin
from authentication.serializers import CreateEmployeeSerializer


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsOrgAdmin])
def add_employee(request):
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


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsOrgAdmin])
def get_all_employees(request):
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


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_employee_me(request):
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