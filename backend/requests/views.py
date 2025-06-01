"""
Vistas de la aplicacion solicitudes.
"""
from django.shortcuts import get_object_or_404
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from defenses_tribunals.models import DefenseTribunal
from core.views import BaseModelViewSet
from core.management.utils.permissions import IsDptoInfProfessor, IsStudent
from users.models import Student
from .serializers import RequestSerializer
from .models import Request


class RequestViewSet(BaseModelViewSet):
    """
    Vista asociada a las solicitudes.
    """
    queryset = Request.objects.all()
    serializer_class = RequestSerializer

    permission_classes_by_action = {
        'create': [IsStudent],
        'update': [IsDptoInfProfessor],
        'retrieve': [permissions.IsAuthenticated],
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
        student = get_object_or_404(Student, id=user)
        last_request = student.requests.order_by('-created_at').first()

        # Restringir creación si una solicitud previa está pendiente o aprobada
        if last_request and last_request.state in {Request.State.PENDING, Request.State.APPROVED}:
            raise ValidationError(
                "No puedes registrar otra solicitud mientras una previa esté en estado Pendiente o si está Aprobada."
            )

        # Crear la solicitud con estado "Pendiente"
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(student=student, state=Request.State.PENDING)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Permite a profesores del departamento de informática cambiar el estado de solicitudes.
        Genera automáticamente un tribunal si la solicitud es aprobada.
        """
        instance = self.get_object()
        if instance.state != Request.State.PENDING:
            return Response(
                'No puede darle un veredicto a una solicitud que ya lo tiene.',
                status=status.HTTP_400_BAD_REQUEST,
            )
        if 'state' not in request.data:
            raise ValidationError("Solo se permite modificar el estado de la solicitud.")

        # Validar y actualizar el estado
        new_state = request.data['state']

        if new_state == Request.State.APPROVED:
            # Validar que no exista ya un tribunal asociado
            if DefenseTribunal.objects.filter(student=instance.student).exists():
                raise ValidationError("Ya existe un tribunal asociado a este estudiante.")

            # Crear tribunal automáticamente
            DefenseTribunal.objects.create(student=instance.student, selected_ece=instance.selected_ece)

        # Actualizar el estado de la solicitud
        return super().update(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        """ Devuelve la última solicitud del estudiante proporcionado en la URL """
        student_id = kwargs.get('pk')  # Extrae el ID del estudiante desde la URL

        # Busca el estudiante
        student = get_object_or_404(Student, id=student_id)

        # Encuentra la última solicitud asociada al estudiante
        last_request = student.requests.order_by('-created_at').first()

        if not last_request:
            return Response("No se encontró ninguna solicitud para este estudiante.", status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(last_request)
        return Response(serializer.data, status=status.HTTP_200_OK)
