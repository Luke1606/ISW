"""
Vistas de la aplicacion solicitudes.
"""
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from defenses_tribunals.models import DefenseTribunal
from backend.base.base_model_viewset import BaseModelViewSet
from backend.utils.permissions import IsDptoInfProfessor, IsStudent, ReadOnlyForOthers
from .serializers import RequestSerializer
from .models import Request


class RequestViewSet(BaseModelViewSet):
    """
    Vista asociada a las solicitudes. Integración con BaseModelViewSet y funcionalidad personalizada.
    """
    queryset = Request.objects.all()
    serializer_class = RequestSerializer

    permission_classes_by_action = {
        'create': [IsStudent],
        'partial_update': [IsDptoInfProfessor],
        'retrieve': [ReadOnlyForOthers | IsDptoInfProfessor],
        'update': [],
        'destroy': [],
        'list': [],
    }

    def get_permissions(self):
        """
        Asigna permisos dinámicos según la acción.
        """
        return [
            permission()
            for permission in self.permission_classes_by_action.get(self.action, self.permission_classes)
        ]

    def create(self, request, *args, **kwargs):
        """
        Permite a los estudiantes crear solicitudes. Verifica restricciones antes de la creación.
        """
        user = request.user
        # Obtener la última solicitud del estudiante
        student = user.student
        last_request = Request.objects.filter(student=student).order_by('-created_at').first()

        # Restringir creación si una solicitud previa está pendiente o aprobada
        if last_request and last_request.state in {Request.State.P, Request.State.A}:
            raise ValidationError(
                "No puedes registrar otra solicitud mientras una previa esté en estado Pendiente o si está Aprobada."
            )

        # Crear la solicitud con estado "Pendiente"
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(student=student, state=Request.State.P)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        """
        Permite a profesores del departamento de informática cambiar el estado de solicitudes.
        Genera automáticamente un tribunal si la solicitud es aprobada.
        """
        instance = self.get_object()
        if 'state' not in request.data:
            raise ValidationError("Solo se permite modificar el estado de la solicitud.")

        # Validar y actualizar el estado
        new_state = request.data['state']

        if new_state == Request.State.A:
            # Validar que no exista ya un tribunal asociado
            if DefenseTribunal.objects.filter(student=instance.student).exists():
                raise ValidationError("Ya existe un tribunal asociado a este estudiante.")

            # Crear tribunal automáticamente
            DefenseTribunal.objects.create(student=instance.student)

        # Actualizar el estado de la solicitud
        return super().update(request, *args, **kwargs)

    @staticmethod
    def get_model_and_serializer():
        """
        Devuelve el modelo y serializador correspondiente.
        """
        return Request, RequestSerializer
