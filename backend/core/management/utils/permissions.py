"""
Permisos asociados al proyecto.
"""
from rest_framework import permissions
from users.models import Professor


class IsStudent(permissions.BasePermission):
    """
    Permite acceso solo a estudiantes.
    """
    def has_permission(self, request, view=None):
        return request.user.is_authenticated and request.user.is_student


class IsProfessor(permissions.BasePermission):
    """
    Permite acceso solo a profesores.
    """
    def has_permission(self, request, view=None):
        return request.user.is_authenticated and request.user.is_professor


class IsRegularProfessor(permissions.BasePermission):
    """
    Permite acceso solo a profesores.
    """
    def has_permission(self, request, view=None):
        user = request.user
        return user.is_authenticated and user.is_professor and user.user_role == Professor.Roles.PROFESSOR


class IsDptoInfProfessor(permissions.BasePermission):
    """
    Permite acceso solo a profesores del departamento de informática para editar solicitudes.
    """
    def has_permission(self, request, view=None):
        return request.user.is_authenticated and request.user.user_role == Professor.Roles.DPTO_INF


class IsDecano(permissions.BasePermission):
    """
    Permite acceso solo a los usuarios con el rol de Decano.
    """
    def has_permission(self, request, view=None):
        return request.user.is_authenticated and request.user.user_role == Professor.Roles.DECAN


class ReadOnlyForOthers(permissions.BasePermission):
    """
    Permite acceso de solo lectura a decanos y profesores simples.
    """
    def has_permission(self, request, view=None):
        return request.user.is_authenticated and request.user.user_role in {Professor.Roles.PROFESSOR, Professor.Roles.DECAN}
