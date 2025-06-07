"""
Modelos de la aplicacion defenses_tribunals.
"""
from django.db import models
from core.models import BaseModel
from core.management.utils.constants import Datatypes
from users.models import Student, Professor
from requests.models import Request
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
        on_delete=models.CASCADE,
    )
    defense_date = models.DateField(blank=True, null=True)
    selected_ece = models.CharField(
        max_length=20,
        choices=Request.ECE.choices,
        default=Request.ECE.TD,
        verbose_name="Selected ECE"
    )

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
    opponent = models.ForeignKey(
        to=Professor,
        blank=True,
        null=True,
        related_name='defense_tribunal_opponent',
        on_delete=models.SET_NULL
    )

    tutors = models.ManyToManyField(
        Professor,
        blank=True,
        related_name='defense_tribunal_tutors'
    )

    class State(models.TextChoices):
        """Estados del tribunal de defensa."""
        APPROVED = 'A', 'Aprobado'
        DISAPPROVED = 'D', 'Desaprobado'
        PENDING = 'P', 'Pendiente'
        INCOMPLETE = 'I', 'Incompleto'

    state = models.CharField(
        max_length=20,
        choices=State.choices,
        default=State.INCOMPLETE
    )

    SEARCHABLE_FIELDS = {
        **BaseModel.SEARCHABLE_FIELDS,
        'student__id__username': 'icontains',
        'president__id__username': 'icontains',
        'secretary__id__username': 'icontains',
        'vocal__id__username': 'icontains',
        'opponent__id__username': 'icontains',
        'tutors__id__username': 'icontains',
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
        is_complete = all(field is not None for field in [
            self.president, self.secretary, self.vocal, self.opponent, self.defense_date
            ]) and self.tutors.exists()

        if not self.pk:
            previous_state = None
        else:
            try:
                previous_state = DefenseTribunal.objects.get(pk=self.pk).state
            except DefenseTribunal.DoesNotExist:
                previous_state = None

        if is_complete and (self.state == self.State.INCOMPLETE or self.state == self.State.DISAPPROVED):
            self.state = self.State.PENDING
            super().save(*args, **kwargs)

            # Enviar notificación a decanos
            decans = Professor.objects.search(role=Datatypes.User.decan)
            decan_users = [decan.id for decan in decans]

            notification_message = f"""El tribunal del estudiante {self.student.id.name} ya está listo para ser revisado."""

            send_notification(
                notification_title='Tribunal configurado',
                notification_message=notification_message,
                users=decan_users
            )

        if not is_complete and self.state == self.State.PENDING:
            self.state = self.State.INCOMPLETE
            super().save(*args, **kwargs)

        # Si el decano cambia el estado (APROBADO o DESAPROBADO), notificar al Dpto Inf
        if previous_state != self.state and self.state in [self.State.APPROVED, self.State.DISAPPROVED]:
            dpto_inf_professors = Professor.objects.search(role=Datatypes.User.dptoInf)
            dpto_inf_professor_users = [dpto_inf.id for dpto_inf in dpto_inf_professors]

            notification_message = f"""El tribunal del estudiante {self.student.id.name} fue declarado {self.get_state_display()}."""

            send_notification(
                notification_title='Cambio de estado de tribunal',
                notification_message=notification_message,
                users=dpto_inf_professor_users
            )

            if self.state == self.State.APPROVED:
                notification_message = "Los datos de su tribunal y de su defensa han sido decididos, recuerde consultarlos."

            send_notification(
                notification_title='Tribunal y defensa definidos',
                notification_message=notification_message,
                users=self.student.id
            )

        super().save(*args, **kwargs)

    def __str__(self) -> str:
        # Verificar si cada atributo existe antes de acceder a sus propiedades
        president_name = self.president.id.name if self.president else "Sin presidente"
        secretary_name = self.secretary.id.name if self.secretary else "Sin secretario"
        vocal_name = self.vocal.id.name if self.vocal else "Sin vocal"
        opponent_name = self.opponent.id.name if self.opponent else "Sin oponente"
        defense_date_str = str(self.defense_date) if self.defense_date else "Fecha no definida"
        state_str = self.get_state_display() if self.get_state_display() else "Estado no definido"

        # Obtener nombres de tutores con verificación
        tutors_names = "\n\t".join(tutor.id.name for tutor in self.tutors.all()) if self.tutors.exists() else "No asignados"

        return f"""Presidente: {president_name}
                   Secretario: {secretary_name}
                   Vocal: {vocal_name}
                   Oponente: {opponent_name}
                   Fecha de defensa: {defense_date_str}
                   Estado actual: {state_str}
                   Tutores: {tutors_names}
                   {super().__str__()}
                """
