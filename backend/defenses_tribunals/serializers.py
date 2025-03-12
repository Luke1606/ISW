from rest_framework import serializers
from .models import DefenseTribunal


class DefenseTribunalSerializer(serializers.ModelSerializer):
    class Meta:
        model = DefenseTribunal
        fields = "__all__"