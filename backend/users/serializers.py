from rest_framework import serializers
from core.serializers import BaseListSerializer
from .models import CustomUser, Student, Professor


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
