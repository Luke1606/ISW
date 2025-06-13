from rest_framework import serializers
from users.models import Student
from .models import Request


class RequestSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())

    class Meta:
        model = Request
        fields = "__all__"
