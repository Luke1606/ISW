from rest_framework import serializers
from .models import DefenseAct


class DefenseActSerializer(serializers.ModelSerializer):
    class Meta:
        model = DefenseAct
        fields = "__all__"
