"""
Modelos de la aplicacion solicitudes.
"""
from django.db import models
from django.core.exceptions import ValidationError
from core.models import BaseModel
from core.management.utils.constants import Datatypes
from users.models import Student, Professor
from notifications.views import send_notification


class Request(BaseModel):
    """
    Modelo que representa una solicitud realizada por un estudiante.
    El estado se establece automáticamente como "Pendiente" al crear.
    Solo el estado puede ser modificado posteriormente.
    """
    student = models.ForeignKey(
        to=Student,
        editable=False,
        blank=False,
        null=False,
        related_name='request',
        on_delete=models.CASCADE,
        verbose_name="Student",
    )

    class ECE(models.TextChoices):
        """
        Tipos de ECE seleccionables para la solicitud.
        """
        TD = 'TD', 'Trabajo de diploma'
        PF = 'PF', 'Portafolio'
        AA = 'AA', 'Defensa de Artículos Científicos'
        EX = 'EX', 'Exhimición'

    selected_ece = models.CharField(
        max_length=20,
        choices=ECE.choices,
        default=ECE.TD,
        verbose_name="Selected ECE"
    )

    class State(models.TextChoices):
        """
        Estados posibles para la solicitud.
        """
        APPROVED = 'A', 'Aprobada'
        DISAPPROVED = 'D', 'Desaprobada'
        PENDING = 'P', 'Pendiente'

    state = models.CharField(
        max_length=20,
        choices=State.choices,
        default=State.PENDING,
        verbose_name="State"
    )

    SEARCHABLE_FIELDS = {
        **BaseModel.SEARCHABLE_FIELDS,
        "student__user__username": "icontains",
        "student__user__name": "icontains",
        "selected_ece": "exact",
        "state": "exact",
    }

    DB_INDEX = 4

    def save(self, *args, **kwargs):
        """
        Sobrescribe el método save para que:
        - El estado por defecto siempre sea "Pendiente" al crear.
        - Se impida modificar cualquier campo excepto el estado.
        """
        if self.pk and Request.objects.filter(pk=self.pk).exists():  # La solicitud ya existe, es una actualización
            original = Request.objects.get(pk=self.pk)

            if (self.student != original.student or self.selected_ece != original.selected_ece or self.created_at != original.created_at):
                raise ValidationError("No está permitido modificar los datos de la solicitud, excepto el estado.")

            notification_message = f"""Su solicitud ha sido revisada y el veredicto fue {self.get_state_display()}."""

            send_notification(
                notification_title='Su solicitud ha sido revisada',
                notification_message=notification_message,
                users=[self.student.id]
            )
        else:
            self.state = self.State.PENDING  # Al crear, forzar el estado a "Pendiente"

            # Notificar a los miembros del departamento de informatica
            dpto_inf_professors = Professor.objects.search(role=Datatypes.User.dptoInf)
            dpto_inf_professor_users = [dpto_inf.id for dpto_inf in dpto_inf_professors]

            ece = self.get_selected_ece_display()
            notification_message = f"""El estudiante {self.student.id.name} envió una solicitud de ECE para optar por la categoría {ece}."""

            send_notification(
                notification_title='Envío de solicitud',
                notification_message=notification_message,
                users=dpto_inf_professor_users
            )

        super().save(*args, **kwargs)

    def clean(self):
        """
        Validaciones personalizadas adicionales.
        """
        if not self.selected_ece:
            raise ValidationError("Debe seleccionarse un tipo de ECE.")
        if not self.state:
            raise ValidationError("El estado de la solicitud no puede estar vacío.")

    def __str__(self) -> str:
        return f"""Solicitud de ECE:
                        ECE seleccionado: {str(self.get_selected_ece_display())}
                        Estado actual: {self.get_state_display()}
                        {super().__str__()}
                """
