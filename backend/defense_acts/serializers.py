from rest_framework import serializers
from core.serializers import BaseListSerializer
from .models import DefenseAct


class DefenseActListSerializer(BaseListSerializer):
    """
    Serializador con campos limitados especificamente solo para listas.
    """
    class Meta:
        model = DefenseAct
        fields = BaseListSerializer.Meta.fields

    def get_name(self, obj):
        return f"{obj.name}"


class DefenseActFullSerializer(serializers.ModelSerializer):
    """
    Serializador de todos los datos de un acta de defensa.
    """
    class Meta:
        model = DefenseAct
        fields = "__all__"
