from django.conf import settings
from django.db import models
from core.base.base_model import BaseModel


class Notification(BaseModel):
    users = models.ManyToManyField(settings.AUTH_USER_MODEL)
    title = models.CharField(max_length=255, db_index=True)
    message = models.TextField(db_index=True)
    url = models.URLField()
    is_read = models.BooleanField(default=False)

    SEARCHABLE_FIELDS = {
        **BaseModel.SEARCHABLE_FIELDS,
        'title': 'icontains',
        'message': 'icontains',
        'is_read': 'exact',
    }
