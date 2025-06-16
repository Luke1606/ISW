"""
Modelos de la aplicacion defense_acts.
"""
from django.db import models
from core.models import BaseModel
from users.models import Student, Professor
from core.management.utils.constants import Datatypes
from notifications.views import send_notification


class DefenseAct(BaseModel):
    """
    Modelo que representa un acto de defensa.
    """
    student = models.ForeignKey(
        to=Student, editable=False,
        blank=False, null=False,
        related_name="defense_act",
        on_delete=models.CASCADE,
    )
    author = models.ForeignKey(
        to=Professor, editable=False,
        blank=False, null=False,
        related_name="defense_act",
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=255, blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    attachment = models.FileField(upload_to="defense_acts/attachments/", blank=False, null=False)

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

    def save(self, *args, **kwarg):
        if not self.pk:
            student = Student.objects.get(id=self.student)
            author = Professor.objects.get(id=self.author)

            if not student:
                raise ValueError("El estudiante no existe.")
            if not author:
                raise ValueError("El autor no existe.")

            notification_message = f"El tribunal del estudiante {student.id.name} ha registrado una nueva acta de defensa."

            dpto_inf_professors = Professor.objects.search(role=Datatypes.User.dptoInf)
            dpto_inf_professor_users = [dpto_inf.id for dpto_inf in dpto_inf_professors]

            send_notification(
                notification_title='Nueva acta de defensa registrada',
                notification_message=notification_message,
                users=dpto_inf_professor_users
            )
        return super().save(*args, **kwarg)

    def __str__(self) -> str:
        return f"""Acta de defensa:
                        Autor: {self.author.id.name}
                        Estudiante asociado: {self.student.id.name}
                        Nombre del acta: {self.name}
                        Descripción: {self.description}
                        Dirección del adjunto: {self.attachment}
                        {super().__str__()}
                """
