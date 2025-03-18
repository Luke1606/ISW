"""
Vistas de la aplicacion defense_acts
"""
from backend.base.base_model_viewset import BaseModelViewSet
from .models import DefenseAct
from .serializers import DefenseActSerializer


class DefenseActViewSet(BaseModelViewSet):
    """
    ViewSet para el modelo DefenseAct, hereda de BaseModelViewSet.
    """
    queryset = DefenseAct.objects.all()
    serializer_class = DefenseActSerializer

    @staticmethod
    def get_model_and_serializer():
        """
        Retorna el modelo y el serializador correspondiente.
        """
        return DefenseAct, DefenseActSerializer
