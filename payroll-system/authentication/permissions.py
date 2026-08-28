# authentication/permissions.py
from rest_framework.permissions import BasePermission
from .models import User

class IsSuperAdmin(BasePermission):
    """Allows access only to Super Admins (Admin App)"""
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.role == User.Roles.SUPER_ADMIN or request.user.is_superuser)
        )

class IsOrgAdmin(BasePermission):
    """Allows access to Organization Admins (CEO/CTO)"""
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == User.Roles.ORG_ADMIN
        )