from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework import serializers
from core.serializers import BaseListSerializer
from .models import CustomUser, Student, Professor


class TokenPairSerializer(TokenObtainPairSerializer):
    """
    Esta clase se utiliza para obtener un pair de tokens (access y refresh) para el usuario,
    ademas de devolver la informacion necesaria del usuario al frontend.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['id'] = str(user.id)
        token['name'] = user.name
        token['pic'] = user.pic.url if user.pic else None
        token['role'] = user.user_role

        return token


class TokenRenewSerializer(TokenRefreshSerializer):
    """
    Esta clase se utiliza para obtener un token de refresh para el usuario.
    """
    @classmethod
    def get_token(cls, user):
        return super().get_token(user)


class UserListSerializer(BaseListSerializer):
    """
    Serializer base para compartir características comunes entre StudentSerializer y ProfessorSerializer.
    """

    class Meta:
        model = CustomUser
        fields = BaseListSerializer.Meta.fields

    def get_name(self, obj):
        """
        Devuelve el nombre del usuario.
        """
        return f"{obj.user.name}"


class CustomUserSerializer(serializers.ModelSerializer):
    """
    Serializer base para compartir características comunes entre StudentSerializer y ProfessorSerializer.
    """
    class Meta:
        model = CustomUser
        fields = 'id', 'name', 'pic', 'username', 'user_role'


class StudentSerializer(serializers.ModelSerializer):
    """
    Serializer para estudiantes.
    """
    user = CustomUserSerializer()

    class Meta:
        model = Student
        fields = ['user', 'faculty', 'group']


class ProfessorSerializer(serializers.ModelSerializer):
    """
    Serializer para profesores.
    """
    user = CustomUserSerializer()

    class Meta:
        model = Professor
        fields = ['user', 'role']
