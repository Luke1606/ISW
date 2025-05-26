'''
Models de la aplicacion users
'''
import secrets
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from core.models import BaseModel
from core.models import BaseModelManager
from core.management.utils.constants import Datatypes


class CustomUserManager(BaseUserManager, BaseModelManager):
    '''
    Manager único para gestionar la creación de usuarios, estudiantes, profesores y superusuarios.
    '''
    def create_user_by_role(self, role, username=None, password=None, name=None, pic=None, **extra_fields):
        '''
        Crear un usuario con un rol específico (student, professor, decan, etc.) y
        una contraseña especifica o generada automáticamente.
        '''
        if not username:
            raise ValueError('El campo "username" es obligatorio')
        if not name:
            raise ValueError('El campo "name" es obligatorio')
        if role not in Datatypes.User.roles:
            raise ValueError('El rol no es válido')

        password_change = bool(password)
        password = password or secrets.token_urlsafe(15)

        # Crear el usuario base
        user = self.model(
            username=username,
            name=name,
            pic=pic,
            is_staff=(role != Datatypes.User.student),
            is_superuser=role == Datatypes.User.decan,
            password_changed=password_change
        )
        user.set_password(password)
        user.save(using=self._db)

        if role == Datatypes.User.student:
            if not extra_fields.get('group'):
                raise ValueError('El campo "grupo" es obligatorio para estudiantes.')
            if not extra_fields.get('faculty'):
                raise ValueError('El campo "facultad" es obligatorio para estudiantes.')
            specific_user = Student.objects.create(id=user, **extra_fields)
        else:
            specific_user = Professor.objects.create(id=user, role=role)

        return specific_user

    def create_superuser(self, username, password, name, pic, **extra_fields):
        '''
        Crear un superusuario que utiliza la lógica de create_user_by_role.
        '''
        return self.create_user_by_role(
            role=Datatypes.User.decan,
            username=username,
            password=password,
            name=name,
            pic=pic,
            **extra_fields
        )


class CustomUser(BaseModel, AbstractUser):
    '''
    Modelo base para usuarios personalizados.
    '''
    name = models.CharField(max_length=255, blank=False)
    first_name = None
    last_name = None
    email = None
    pic = models.ImageField(upload_to='users/images/', blank=True, null=True)
    password_changed = models.BooleanField(default=False)

    objects = CustomUserManager()

    base_objects = BaseModelManager()

    USERNAME_FIELD = 'username'

    DB_INDEX = 0

    @property
    def is_student(self):
        '''
        Retorna True si el usuario es estudiante.
        '''
        return hasattr(self, 'student_user')

    @property
    def is_professor(self):
        '''
        Retorna True si el usuario es profesor
        '''
        return hasattr(self, 'professor_user')

    @property
    def user_role(self):
        '''
        Obtiene el rol del usuario basado en su tipo (estudiante, profesor, etc.).
        '''
        if self.is_student:
            return 'student'
        if self.is_professor:
            return self.professor_user.role
        return 'unknown'

    def change_password(self, new_password):
        ''' Permite que el usuario cambie su propia contraseña. '''
        self.set_password(new_password)
        self.password_changed = True
        self.save()


class Student(BaseModel):
    '''
    Modelo para estudiantes.
    '''
    id = models.OneToOneField(
                        CustomUser,
                        on_delete=models.CASCADE,
                        related_name='student_user',
                        primary_key=True
        )

    class Faculties(models.TextChoices):
        '''
        Clase para definir las distintas facultades a las que puede pertenecer un estudiante.
        '''
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
        'id__username': 'icontains',
        'id__name': 'icontains',
        'faculty': 'icontains',
        'group': 'int_exact',
    }

    DB_INDEX = 1


class Professor(BaseModel):
    '''
    Modelo para profesores.
    '''
    id = models.OneToOneField(
                        CustomUser,
                        on_delete=models.CASCADE,
                        related_name='professor_user',
                        primary_key=True
        )

    class Roles(models.TextChoices):
        '''
        Clase para definir los roles de un profesor.
        '''
        NONE = 'None', 'Ninguno'
        PROFESSOR = Datatypes.User.professor, 'Profesor'
        DPTO_INF = Datatypes.User.dptoInf, 'Departamento de Informática'
        DECAN = Datatypes.User.decan, 'Decano'

    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.NONE)
    SEARCHABLE_FIELDS = {
        **BaseModel.SEARCHABLE_FIELDS,
        'id__username': 'icontains',
        'id__name': 'icontains',
        'role': 'exact',
    }

    DB_INDEX = 2

    def get_related_students_ids(self):
        '''
        Obtiene los IDs de estudiantes relacionados al profesor (si aplica).
        '''
        if self.role == self.Roles.PROFESSOR:
            from defenses_tribunals.models import DefenseTribunal
            tribunal_queryset = DefenseTribunal.objects.search(
                president=self,
                secretary=self,
                vocal=self,
                opponent=self,
                join_type='OR'
            )

            tribunal_queryset = tribunal_queryset.filter(state=DefenseTribunal.State.APPROVED)
            return list(tribunal_queryset.values_list('student_id', flat=True))
        return []
