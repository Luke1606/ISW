"""
Permisos asociados al proyecto.
"""
from rest_framework import permissions
from users.models import Professor


class IsDecano(permissions.BasePermission):
    """
    Permite acceso solo a los usuarios con el rol de Decano.
    """
    def has_permission(self, request, view):
        # Verifica si el usuario está autenticado y tiene el rol de Decano.
        return request.user.is_authenticated and getattr(request.user, 'role', None) == 'Decano'


class IsStudent(permissions.BasePermission):
    """
    Permite acceso solo a estudiantes.
    """
    def has_permission(self, request, view):
        # Verificar si el usuario está autenticado y es un estudiante.
        return request.user.is_authenticated and request.user.is_student()


class IsDptoInfProfessor(permissions.BasePermission):
    """
    Permite acceso solo a profesores del departamento de informática para editar solicitudes.
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.is_professor()
            and request.user.professor.role == Professor.Roles.DPTO_INF
        )


class ReadOnlyForOthers(permissions.BasePermission):
    """
    Permite acceso de solo lectura a decanos y profesores simples.
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.is_professor()
            and request.user.professor.role in {Professor.Roles.PROFESSOR, Professor.Roles.DECANO}
        )
