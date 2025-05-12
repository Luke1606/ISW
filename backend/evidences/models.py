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
        related_name='evidences',
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=255, db_index=True, verbose_name="Name")
    description = models.TextField(blank=True, null=True, db_index=True, verbose_name="Description")

    class Type(models.TextChoices):
        """
        Tipos de adjunto.
        """
        URL = 'url'
        FILE = 'file',

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
        print(self.attachment_type, self.attachment_file, self.attachment_url)
        if self.attachment_type == self.Type.URL and not self.attachment_url:
            raise ValidationError('URL field must be provided when attachment type is URL.')
        if self.attachment_type == self.Type.FILE and not self.attachment_file:
            raise ValidationError('File field must be provided when attachment type is FILE.')
        if self.attachment_type == self.Type.URL and self.attachment_file:
            raise ValidationError('File field must be empty when attachment type is URL.')
        if self.attachment_type == self.Type.FILE and self.attachment_url:
            raise ValidationError('URL field must be empty when attachment type is FILE.')











# class Roles(models.Model):
#     """
#     Representa cada rol a desempeñar en un proyecto.
#     """
#     class RoleValues(models.TextChoices):
#         """
#         Opciones de roles a desempeñar en un proyecto.
#         """
#         NONE = 'None', 'Ninguno'
#         ANALYST = 'Analista', 'Analyst'
#         PROGRAMMER = 'Programador', 'Programmer'
#         BD_DESIGNER = 'Diseñador de Bases de Datos', 'Database Designer'
#         TEST_DESIGNER = 'Diseñador de Pruebas', 'Test Designer'
#         BUSSINESS_PROCESS_ANALYST = 'Analista de Procesos de Negocio', 'Business Process Analyst'
#         QUALITY_ADMIN = 'Analista de Calidad', 'Quality Analyst'
#         BD_ADMIN = 'Administrador de Bases de Datos', 'Database Administrator'
#         CONFIG_ADMIN = 'Administrador de Configuraciones', 'Configuration Administrator'
#         HARD_SOFT_TECH_SUPPORT = 'Soporte Técnico de Hardware y Software', 'Hardware and Software Technical Support'
#         INFORMATIC_SECURITY_SPECIALIST = 'Especialista en Seguridad Informática', 'Information Security Specialist'
#         NET_ADMIN = 'Administrador de Redes', 'Network Administrator'
#         SOFT_ARQUITECT = 'Arquitecto de Software', 'Software Architect'
#         PROYECT_LEADER = 'Jefe de Proyecto', 'Project Leader'
#     role = models.CharField(primary_key=True, editable=False, choices=RoleValues.choices, default=RoleValues.NONE)


# class Project(Evidence):
#     """
#     Modelo que representa una evidencia de tipo proyecto.
#     """
#     roles = models.ManyToManyField(
#         to=Roles,
#         related_name="projects",
#         blank=True,
#         verbose_name="Roles"
#     )

#     SEARCHABLE_FIELDS = {
#         **Evidence.SEARCHABLE_FIELDS,
#         "roles__name": "icontains",
#     }


# class MainScienceField(models.Model):
#     """
#     Campos principales de la ciencia que puede abarcar el tema del articulo.
#     """
#     class MainScienceFieldValues(models.TextChoices):
#         """
#         Opciones de campos principales de la ciencia que puede abarcar el tema del articulo.
#         """
#         NONE = 'None', 'Ninguno'
#         SOFT_ENGINEERING_PROGRAMMING = 'Ingeniería de software y Programación', 'Software Engineering and Programming'
#         ORGANIZATIONAL_INTEL = 'Inteligencia organizacional', 'Organizational Intelligence'
#         INFORMATION_TECHS = 'Tecnologías de la información', 'Information Technologies'

#     field = models.CharField(
#         primary_key=True,
#         editable=False,
#         choices=MainScienceFieldValues.choices,
#         default=MainScienceFieldValues.NONE)


# class FullScienceField(models.Model):
#     """
#     Campos específicos de la ciencia que puede abarcar el tema del artículo.
#     """
#     class SubScienceFieldValues(models.TextChoices):
#         """
#         Opciones de campos secundarios de la ciencia que puede abarcar el tema del articulo.
#         Son relacionados con los campos principales.
#         """
#         NONE = 'None', 'Ninguno'
#         # Ingeniería de software y Programación
#         REPRESENTATION_PROCCESSING = '''Representación y procesamiento de la información y del conocimiento:
#                                         modelación, estructura de datos, bases de datos, bases de conocimientos,
#                                         procesos algorítmicos o heurísticos, programación, técnicas de inteligencia
#                                         artificial''', '''Representation and Information and Knowledge Processing: Modeling,
#                                         Data Structure, Databases, Knowledge Bases, Algorithmic or Heuristic Processes,
#                                         Programming, Artificial Intelligence Techniques'''
#         SOFT_DEV_METHODOLOGIES = 'Metodologías de desarrollo de software', 'Software Development Methodologies'
#         SOFT_DEV_MODELS = 'Modelos de desarrollo de software', 'Software Development Models'
#         INFORMATION_PROYECTS_MANAGEMENT = 'Gestión de proyectos informáticos', 'Information Technology Project Management'
#         PROCESS_REENGINEERING = '''Reingeniería de procesos para la gestión de la información y el conocimiento y
#                                 de investigación científica''', '''Process Reengineering for Information and Knowledge
#                                 Management and Scientific Research'''
#         DB_DESIGN_ADMIN = 'Diseño y/o administración de base de datos', 'Database Design and/or Administration'
#         TEST_DESIGN = 'Diseño de pruebas', 'Test Design'
#         CONFIG_ADMIN = 'Administración de la configuración', 'Configuration Administration'
#         QUALITY_ADMIN = 'Administración de la Calidad', 'Quality Administration'

#         # Inteligencia organizacional
#         SYSTEMS_THEORY = 'Teoría de Sistemas', 'Systems Theory'
#         INFO_THEORY = 'Teoría de la Información', 'Information Theory'
#         BUSSINESS_INTEL = '''Inteligencia de negocios, proceso de desarrollo orientado a servicios,
#                                 análisis y gestión de procesos de negocios, arquitectura empresarial''', '''Business Intelligence,
#                                 Service-Oriented Development Process, Business Process Analysis and Management, Enterprise Architecture'''

#         # Tecnologías de la información
#         NETWORK_COMPUTER_ARQUITECTURE = '''Arquitectura de computadoras y redes, periféricos, interfaz de comunicación
#                                             hombremáquina, teleinformática y sistemas de operación.''', '''Computer architecture
#                                             and networks, peripherals, human-machine communication interface, teleinformatics, and
#                                             operating systems.'''
#         INFORMATIC_SECURITY_ETHICS = 'Seguridad y ética informática', 'Informatic security and ethics'
#         NETWORK_ADMIN = 'Administración de redes', 'Network Administration'
#         TECH_SUPPORT = 'Soporte técnico de Software y Hardware', 'Hardware and Software Technical Support'

#     main_field = models.ForeignKey(to=MainScienceField, on_delete=models.CASCADE)
#     field = models.CharField(
#             primary_key=True,
#             editable=False,
#             choices=SubScienceFieldValues.choices,
#             default=SubScienceFieldValues.NONE)


# class ScientificArticle(Evidence):
#     """
#     Modelo que representa un artículo científico.
#     """
#     science_field = models.ManyToManyField(to=FullScienceField)

#     SEARCHABLE_FIELDS = {
#         **Evidence.SEARCHABLE_FIELDS,
#         "science_field__field": "icontains",
#         "science_field__main_field__field": "icontains",
#     }


# class Distinctions(Evidence):
#     """
#     Modelo que representa distinciones o reconocimientos.
#     """
#     SEARCHABLE_FIELDS = {
#         **Evidence.SEARCHABLE_FIELDS,
#     }
