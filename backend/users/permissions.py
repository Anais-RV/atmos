from rest_framework import permissions


class IsSuperUser(permissions.BasePermission):
    """Permiso personalizado para superusuarios."""

    def has_permission(self, request, view):
        return request.user and request.user.is_superuser
    
class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permiso personalizado para permitir solo al propietario editar sus preferencias.
    """

    def has_object_permission(self, request, view, obj):
        # Permisos de lectura permitidos para cualquier request
        if request.method in permissions.SAFE_METHODS:
            return obj.user == request.user
        
        # Permisos de escritura solo para el propietario
        return obj.user == request.user
    
class IsAuthenticatedAndOwner(permissions.BasePermission):
    """
    Permiso que verifica que el usuario esté autenticado
    y sea el propietario de las preferencias.
    """
    
    def has_permission(self, request, view):
        # Usuario debe estar autenticado
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # El objeto debe pertenecer al usuario autenticado
        return obj.user == request.user
