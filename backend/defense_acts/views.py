"""
Vistas de la aplicacion defense_acts
"""
from django.shortcuts import get_object_or_404
from core.views import BaseModelViewSet
from core.management.utils.permissions import IsProfessor
from core.management.utils.constants import Datatypes
from notifications.views import send_notification
from users.models import Student, Professor
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

    def create(self, request, *args, **kwargs):
        student = get_object_or_404(Student, id_id=request.data.get('student'))
        notification_message = f"""El tribunal del estudiante {student.id.name} ha registrado una nueva acta de defensa."""

        dpto_inf_professors = Professor.objects.search(role=Datatypes.User.dptoInf)
        dpto_inf_professor_users = [dpto_inf.id for dpto_inf in dpto_inf_professors]

        send_notification(
            notification_title='Nueva acta de defensa registrada',
            notification_message=notification_message,
            users=dpto_inf_professor_users
        )
        return super().create(request, *args, **kwargs)
