"""
Un BaseModel que contiene:
   - Un modelo abstracto con un `id` único generado automáticamente (UUID).
   - Un campo `created_at` para registrar la fecha de creación.
   - Un atributo `SEARCHABLE_FIELDS` que permite definir dinámicamente los campos buscables y los tipos de filtrado asociados.
"""
import uuid
from django.db import models
from .base_manager import BaseModelManager


class BaseModel(models.Model):
    """
    Clase para modelo base.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    """
    Campo `id` autogenerable basado en UUID.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    """
    Campo para registrar la fecha de creación del objeto.
    """
    SEARCHABLE_FIELDS = {}
    """
    Campo para definir los campos buscables, basta con guardar el nombre del campo como en el ejemplo:
    SEARCHABLE_FIELDS = ["nombre": "icontains", "edad": "exact"]
    """

    objects = BaseModelManager()

    class Meta:
        """
        Este model no crea una tabla en la base de datos.
        """
        abstract = True
