"""
Modelos de la aplicacion defense_acts.
"""
from django.db import models
from core.base.base_model import BaseModel
from users.models import Student


class DefenseAct(BaseModel):
    """
    Modelo que representa un acto de defensa.
    """
    student = models.ForeignKey(
        to=Student, editable=False, blank=False, null=False,
        related_name="defense_acts", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    attachment = models.FileField(upload_to="defense_acts/attachments/")

    SEARCHABLE_FIELDS = {
        **BaseModel.SEARCHABLE_FIELDS,
        "name": "icontains",
        "student__username": "icontains",
        "description": "icontains",
    }
