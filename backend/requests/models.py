"""
Modelos de la aplicacion solicitudes.
"""
from django.db import models
from django.core.exceptions import ValidationError
from users.models import Student
from core.models import BaseModel


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
        related_name='requests',
        on_delete=models.CASCADE,
        verbose_name="Student"
    )

    class ECE(models.TextChoices):
        """
        Tipos de ECE seleccionables para la solicitud.
        """
        TD = 'Tesis', 'Trabajo de diploma'
        PF = 'Portafolio', 'Portafolio'
        AA = 'Art Cient', 'Defensa de Artículos Científicos'
        EX = 'Exhimición', 'Exhimición'

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
        A = 'Approved', 'Aprobada'
        D = 'Disapproved', 'Desaprobada'
        P = 'Pending', 'Pendiente'

    state = models.CharField(
        max_length=20,
        choices=State.choices,
        default=State.P,
        verbose_name="State"
    )

    SEARCHABLE_FIELDS = {
        **BaseModel.SEARCHABLE_FIELDS,
        "student__username": "icontains",
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
        if self.pk:  # La solicitud ya existe, es una actualización
            original = Request.objects.get(pk=self.pk)

            if (self.student != original.student or self.selected_ece != original.selected_ece or self.created_at != original.created_at):
                raise ValidationError("No está permitido modificar los datos de la solicitud, excepto el estado.")
        else:
            # Al crear, forzar el estado a "Pendiente"
            self.state = self.State.P

        super().save(*args, **kwargs)

    def clean(self):
        """
        Validaciones personalizadas adicionales.
        """
        if not self.selected_ece:
            raise ValidationError("Debe seleccionarse un tipo de ECE.")
        if not self.state:
            raise ValidationError("El estado de la solicitud no puede estar vacío.")


# class Template(models.Model):
#     id = models.AutoField(primary_key=True,
#                           editable=False,
#                           unique=True,
#                           blank=False,
#                           null=False,
#                           auto_created=True,
#                           verbose_name="ID")

#     template_attachment = models.FileField(upload_to='document_templates/')
