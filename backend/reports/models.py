from django.db import models
from django.contrib.postgres.fields import ArrayField
from core.management.utils.constants import Datatypes
from core.models import BaseModel
from users.models import CustomUser


class Report(BaseModel):
    """
    Modelo para almacenar la información del reporte generado desde la vista.
    Campos:
      - author: Usuario que genera el reporte.
      - user_type: Tipo de usuario que se reporta (por ejemplo, 'student' o 'professor').
      - users: Lista de identificadores (IDs) de los usuarios involucrados.
      - users_info: Lista de categorías de información (por ejemplo, 'request', 'evidence', etc.)
    """
    author = models.ForeignKey(
        to=CustomUser,
        editable=False,
        blank=False,
        null=False,
        related_name="reports",
        on_delete=models.CASCADE
    )

    class UserType(models.TextChoices):
        """
        Tipos de usuarios a reportar.
        """
        STUDENT = Datatypes.User.student, 'Estudiantes'
        PROFESSOR = Datatypes.User.professor, 'Profesores'

    user_type = models.CharField(
        max_length=50,
        choices=UserType,
        default=UserType.STUDENT,
        help_text="Tipo de usuario reportado (ej: student o professor)"
    )

    users = models.ManyToManyField(
        CustomUser,
        blank=False,
        related_name='reported'
    )

    class DataType(models.TextChoices):
        """
        Tipos de datos reportar.
        """
        EVIDENCE = Datatypes.evidence, 'Evidencias'
        REQUEST = Datatypes.request, 'Solicitudes'
        DEFENSE_TRIBUNAL = Datatypes.defense_tribunal, 'Tribunal y defensa'
        DEFENSE_ACT = Datatypes.defense_act, 'Actas de defensa'

    users_info = ArrayField(
        base_field=models.CharField(max_length=10),
        blank=True,
        choices=DataType,
        help_text="Lista de categorías reportadas"
    )

    def __str__(self):
        return f"""Reporte de {self.author}
                   {super().__str__()}"""
