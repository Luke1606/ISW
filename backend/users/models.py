from django.db import models
from django.contrib.auth.models import User


class CustomUser(User):
    pic = models.BinaryField()


class Student(CustomUser):
    group = models.IntegerField()


class Professor(CustomUser):
    class Type(models.TextChoices):
        NINGUNO = 'Ninguno', 'Ninguno'
        DPTO_INF = 'Dpto Inf', 'Departamento de Informática'
        DECANO = 'Decano', 'Decano'
    type = models.CharField(max_length=20, choices=Type.choices, default=Type.NINGUNO)
