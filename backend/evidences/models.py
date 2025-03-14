from django.db import models
from django.core.exceptions import ValidationError
from users.models import Student


class Evidence(models.Model):
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
                                related_name='evidences',
                                on_delete=models.CASCADE)

    name = models.CharField(max_length=255, db_index=True, verbose_name="Name")

    description = models.TextField(blank=True, null=True, db_index=True, verbose_name="Description")

    class Type(models.TextChoices):
        URL = 'URL'
        FILE = 'Archivo', 'File'

    attachment_type = models.CharField(max_length=20, choices=Type.choices, default=Type.URL)
    attachment_file = models.FileField(upload_to='attachments/', blank=True, null=True)
    attachment_url = models.URLField(blank=True, null=True)

    def clean(self):
        # Asegúrate de que solo uno de los campos esté lleno
        if self.attachment_type == self.Type.URL and not self.attachment_url:
            raise ValidationError('URL field must be provided when attachment type is URL.')
        if self.attachment_type == self.Type.FILE and not self.attachment_file:
            raise ValidationError('File field must be provided when attachment type is FILE.')
        if self.attachment_type == self.Type.URL and self.attachment_file:
            raise ValidationError('File field must be empty when attachment type is URL.')
        if self.attachment_type == self.Type.FILE and self.attachment_url:
            raise ValidationError('URL field must be empty when attachment type is FILE.')

    def get_searchable_fields(self, cls):
        """
        Devuelve una lista de campos que son de tipo CharField o TextField.
        """
        return [field for field in cls._meta.get_fields() if isinstance(field, (models.CharField, models.TextField))]


class Proyect(Evidence):
    class Roles(models.TextChoices):
        NINGUNO = 'Ninguno'
        ANALYST = 'Analista', 'Analyst'
        PROGRAMMER = 'Programador', 'Programmer'
        BD_DESIGNER = 'Diseñador de Bases de Datos', 'Database Designer'
        TEST_DESIGNER = 'Diseñador de Pruebas', 'Test Designer'
        BUSSINESS_PROCESS_ANALYST = 'Analista de Procesos de Negocio', 'Business Process Analyst'
        QUALITY_ADMIN = 'Analista de Calidad', 'Quality Analyst'
        BD_ADMIN = 'Administrador de Bases de Datos', 'Database Administrator'
        CONFIG_ADMIN = 'Administrador de Configuraciones', 'Configuration Administrator'
        HARD_SOFT_TECH_SUPPORT = 'Soporte Técnico de Hardware y Software', 'Hardware and Software Technical Support'
        INFORMATIC_SECURITY_SPECIALIST = 'Especialista en Seguridad Informática', 'Information Security Specialist'
        NET_ADMIN = 'Administrador de Redes', 'Network Administrator'
        SOFT_ARQUITECT = 'Arquitecto de Software', 'Software Architect'
        PROYECT_LEADER = 'Jefe de Proyecto', 'Project Leader'

    roles = models.ManyToManyField(to=Roles, default=Roles.NINGUNO)


class ScientificArticle(Evidence):
    class ScienceFields(models.TextChoices):
        NINGUNO = 'Ninguno'
        SOFT_ENGINEERING_PROGRAMMING = 'Ingeniería de software y Programación', 'Software Engineering and Programming'
        ORGANIZATIONAL_INTEL = 'Inteligencia organizacional', 'Organizational Intelligence'
        INFORMATION_TECHS = 'Tecnologías de la información', 'Information Technologies'

    class SubScienceFields(models.TextChoices):
        NINGUNO = 'Ninguno'
        # Ingeniería de software y Programación
        REPRESENTACION_PROCESAMIENTO = '''Representación y procesamiento de la información y del conocimiento:
                                        modelación, estructura de datos, bases de datos, bases de conocimientos,
                                        procesos algorítmicos o heurísticos, programación, técnicas de inteligencia
                                        artificial''', '''Representation and Information and Knowledge Processing: Modeling,
                                        Data Structure, Databases, Knowledge Bases, Algorithmic or Heuristic Processes,
                                        Programming, Artificial Intelligence Techniques'''
        SOFT_DEV_METHODOLOGIES = 'Metodologías de desarrollo de software', 'Software Development Methodologies'
        SOFT_DEV_MODELS = 'Modelos de desarrollo de software', 'Software Development Models'
        INFORMATION_PROYECTS_MANAGEMENT = 'Gestión de proyectos informáticos', 'Information Technology Project Management'
        PROCESS_REENGINEERING = '''Reingeniería de procesos para la gestión de la información y el conocimiento y
                                de investigación científica''', '''Process Reengineering for Information and Knowledge
                                Management and Scientific Research'''
        DB_DESIGN_ADMIN = 'Diseño y/o administración de base de datos', 'Database Design and/or Administration'
        TEST_DESIGN = 'Diseño de pruebas', 'Test Design'
        CONFIG_ADMIN = 'Administración de la configuración', 'Configuration Administration'
        QUALITY_ADMIN = 'Administración de la Calidad', 'Quality Administration'

        # Inteligencia organizacional
        SYSTEMS_THEORY = 'Teoría de Sistemas', 'Systems Theory'
        INFO_THEORY = 'Teoría de la Información', 'Information Theory'
        BUSSINESS_INTEL = '''Inteligencia de negocios, proceso de desarrollo orientado a servicios,
                                análisis y gestión de procesos de negocios, arquitectura empresarial''', '''Business Intelligence,
                                Service-Oriented Development Process, Business Process Analysis and Management, Enterprise Architecture'''

        # Tecnologías de la información
        NETWORK_COMPUTER_ARQUITECTURE = '''Arquitectura de computadoras y redes, periféricos, interfaz de comunicación
                                            hombremáquina, teleinformática y sistemas de operación.''', '''Computer architecture
                                            and networks, peripherals, human-machine communication interface, teleinformatics, and
                                            operating systems.'''
        INFORMATIC_SECURITY_ETHICS = 'Seguridad y ética informática', 'Informatic security and ethics'
        NETWORK_ADMIN = 'Administración de redes', 'Network Administration'
        TECH_SUPPORT = 'Soporte técnico de Software y Hardware', 'Hardware and Software Technical Support'

    science_fields = models.ManyToManyField(to=ScienceFields, default=ScienceFields.NINGUNO)
    sub_science_fields = models.ManyToManyField(to=SubScienceFields, default=SubScienceFields.NINGUNO)


class Distinctions(Evidence):
    pass
