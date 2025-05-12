"""
Vistas de la aplicacion evidences
"""
from core.views import BaseModelViewSet
from .models import Evidence
from .serializers import EvidenceFullSerializer, EvidenceListSerializer


class EvidenceViewSet(BaseModelViewSet):
    """
    ViewSet para el modelo Evidences, hereda de BaseModelViewSet.
    """
    queryset = Evidence.objects.all()
    serializer_class = EvidenceFullSerializer
    list_serializer_class = EvidenceListSerializer