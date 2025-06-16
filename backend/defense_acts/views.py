"""
Vistas de la aplicacion defense_acts
"""
from core.views import BaseModelViewSet
from core.management.utils.permissions import IsRegularProfessor, IsProfessor
from .models import DefenseAct
from .serializers import DefenseActFullSerializer, DefenseActListSerializer


class DefenseActViewSet(BaseModelViewSet):
    """
    ViewSet para el modelo DefenseAct, hereda de BaseModelViewSet.
    """
    queryset = DefenseAct.objects.all()
    serializer_class = DefenseActFullSerializer
    list_serializer_class = DefenseActListSerializer
    permission_classes_by_action = {
        'list': [IsProfessor],
        'create': [IsRegularProfessor],
        'update': [IsRegularProfessor],
        'destroy': [IsRegularProfessor],
        'retrieve': [IsProfessor],
    }

    def get_permissions(self):
        '''
        Asigna permisos según la acción.
        '''
        permissions_list = self.permission_classes_by_action.get(self.action, [])
        return [permission() for permission in permissions_list]
