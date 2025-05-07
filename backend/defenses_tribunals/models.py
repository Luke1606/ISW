"""
Modelos de la aplicacion defenses_tribunals.
"""
from django.db import models
from django.core.exceptions import ValidationError
from core.models import BaseModel
from core.management.utils.constants import Datatypes
from users.models import Student, Professor
from notifications.views import send_notification


class DefenseTribunal(BaseModel):
    """
    Modelo para representar un tribunal de defensa.
    """
    student = models.OneToOneField(
        to=Student,
        editable=False,
        unique=True,
        blank=False,
        null=False,
        related_name='defense_tribunal',
        on_delete=models.CASCADE
    )
    defense_date = models.DateField(blank=True, null=True)

    president = models.ForeignKey(
        to=Professor,
        blank=True,
        null=True,
        related_name='defense_tribunal_president',
        on_delete=models.SET_NULL
    )
    secretary = models.ForeignKey(
        to=Professor,
        blank=True,
        null=True,
        related_name='defense_tribunal_secretary',
        on_delete=models.SET_NULL
    )
    vocal = models.ForeignKey(
        to=Professor,
        blank=True,
        null=True,
        related_name='defense_tribunal_vocal',
        on_delete=models.SET_NULL
    )
    oponent = models.ForeignKey(
        to=Professor,
        blank=True,
        null=True,
        related_name='defense_tribunal_oponent',
        on_delete=models.SET_NULL
    )
    tutor = models.ForeignKey(
        to=Professor,
        blank=True,
        null=True,
        related_name='defense_tribunal_tutor',
        on_delete=models.SET_NULL
    )

    class State(models.TextChoices):
        """Estados del tribunal de defensa."""
        APPROVED = 'Apr', 'Aprobado'
        DISAPPROVED = 'Dis', 'Desaprobado'
        PENDING = 'Pend', 'Pendiente'
        INCOMPLETE = 'Inc', 'Incompleto'

    state = models.CharField(
        max_length=20,
        choices=State.choices,
        default=State.INCOMPLETE
    )

    SEARCHABLE_FIELDS = {
        **BaseModel.SEARCHABLE_FIELDS,
        'student__username': 'icontains',
        'president__username': 'icontains',
        'secretary__username': 'icontains',
        'vocal__username': 'icontains',
        'oponent__username': 'icontains',
        'tutor__username': 'icontains',
        'defense_date': 'date_range',
        'state': 'icontains',
    }

    DB_INDEX = 5

    def save(self, *args, **kwargs):
        """
        Verifica y ajusta automáticamente el estado en función de los campos definidos.
        Envia notificaciones si se cumplen ciertas condiciones.
        """
        # Determinar si los campos están completos
        is_complete = all(field is not None for field in [self.president, self.secretary, self.vocal, self.oponent, self.tutor])
        previous_state = None if not self.pk else DefenseTribunal.objects.get(pk=self.pk).state

        if is_complete and self.state == self.State.INCOMPLETE:
            self.state = self.State.PENDING
            super().save(*args, **kwargs)

            # Enviar notificación a decanos
            decans = Professor.objects.search(role=Datatypes.User.decan)
            # pylint: disable=no-member
            notification_message = f"""El tribunal del estudiante {self.student.user.first_name}
                ya está listo para ser revisado."""
            notification_url = f"form/{Datatypes.tribunal}/{self.id}"
            send_notification(notification_message, notification_url, decans)

        # Si el decano cambia el estado (APROBADO o DESAPROBADO), notificar al Dpto Inf
        if previous_state != self.state and self.state in [self.State.APPROVED, self.State.DISAPPROVED]:
            dpto_inf_professors = Professor.objects.search(role=Datatypes.User.dptoInf)
            # pylint: disable=no-member
            notification_message = f"""El tribunal del estudiante {self.student.user.first_name}
                cambió su estado a {self.state}."""
            notification_url = f"form/{Datatypes.tribunal}/{self.id}"
            send_notification(notification_message, notification_url, dpto_inf_professors)

        super().save(*args, **kwargs)

    def clean(self):
        """
        Validaciones adicionales para integridad del modelo.
        """
        if self.state == self.State.APPROVED and self.pk:
            raise ValidationError("No se puede modificar un tribunal aprobado, salvo para volverlo a pendiente.")
        super().clean()
