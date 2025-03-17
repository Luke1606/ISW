from django.contrib.contenttypes.models import ContentType
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import CustomUser, Student, Professor


class AuthTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Esta clase se utiliza para obtener un pair de tokens (access y refresh) para el usuario,
    ademas de devolver la informacion necesaria del usuario al frontend.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['id'] = user.id
        token['username'] = user.username
        token['name'] = f'{user.first_name} {user.last_name}'
        token['pic'] = user.pic.url if user.pic else None

        # if hasattr(user, 'student'):
        #     token['role'] = 'student'
        # elif hasattr(user, 'professor'):
        #     token['role'] = user.professor.role
        # else:
        #     token['role'] = 'unknown'

        if ContentType.objects.get_for_model(user) == ContentType.objects.get_for_model(Student):
            token['role'] = 'student'
        elif ContentType.objects.get_for_model(user) == ContentType.objects.get_for_model(Professor):
            token['role'] = user.role
        else:
            token['role'] = 'unknown'

        return token

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'pic']


class StudentSerializer(CustomUserSerializer):
    class Meta(CustomUserSerializer.Meta):
        model = Student
        fields = CustomUserSerializer.Meta.fields + ['faculty', 'group']


class ProfessorSerializer(CustomUserSerializer):
    class Meta(CustomUserSerializer.Meta):
        model = Professor
        fields = CustomUserSerializer.Meta.fields + ['role']
