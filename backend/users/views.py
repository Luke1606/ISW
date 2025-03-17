"""
Vistas de la aplicacion users
"""
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import permissions

from backend.base.base_model_viewset import BaseModelViewSet
from .serializers import AuthTokenObtainPairSerializer, StudentSerializer, ProfessorSerializer
from .permissions import IsDecano
from .models import Student, Professor


class AuthTokenObtainPairView(TokenObtainPairView):
    """
    Vista para manejar la lógica de autenticación basada en tokens JWT.
    """
    serializer_class = AuthTokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ['post']


class StudentViewSet(BaseModelViewSet):
    """
    Vista para gestionar estudiantes:
    - Listar estudiantes accesible por cualquier profesor autenticado.
    - CRUD completo accesible solo para Decanos.
    """
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    permission_classes_by_action = {
        'list': [permissions.IsAuthenticated],
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

    @staticmethod
    def get_model_and_serializer():
        return Student, StudentSerializer


class ProfessorViewSet(BaseModelViewSet):
    """
    Vista para gestionar profesores, accesible únicamente para Decanos.
    """
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer
    permission_classes = [permissions.IsAuthenticated, IsDecano]

    @staticmethod
    def get_model_and_serializer():
        return Professor, ProfessorSerializer
