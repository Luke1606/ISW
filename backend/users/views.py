'''
Vistas de la aplicacion users
'''
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView

from core.views import BaseModelViewSet
from core.management.utils.permissions import IsDecano, IsProfessor
from .serializers import CustomUserSerializer, StudentSerializer, ProfessorSerializer, UserListSerializer
from .models import Student, Professor


class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        refresh_token = response.data.get('refresh')

        # Configurar cookie segura
        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite='Lax',
            expires='',  # Sin fecha de expiración → Se elimina al cerrar el navegador
            max_age=None  # Sin fecha de expiración → Se elimina al cerrar el navegador
        )

        # Devolver solo el access token en el body
        response.data.pop('refresh', None)  # No enviamos refresh en JSON
        return response


class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')  # Obtener token desde cookies

        if not refresh_token:
            return Response({'error': 'No valid refresh token found. Please log in again.'}, status=401)

        request.data['refresh'] = refresh_token

        response = super().post(request, *args, **kwargs)

        # Configurar la cookie para el nuevo refresh token
        if 'refresh' in response.data:
            new_refresh_token = response.data.get('refresh')
            response.set_cookie(
                key='refresh_token',
                value=new_refresh_token,
                httponly=True,
                secure=True,
                samesite='Lax',
            )
            response.data.pop('refresh')  # No enviar el refresh token en JSON
        return response


class CookieTokenBlacklistView(TokenBlacklistView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')

        request.data['refresh'] = refresh_token

        response = super().post(request, *args, **kwargs)

        # Borrar cookie del refresh token
        if 'refresh_token' in request.COOKIES:
            response.delete_cookie('refresh_token')
        else:
            return Response({'error': 'No active session found'}, status=400)

        return Response({'message': 'Logged out successfully'}, status=200)


class UserInfoView(APIView):
    '''
    Vista para obtener la información del usuario autenticado.
    '''
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = CustomUserSerializer(user).data
        return Response(user_data)


class StudentViewSet(BaseModelViewSet):
    '''
    Vista para gestionar estudiantes:
    - Listar estudiantes accesible por cualquier profesor autenticado.
    - CRUD completo accesible solo para Decanos.
    '''
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
        '''
        Asigna permisos según la acción.
        '''
        return [
            permission()
            for permission in self.permission_classes_by_action.get(self.action, self.permission_classes)
        ]


class ProfessorViewSet(BaseModelViewSet):
    '''
    Vista para gestionar profesores, accesible únicamente para Decanos.
    '''
    queryset = Professor.objects.select_related('user').all()
    serializer_class = ProfessorSerializer
    list_serializer_class = UserListSerializer
    permission_classes = [permissions.IsAuthenticated, IsDecano]
