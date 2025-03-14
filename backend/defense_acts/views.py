from rest_framework import viewsets
from .models import DefenseAct
from .serializers import DefenseActSerializer


class DefenseActViewSet(viewsets.ModelViewSet):
    queryset = DefenseAct.objects.all()
    serializer_class = DefenseActSerializer

    @staticmethod
    def get_model_and_serializer():
        return DefenseAct, DefenseActSerializer
