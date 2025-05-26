"""
Vistas de la aplicacion defense_acts
"""
from core.views import BaseModelViewSet
from core.management.utils.permissions import IsProfessor
from .models import DefenseAct
from .serializers import DefenseActFullSerializer, DefenseActListSerializer


class DefenseActViewSet(BaseModelViewSet):
    """
    ViewSet para el modelo DefenseAct, hereda de BaseModelViewSet.
    """
    queryset = DefenseAct.objects.all()
    serializer_class = DefenseActFullSerializer
    list_serializer_class = DefenseActListSerializer
    permission_classes = [IsProfessor]
