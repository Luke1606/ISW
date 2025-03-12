from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import Student, Professor


class AuthTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['id'] = user.id
        token['username'] = user.username
        token['name'] = user.name
        token['pic'] = user.pic

        return token


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"


class ProfessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professor
        fields = "__all__"
