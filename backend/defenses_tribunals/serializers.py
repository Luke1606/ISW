from rest_framework import serializers
from users.models import Student
from .models import DefenseTribunal


class DefenseTribunalSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())

    class Meta:
        model = DefenseTribunal
        fields = "__all__"
