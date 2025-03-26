"""
Models de la aplicacion users
"""
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from core.base.base_model import BaseModel
from core.base.base_manager import BaseModelManager
from core.utils.constants import DataTypes


class CustomUserManager(BaseUserManager, BaseModelManager):
    """
    Manager único para gestionar la creación de usuarios, estudiantes, profesores y superusuarios.
    """
    def create_user_by_role(self, role, username, password=None, first_name=None, last_name=None, **extra_fields):
        """
        Crear un usuario con un rol específico (student, professor, decan, etc.).
        """
        if not username:
            raise ValueError("El campo 'username' es obligatorio")
        if role not in DataTypes.User.roles:
            raise ValueError("El rol no es válido")

        # Crear el usuario base
        user = self.model(
            username=username,
            first_name=first_name,
            last_name=last_name,
            is_staff=(role != DataTypes.User.student),
            is_superuser=role == DataTypes.User.decan,
        )
        user.set_password(password)
        user.save(using=self._db)

        if role == DataTypes.User.student:
            if not extra_fields.get('group'):
                raise ValueError("El campo 'grupo' es obligatorio para estudiantes.")
            if not extra_fields.get('faculty'):
                raise ValueError("El campo 'facultad' es obligatorio para estudiantes.")
            return Student.objects.create(user=user, **extra_fields)
        return Professor.objects.create(user=user, role=role)

    def create_superuser(self, username, password=None, first_name=None, last_name=None, **extra_fields):
        """
        Crear un superusuario que utiliza la lógica de create_user_by_role.
        """
        return self.create_user_by_role(
            role=DataTypes.User.decan,
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
            **extra_fields
        )


class CustomUser(BaseModel, AbstractUser):
    """
    Modelo base para usuarios personalizados.
    """
    email = None
    pic = models.ImageField(upload_to='users/images/', blank=True, null=True)

    objects = CustomUserManager()

    base_objects = BaseModelManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    SEARCHABLE_FIELDS = {
        **BaseModel.SEARCHABLE_FIELDS,
        'username': 'icontains',
        'first_name': 'icontains',
        'last_name': 'icontains',
    }

    @property
    def is_student(self):
        """
        Retorna True si el usuario es estudiante.
        """
        return hasattr(self, 'student')

    @property
    def is_professor(self):
        """
        Retorna True si el usuario es profesor
        """
        return hasattr(self, 'professor')

    @property
    def user_role(self):
        """
        Obtiene el rol del usuario basado en su tipo (estudiante, profesor, etc.).
        """
        if self.is_student:
            return 'student'
        if self.is_professor:
            return self.professor.role
        return 'unknown'


class Student(BaseModel):
    """
    Modelo para estudiantes.
    """
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='student')

    class Faculties(models.TextChoices):
        """
        Clase para definir las distintas facultades a las que puede pertenecer un estudiante.
        """
        NONE = 'None', 'Ninguno'
        FTI = 'FTI', 'Facultad de Tecnologías Interactivas'
        FTE = 'FTE', 'Facultad de Tecnologías Educativas'
        CITEC = 'CITEC', 'Facultad de Ciencias y Tecnologías Computacionales'
        FTL = 'FTL', 'Facultad de Tecnologías Libres'
        FCS = 'FCS', 'Facultad de Ciberseguridad'
        FIO = 'FIO', 'Facultad de Información Organizacional'

    faculty = models.CharField(max_length=50, choices=Faculties.choices, default=Faculties.NONE)
    group = models.PositiveIntegerField()
    SEARCHABLE_FIELDS = {
        **BaseModel.SEARCHABLE_FIELDS,
        'faculty': 'icontains',
        'group': 'exact',
    }


class Professor(BaseModel):
    """
    Modelo para profesores.
    """
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='professor')

    class Roles(models.TextChoices):
        """
        Clase para definir los roles de un profesor.
        """
        NONE = 'None', 'Ninguno'
        PROFESSOR = DataTypes.User.professor, 'Profesor'
        DPTO_INF = DataTypes.User.dptoInf, 'Departamento de Informática'
        DECANO = DataTypes.User.decan, 'Decano'

    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.NONE)
    SEARCHABLE_FIELDS = {
        **BaseModel.SEARCHABLE_FIELDS,
        'role': 'exact',
    }

    def get_related_students_ids(self):
        """
        Obtiene los IDs de estudiantes relacionados al profesor (si aplica).
        """
        if self.role == self.Roles.PROFESSOR:
            from defenses_tribunals.models import DefenseTribunal
            tribunal_queryset = DefenseTribunal.objects.search(
                president=self.id,
                secretary=self.id,
                vocal=self.id,
                oponent=self.id,
                join_type="OR"
            )
            return list(tribunal_queryset.values_list("student_id", flat=True))
        return []
