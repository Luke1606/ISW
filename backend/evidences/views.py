"""
Vistas de la aplicacion evidences
"""
from backend.base.base_model_viewset import BaseModelViewSet
from .models import Evidence
from .serializers import EvidenceSerializer


class EvidenceViewSet(BaseModelViewSet):
    """
    ViewSet para el modelo Evidences, hereda de BaseModelViewSet.
    """
    queryset = Evidence.objects.all()
    serializer_class = EvidenceSerializer

    @staticmethod
    def get_model_and_serializer():
        """
        Retorna el modelo y el serializador correspondiente.
        """
        return Evidence, EvidenceSerializer
