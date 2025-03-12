from rest_frameworks import viewsets
from .models import DefenseTribunal
from .serializers import DefenseTribunalSerializer


class DefenseTribunalViewSet(viewsets.ModelViewSet):
    queryset = DefenseTribunal.objects.all()
    serializer_class = DefenseTribunalSerializer
