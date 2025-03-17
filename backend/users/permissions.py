from rest_framework import permissions


class IsDecano(permissions.BasePermission):
    """
    Permite acceso solo a los usuarios con el rol de Decano.
    """
    def has_permission(self, request, view):
        # Verifica si el usuario está autenticado y tiene el rol de Decano.
        return request.user.is_authenticated and getattr(request.user, 'role', None) == 'Decano'
