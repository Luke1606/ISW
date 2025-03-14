from django.db import models
from users.models import Student


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

    def get_searchable_fields(self, cls):
        """
        Devuelve una lista de campos que son de tipo CharField o TextField.
        """
        return [field for field in cls._meta.get_fields() if isinstance(field, (models.CharField, models.TextField))]
