from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework import serializers
from .models import Student, Professor


class TokenPairSerializer(TokenObtainPairSerializer):
    """
    Esta clase se utiliza para obtener un pair de tokens (access y refresh) para el usuario,
    ademas de devolver la informacion necesaria del usuario al frontend.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['id'] = str(user.id)
        token['username'] = user.username
        token['name'] = f'{user.first_name} {user.last_name}'
        token['pic'] = user.pic.url if user.pic else None
        token['role'] = user.user_role

        return token


class TokenRefreshSerializer(TokenRefreshSerializer):
    """
    Esta clase se utiliza para obtener un token de refresh para el usuario.
    """
    @classmethod
    def get_token(cls, user):
        return super().get_token(user)


class BaseUserSerializer(serializers.ModelSerializer):
    """
    Serializer base para compartir características comunes entre StudentSerializer y ProfessorSerializer.
    """
    id = serializers.UUIDField(required=True)
    name = serializers.SerializerMethodField()
    pic = serializers.ImageField(source='user.pic', required=False)

    def get_name(self, obj):
        """
        Combina first_name y last_name del usuario.
        """
        return f"{obj.user.first_name} {obj.user.last_name}"

    class Meta:
        fields = ['id', 'name', 'pic']


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
