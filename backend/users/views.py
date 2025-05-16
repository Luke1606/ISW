'''
Vistas de la aplicacion users
'''
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView

from core.views import BaseModelViewSet
from core.management.utils.permissions import IsDecano, IsProfessor
from core.management.utils.constants import Datatypes
from .serializers import CustomUserSerializer, StudentSerializer, ProfessorSerializer, UserListSerializer
from .models import Student, Professor, CustomUser


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


class UserAPIView(APIView):
    '''
    Vista para manejar la información del usuario autenticado.
    '''
    def get_permissions(self):
        """
        Asigna permisos según el método de la petición.
        - `GET` requiere autenticación (`IsAuthenticated`).
        - `POST` permite acceso sin autenticación (`AllowAny`).
        """
        if self.request.method == 'GET':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get(self, request):
        """ Método para obtener la información del usuario autenticado. """
        user = request.user
        user_data = CustomUserSerializer(user).data
        return Response(user_data)

    def post(self, request):
        """Permite al usuario cambiar su contraseña solo si aún usa la generada por el sistema."""
        username = request.data.get('username')
        new_password = request.data.get('password')

        if not username or not new_password:
            return Response({'error': 'Debe proporcionar username y nueva contraseña'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(username=username)

            if user.password_changed:
                return Response(
                    {'error': 'Este usuario ya cambió su contraseña, operación que solo se permite una vez'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user.change_password(new_password)

            return Response({'message': 'Contraseña actualizada correctamente'}, status=status.HTTP_200_OK)

        except CustomUser.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)


class StudentViewSet(BaseModelViewSet):
    '''
    Vista para gestionar estudiantes:
    - Listar estudiantes accesible por cualquier profesor autenticado.
    - CRUD completo accesible solo para Decanos.
    '''
    queryset = Student.objects.select_related('id').all()
    serializer_class = StudentSerializer
    list_serializer_class = UserListSerializer
    permission_classes_by_action = {
        'list': [permissions.IsAuthenticated, IsProfessor],
        'create': [permissions.IsAuthenticated, IsDecano],
        'update': [permissions.IsAuthenticated, IsDecano],
        'destroy': [permissions.IsAuthenticated, IsDecano],
        'retrieve': [permissions.IsAuthenticated, IsProfessor],
    }

    def get_permissions(self):
        '''
        Asigna permisos según la acción.
        '''
        return [
            permission()
            for permission in self.permission_classes_by_action.get(self.action, self.permission_classes)
        ]

    def create(self, request, *args, **kwargs):
        '''
        Personaliza la creación para usar create_user_by_role.
        '''
        data = request.data
        user_manager = CustomUser.objects
        try:
            # Crear usuario con el rol de estudiante
            student = user_manager.create_user_by_role(
                role=Datatypes.User.student,
                name=data.get('name'),
                username=data.get('username'),
                pic=data.get('pic'),
                group=data.get('group'),
                faculty=data.get('faculty')
            )

            serializer = StudentSerializer(student)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ProfessorViewSet(BaseModelViewSet):
    '''
    Vista para gestionar profesores, accesible únicamente para Decanos.
    '''
    queryset = Professor.objects.select_related('id').all()
    serializer_class = ProfessorSerializer
    list_serializer_class = UserListSerializer
    permission_classes = [permissions.IsAuthenticated, IsDecano]
