from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Allow access only to admin users."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "ADMIN"


class IsManager(permissions.BasePermission):
    """Allow access to managers and admins."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ["ADMIN", "MANAGER"]


class IsEmployee(permissions.BasePermission):
    """Allow access to employees, managers, and admins."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ["ADMIN", "MANAGER", "EMPLOYEE"]


class IsSelfOrAdmin(permissions.BasePermission):
    """Allow users to view/edit their own record or admins."""

    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and (request.user.role == "ADMIN" or obj == request.user)
