"""
Modelos de la aplicacion defense_acts.
"""
from django.db import models
from core.models import BaseModel
from users.models import Student, Professor


class DefenseAct(BaseModel):
    """
    Modelo que representa un acto de defensa.
    """
    student = models.ForeignKey(
        to=Student, editable=False,
        blank=False, null=False,
        related_name="defense_acts",
        on_delete=models.CASCADE,
    )
    author = models.ForeignKey(
        to=Professor, editable=False,
        blank=False, null=False,
        related_name="defense_acts",
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    attachment = models.FileField(upload_to="defense_acts/attachments/")

    SEARCHABLE_FIELDS = {
        **BaseModel.SEARCHABLE_FIELDS,
        'student__id__username': 'icontains',
        'student__id__name': 'icontains',
        'student__group': 'int_exact',
        'student__faculty': 'icontains',
        "name": "icontains",
        "description": "icontains",
    }

    DB_INDEX = 6

    def __str__(self) -> str:
        return f"""Acta de defensa:\n
                 \tAutor: {self.author.id.name}\n
                 \tEstudiante asociado: {self.student.id.name}\n
                 \tNombre del acta: {self.name}\n
                 \tDescripción: {self.description}\n
                 \tDirección del adjunto: {self.attachment}\n
                 \t{super().__str__()}"""
