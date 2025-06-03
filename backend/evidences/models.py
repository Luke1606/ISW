"""
Modelos de la aplicacion de evidencias.
"""
from django.db import models
from django.core.exceptions import ValidationError
from core.models import BaseModel
from users.models import Student


class Evidence(BaseModel):
    """
    Modelo base para representar una evidencia.
    """
    student = models.ForeignKey(
        to=Student,
        editable=False,
        blank=False,
        null=False,
        related_name='evidence',
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=255, db_index=True, verbose_name="Name")
    description = models.TextField(blank=True, null=True, db_index=True, verbose_name="Description")

    class Type(models.TextChoices):
        """
        Tipos de adjunto.
        """
        URL = 'url', 'URL'
        FILE = 'file', 'Archivo',

    attachment_type = models.CharField(max_length=20, choices=Type.choices, null=False, blank=False)
    attachment_file = models.FileField(upload_to='evidences/attachments/', blank=True, null=True)
    attachment_url = models.URLField(blank=True, null=True)

    SEARCHABLE_FIELDS = {
        **BaseModel.SEARCHABLE_FIELDS,
        'student__id__username': 'icontains',
        'student__id__name': 'icontains',
        'student__group': 'int_exact',
        'student__faculty': 'icontains',
        'name': 'icontains',
        'description': 'icontains',
    }

    DB_INDEX = 3

    def clean(self):
        """
        Validación personalizada para asegurar que los campos de adjunto sean consistentes.
        """
        if self.attachment_type == self.Type.URL and not self.attachment_url:
            raise ValidationError('URL field must be provided when attachment type is URL.')
        if self.attachment_type == self.Type.FILE and not self.attachment_file:
            raise ValidationError('File field must be provided when attachment type is FILE.')
        if self.attachment_type == self.Type.URL and self.attachment_file:
            raise ValidationError('File field must be empty when attachment type is URL.')
        if self.attachment_type == self.Type.FILE and self.attachment_url:
            raise ValidationError('URL field must be empty when attachment type is FILE.')

    def __str__(self) -> str:
        return f"""Evidencia:
                        Nombre: {str(self.name)}
                        Descripción: {self.description}
                        Tipo de adjunto: {self.get_attachment_type_display()}
                        Dirección de adjunto: {self.attachment_url
                                               if self.attachment_type == self.Type.URL
                                               else self.attachment_file}
                        {super().__str__()}
                """
