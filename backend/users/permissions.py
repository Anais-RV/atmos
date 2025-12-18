from rest_framework import permissions


class IsSuperUser(permissions.BasePermission):
    """Permiso personalizado para superusuarios."""

    def has_permission(self, request, view):
        return request.user and request.user.is_superuser
