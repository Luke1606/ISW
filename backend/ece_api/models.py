from django.db import models
from django.contrib.auth.models import User


class Student(User):
    group = models.IntegerField()


class Professor(User):
    class Type(models.TextChoices):
        NINGUNO = 'Ninguno', 'Ninguno'
        DPTO_INF = 'Dpto Inf', 'Departamento de Informática'
        DECANO = 'Decano', 'Decano'
    type = models.CharField(max_length=20, choices=Type.choices, default=Type.NINGUNO)


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
        URL = 'URL', 'URL'
        FILE = 'File', 'FileURL'
    type = models.CharField(max_length=20, choices=Type.choices, default=Type.URL)
    attachment = models.URLField()

    def __str__(self):
        return f"{self.name} : {self.description} : {self.attachment}"


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

    def __str__(self):
        return f"{self.student} : {self.selected_ece}"


class DefenseTribunal(models.Model):
    id = models.AutoField(primary_key=True,
                          editable=False,
                          unique=True,
                          blank=False,
                          null=False,
                          auto_created=True,
                          verbose_name="ID")
    student = models.OneToOneField(to=Student,
                                   editable=False,
                                   unique=True,
                                   blank=False,
                                   null=False,
                                   related_name='defense_tribunal',
                                   on_delete=models.CASCADE)
    defense_date = models.DateField(blank=True, null=True,)
    president = models.ForeignKey(to=Professor,
                                  blank=False,
                                  null=True,
                                  related_name='defense_tribunal_president',
                                  on_delete=models.SET_NULL)
    secretary = models.ForeignKey(to=Professor,
                                  blank=False,
                                  null=True,
                                  related_name='defense_tribunal_secretary',
                                  on_delete=models.SET_NULL)
    vocal = models.ForeignKey(to=Professor,
                              blank=False,
                              null=True,
                              related_name='defense_tribunal_vocal',
                              on_delete=models.SET_NULL)
    oponent = models.ForeignKey(to=Professor,
                                blank=False,
                                null=True,
                                related_name='defense_tribunal_oponent',
                                on_delete=models.SET_NULL)
    tutor = models.ForeignKey(to=Professor,
                              blank=False,
                              null=True,
                              related_name='defense_tribunal_tutor',
                              on_delete=models.SET_NULL)

    class State(models.TextChoices):
        A = 'Apr', 'Aprobado'
        D = 'Dis', 'Desaprobado'
        P = 'Pend', 'Pendiente'
    state = models.CharField(max_length=20, choices=State.choices, default=State.P)

    def __str__(self):
        return f"{self.student}:{self.defense_date}:{self.president}:{self.secretary}:{self.vocal}:{self.oponent}:{self.tutor}"


class DefenseAct(models.Model):
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
                                related_name='defense_act',
                                on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    attachment = models.URLField()

    def __str__(self):
        return f"{self.name + ":" + self.description + ":" + self.attachment}"


class Notification(models.Model):
    title = models.CharField(max_length=255)
    message = models.TextField()
    filter_criteria = models.JSONField()  # Almacena criterios de filtrado como un JSON
    on_click = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.title)

    def get_recipients(self):
        # Comienza con todos los usuarios
        users = User.objects.all()

        # Filtra según los criterios definidos en filter_criteria
        for key, value in self.filter_criteria.items():
            if key == 'first_name':
                users = users.filter(first_name__icontains=value)
            elif key == 'last_name':
                users = users.filter(last_name__icontains=value)
            elif key == 'type':
                users = users.filter(user_type=value)  # Suponiendo que tienes un campo user_type
            elif key == 'group':
                users = users.filter(group=value)  # Suponiendo que tienes un campo group

        return users
