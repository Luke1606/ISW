"""
Vistas de la aplicacion users
"""
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import permissions
from core.views import BaseModelViewSet
from core.management.utils.permissions import IsDecano, IsProfessor
from .serializers import TokenPairSerializer, TokenRenewSerializer, StudentSerializer, ProfessorSerializer, UserListSerializer
from .models import Student, Professor


class AuthTokenObtainPairView(TokenObtainPairView):
    """
    Vista para manejar la lógica de autenticación basada en tokens JWT.
    """
    serializer_class = TokenPairSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ['post']


class TokenObtainRefreshView(TokenRefreshView):
    """
    Vista para manejar la lógica de obtencion de un token de refresh JWT.
    """
    serializer_class = TokenRenewSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ['post']


class StudentViewSet(BaseModelViewSet):
    """
    Vista para gestionar estudiantes:
    - Listar estudiantes accesible por cualquier profesor autenticado.
    - CRUD completo accesible solo para Decanos.
    """
    queryset = Student.objects.select_related('user').all()
    serializer_class = StudentSerializer
    list_serializer_class = UserListSerializer
    permission_classes_by_action = {
        'list': [permissions.IsAuthenticated, IsProfessor],
        'create': [permissions.IsAuthenticated, IsDecano],
        'update': [permissions.IsAuthenticated, IsDecano],
        'destroy': [permissions.IsAuthenticated, IsDecano],
    }

    def get_permissions(self):
        """
        Asigna permisos según la acción.
        """
        return [
            permission()
            for permission in self.permission_classes_by_action.get(self.action, self.permission_classes)
        ]


class ProfessorViewSet(BaseModelViewSet):
    """
    Vista para gestionar profesores, accesible únicamente para Decanos.
    """
    queryset = Professor.objects.select_related('user').all()
    serializer_class = ProfessorSerializer
    list_serializer_class = UserListSerializer
    permission_classes = [permissions.IsAuthenticated, IsDecano]
