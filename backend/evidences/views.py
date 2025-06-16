"""
Vistas de la aplicacion evidences
"""
from core.views import BaseModelViewSet
from rest_framework.permissions import IsAuthenticated
from core.management.utils.permissions import IsStudent
from .models import Evidence
from .serializers import EvidenceFullSerializer, EvidenceListSerializer


class EvidenceViewSet(BaseModelViewSet):
    """
    ViewSet para el modelo Evidences, hereda de BaseModelViewSet.
    """
    queryset = Evidence.objects.all()
    serializer_class = EvidenceFullSerializer
    list_serializer_class = EvidenceListSerializer

    permission_classes_by_action = {
        'create': [IsStudent],
        'update': [IsStudent],
        'retrieve': [IsAuthenticated],
        'destroy': [IsStudent],
        'list': [IsAuthenticated],
    }

    def get_permissions(self):
        """
        Asigna permisos dinámicos según la acción.
        """
        permissions_list = self.permission_classes_by_action.get(self.action, [])
        return [permission() for permission in permissions_list]
