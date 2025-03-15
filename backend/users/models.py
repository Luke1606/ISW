from django.db import models
from django.contrib.auth.models import User


class CustomUser(User):
    pic = models.ImageField(upload_to='images/')


class Student(CustomUser):
    class Faculties(models.TextChoices):
        NINGUNO = 'Ninguno', 'Ninguno'
        FTI = 'FTI', 'Facultad de Tecnologías Interactivas'
        FTE = 'FTE', 'Facultad de Tecnologías Educativas'
        CITEC = 'CITEC', 'Facultad de Ciencias y Tecnologías Computacionales'
        FTL = 'FTL', 'Facultad de Tecnologías Libres'
        DFP = 'DFP', 'Facultad de Ciberseguridad'
        FIO = 'FIO', 'Facultad de Información Organizacional'

    faculty = models.CharField(max_length=50, choices=Faculties.choices, default=Faculties.NINGUNO)
    group = models.IntegerField()

    def get_searchable_fields(self, cls):
        """
        Devuelve una lista de campos que son de tipo CharField o TextField.
        """
        return [field for field in cls._meta.get_fields() if isinstance(field, (models.CharField, models.TextField))]


class Professor(CustomUser):
    class Roles(models.TextChoices):
        NINGUNO = 'Ninguno', 'Ninguno'
        DPTO_INF = 'Dpto Inf', 'Departamento de Informática'
        DECANO = 'Decano', 'Decano'
    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.NINGUNO)

    def get_searchable_fields(self, cls):
        """
        Devuelve una lista de campos que son de tipo CharField o TextField.
        """
        return [field for field in cls._meta.get_fields() if isinstance(field, (models.CharField, models.TextField))]
