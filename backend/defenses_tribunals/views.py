from rest_framework import viewsets
from .models import DefenseTribunal
from .serializers import DefenseTribunalSerializer


class DefenseTribunalViewSet(viewsets.ModelViewSet):
    queryset = DefenseTribunal.objects.all()
    serializer_class = DefenseTribunalSerializer

    @staticmethod
    def get_model_and_serializer():
        return DefenseTribunal, DefenseTribunalSerializer

    @staticmethod
    def get_model():
        return DefenseTribunal
