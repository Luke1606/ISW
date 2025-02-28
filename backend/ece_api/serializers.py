from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from . import models


class LoginTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['id'] = user.id
        token['username'] = user.username
        token['name'] = user.name
        token['email'] = user.email
        token[''] = user.pic

        return token


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Notification
        fields = '__all__'


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Student
        fields = "__all__"


class ProfessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Professor
        fields = "__all__"


class EvidenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Evidence
        fields = "__all__"


class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Request
        fields = "__all__"


class DefenseTribunalSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.DefenseTribunal
        fields = "__all__"


class DefenseActSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.DefenseAct
        fields = "__all__"
