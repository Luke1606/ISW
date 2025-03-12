from rest_framework import viewsets
from .models import Evidence
from .serializers import EvidenceSerializer

class EvidenceViewSet(viewsets.ModelViewSet):
    queryset = Evidence.objects.all()
    serializer_class = EvidenceSerializer
