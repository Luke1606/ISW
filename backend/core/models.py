
import uuid
from django.db import models
from .management.helpers.queryset_filter import QuerysetFilter


class BaseModelManager(models.Manager):
    """
    Model manager base personalizado que incluye funcionalidades comunes para todos los modelos hijos.
    Permite búsquedas avanzadas basadas en SEARCHABLE_FIELDS, incluyendo strings, números, fechas exactas y rangos.
    """
    def search(self, *args, queryset=None, join_type="AND", **kwargs):
        """
        Realiza búsquedas dinámicas basadas en SEARCHABLE_FIELDS y soporta combinaciones lógicas (AND/OR).

        Ejemplo de Uso:
        ---------------

        SEARCHABLE_FIELDS = {
            'nombre': 'icontains',
            'edad': 'int_exact',
            'fecha_nacimiento': 'date_range',
        }

        - Búsqueda General:
            queryset = MyModel.objects.search('Juan')
            Busca en todos los campos definidos en SEARCHABLE_FIELDS usando el método definido (icontains, exact, etc).
        - Búsqueda Específica:
            queryset = MyModel.objects.search(
                nombre="Juan",
                edad=30,
                fecha_nacimiento="2020-01-01",
                last_logged_in="2020-01-01&2021-01-01"
            )
        Args:
            *args: Término de búsqueda general (opcional). Se busca en todos los `SEARCHABLE_FIELDS`.
            queryset (QuerySet, optional): QuerySet base a filtrar. Si no se proporciona, se usa `get_queryset`.
            join_type (str, optional): Tipo de unión para filtros múltiples ("AND" o "OR").

            **kwargs: Filtros adicionales definidos en SEARCHABLE_FIELDS.

        Returns:
            QuerySet: QuerySet filtrado basado en las condiciones de búsqueda.
        """

        # Si no se especifica queryset, usar todos los objetos
        if queryset is None or not queryset:
            queryset = self.get_queryset()

        search_term = args[0] if args else None
        queryset_filter = QuerysetFilter(self.model)

        queryset = queryset_filter.filter_by_conditions(queryset=queryset, join_type=join_type, search_term=search_term, **kwargs)

        return queryset


class BaseModel(models.Model):
    """
    Un BaseModel que contiene:
    - Un modelo abstracto con un `id` único generado automáticamente (UUID).
    - Un campo `created_at` para registrar la fecha de creación.
    - Un atributo `SEARCHABLE_FIELDS` que permite definir dinámicamente los campos buscables y los tipos de filtrado asociados.
    - Un atributo DB_INDEX que representa el orden en el que se poblara la bd, por ejemplo: DB_INDEX = 0 (será el primer model en poblarse)
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    """
    Campo `id` autogenerable basado en UUID.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    """
    Atributo para registrar la fecha de creación del objeto.
    """
    SEARCHABLE_FIELDS = {
        "created_at": "date_range",
    }
    """
    Campo para definir los campos buscables, basta con guardar el nombre del campo como en el ejemplo:
    SEARCHABLE_FIELDS = ["nombre": "icontains", "edad": "exact", "date": "date_range"]
    """

    DB_INDEX = -1
    """
    Atributo que representa el índice por el cual se regirá el comando de población de bd para ejecutarse en orden.
    """

    objects = BaseModelManager()

    class Meta:
        """
        Este model no crea una tabla en la base de datos.
        """
        abstract = True
        ordering = ['id']
