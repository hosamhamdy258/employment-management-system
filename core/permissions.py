from rest_framework import permissions


class RolePermission(permissions.BasePermission):
    allowed_roles = []

    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.role in self.allowed_roles)


class IsAdmin(RolePermission):
    allowed_roles = ["ADMIN"]


class IsManager(RolePermission):
    allowed_roles = ["ADMIN", "MANAGER"]


class IsEmployee(RolePermission):
    allowed_roles = ["ADMIN", "MANAGER", "EMPLOYEE"]


class IsSelfOrAdmin(permissions.BasePermission):
    """Allow users to view/edit their own record or admins."""

    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and (request.user.role == "ADMIN" or obj == request.user)
