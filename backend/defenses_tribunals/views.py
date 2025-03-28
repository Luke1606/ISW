from rest_framework.exceptions import ValidationError, PermissionDenied
from core.views import BaseModelViewSet
from core.management.utils.permissions import IsDptoInfProfessor, IsDecano, IsStudent
from .models import DefenseTribunal
from .serializers import DefenseTribunalSerializer


class DefenseTribunalViewSet(BaseModelViewSet):
    """
    ViewSet para el modelo DefenseTribunal con restricciones personalizadas:
    - No se puede listar todos los tribunales.
    - Solo permite acceder a tribunales asociados a un estudiante específico.
    """
    queryset = DefenseTribunal.objects.all()
    serializer_class = DefenseTribunalSerializer

    permission_classes_by_action = {
        'retrieve': [IsStudent | IsDptoInfProfessor | IsDecano],  # Ver un tribunal
        'update': [IsDptoInfProfessor | IsDecano],  # Decano cambia estado; Dpto Inf edita integrantes
        'create': [],
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

    def retrieve(self, request, *args, **kwargs):
        """
        Acceso controlado al tribunal:
        - Decanos y Departamento de Informática pueden acceder a cualquier tribunal.
        - Profesores solo pueden acceder a tribunales en los que estén involucrados.
        - Estudiantes solo pueden acceder a su propio tribunal.
        """
        tribunal = self.get_object()
        user = request.user
        non_permission = "No tienes permiso para acceder a este tribunal."

        if user.is_student:
            # Restringir a estudiantes su propio tribunal
            if tribunal.student != user.student:
                raise PermissionDenied(non_permission)

        elif user.is_professor:
            if user.professor.role in {user.professor.Roles.DECANO, user.professor.Roles.DPTO_INF}:
                # Decanos y Dpto Inf tienen acceso completo
                pass
            elif user.professor.role == user.professor.Roles.PROFESSOR:
                # Profesores solo tienen acceso a tribunales relacionados
                related_students_ids = user.professor.get_related_students_ids()
                if tribunal.student.id not in related_students_ids:
                    raise PermissionDenied(non_permission)
            else:
                raise PermissionDenied(non_permission)

        else:
            raise PermissionDenied(non_permission)

        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """
        Permite al Decano cambiar el estado del tribunal.
        Permite al Departamento de Informática editar los integrantes.
        """
        tribunal = self.get_object()

        if 'state' in request.data:
            self._validate_state_change(request, tribunal)

        if any(key in request.data for key in ['president', 'secretary', 'vocal', 'oponent', 'tutor']):
            self._validate_integrantes_change(request)

        if 'student' in request.data:
            raise ValidationError("No se puede cambiar el estudiante relacionado.")

        return super().partial_update(request, *args, **kwargs)

    def _validate_state_change(self, request, tribunal):
        """
        Valida que los cambios en el estado del tribunal sean realizados correctamente.
        """
        new_state = request.data['state']
        if new_state in {DefenseTribunal.State.APPROVED, DefenseTribunal.State.DISAPPROVED}:
            if not request.user.professor or request.user.professor.role != request.user.professor.Roles.DECANO:
                raise ValidationError("Solo el decano puede cambiar el estado a aprobado o desaprobado.")
        if tribunal.state == DefenseTribunal.State.APPROVED and new_state != DefenseTribunal.State.PENDING:
            raise ValidationError("Un tribunal aprobado solo puede volver a pendiente para ser modificado.")

    def _validate_integrantes_change(self, request):
        """
        Valida que solo el Departamento de Informática pueda cambiar los integrantes.
        """
        if not request.user.professor or request.user.professor.role != request.user.professor.Roles.DPTO_INF:
            raise ValidationError("Solo el Departamento de Informática puede cambiar los integrantes.")
