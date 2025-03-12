from django.db import models
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
        URL = 'URL', 'URL'
        FILE = 'File', 'FileURL'
    type = models.CharField(max_length=20, choices=Type.choices, default=Type.URL)
    attachment = models.URLField()

    def __str__(self):
        return f"{self.name} : {self.description} : {self.attachment}"


class Proyect(Evidence):
    class Roles(models.TextChoices):
        # URL = 'URL', 'URL'
        # FILE = 'File', 'FileURL'
        pass
    # roles = models.CharField(max_length=20, choices=Type.choices, default=Type.URL)


class ScientificArticle(Evidence):
    class Fields(models.TextChoices):
        pass


class Distinctions(Evidence):
    pass
