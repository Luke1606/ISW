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

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


class TokenRefreshSerializer(TokenRefreshSerializer):
    """
    Esta clase se utiliza para obtener un token de refresh para el usuario.
    """

    @classmethod
    def get_token(cls, user):
        return super().get_token(user)

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


class StudentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    pic = serializers.ImageField(source='user.pic', required=False)

    class Meta:
        model = Student
        fields = ['username', 'pic', 'faculty', 'group']


class ProfessorSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    pic = serializers.ImageField(source='user.pic', required=False)

    class Meta:
        model = Professor
        fields = ['username', 'pic', 'role']
