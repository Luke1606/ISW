from django.db import models
from django.contrib.auth.models import User


class CustomUser(User):
    pic = models.ImageField()


class Student(CustomUser):
    class Faculties(models.TextChoices):
        NINGUNO = 'Ninguno', 'Ninguno'
        FTI = 'FTI', 'Facultad de Tecnologías Interactivas'
        FTE = 'FTE', 'Facultad de Tecnologías Educativas'
        CITEC = 'CITEC', 'Facultad de Ciencias y Tecnologías Computacionales'
        FTL = 'Decano', 'Facultad de Tecnologías Libres'
        DFP = 'Decano', 'Facultad de Ciberseguridad'
        FIO = 'Decano', 'Facultad de Información Organizacional'

    faculty = models.CharField(max_length=50, choices=Faculties.choices, default=Faculties.NINGUNO)
    group = models.IntegerField()


class Professor(CustomUser):
    class Roles(models.TextChoices):
        NINGUNO = 'Ninguno', 'Ninguno'
        DPTO_INF = 'Dpto Inf', 'Departamento de Informática'
        DECANO = 'Decano', 'Decano'
    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.NINGUNO)
