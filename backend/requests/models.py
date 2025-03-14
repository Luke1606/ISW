from django.db import models
from users.models import Student


class Request(models.Model):
    id = models.AutoField(primary_key=True,
                          editable=False,
                          unique=True,
                          blank=False,
                          null=False,
                          auto_created=True,
                          verbose_name="ID")

    student = models.ForeignKey(to=Student,
                                editable=False,
                                blank=False,
                                null=False,
                                related_name='requests',
                                on_delete=models.CASCADE)

    class ECE(models.TextChoices):
        TD = 'Tesis', 'Trabajo de diploma'
        PF = 'Port', 'Portafolio'
        AA = 'Art Cient', 'Defensa de Artículos Científicos'
        EX = 'Ex', 'Exhimición'
    selected_ece = models.CharField(max_length=20, choices=ECE.choices, default=ECE.TD)

    class State(models.TextChoices):
        A = 'Apr', 'Aprobada'
        D = 'Dis', 'Desaprobada'
        P = 'Pend', 'Pendiente'
    state = models.CharField(max_length=20, choices=State.choices, default=State.P)


class Template(models.Model):
    id = models.AutoField(primary_key=True,
                          editable=False,
                          unique=True,
                          blank=False,
                          null=False,
                          auto_created=True,
                          verbose_name="ID")

    template_attachment = models.FileField(upload_to='document_templates/')
