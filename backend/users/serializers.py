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
        Combina first_name y last_name del usuario.
        """
        return f"{obj.user.name}"


class BaseUserSerializer(UserListSerializer):
    """
    Serializer base para compartir características comunes entre StudentSerializer y ProfessorSerializer.
    """
    id = serializers.UUIDField(required=True)
    name = serializers.SerializerMethodField()
    pic = serializers.ImageField(source='user.pic', required=False)

    class Meta:
        fields = UserListSerializer.Meta.fields + ['pic']


class StudentSerializer(BaseUserSerializer):
    """
    Serializer para estudiantes que hereda de BaseUserSerializer.
    """
    class Meta(BaseUserSerializer.Meta):
        model = Student
        fields = BaseUserSerializer.Meta.fields + ['faculty', 'group']


class ProfessorSerializer(BaseUserSerializer):
    """
    Serializer para profesores que hereda de BaseUserSerializer.
    """
    class Meta(BaseUserSerializer.Meta):
        model = Professor
        fields = BaseUserSerializer.Meta.fields + ['role']
