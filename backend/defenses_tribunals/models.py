from django.db import models

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
