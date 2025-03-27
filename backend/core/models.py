
import uuid
from django.db import models
from datetime import datetime
from django.db.models import Q
from management.helpers.dynamic_filterset_factory import DynamicFilterSetFactory
from management.helpers.query_conditions_builder import QueryConditionBuilder


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
            'edad': 'exact',
            'fecha_nacimiento': 'date_range',
        }

        - Búsqueda General:
            queryset = MyModel.objects.search('Juan')
            Busca en todos los campos definidos en `SEARCHABLE_FIELDS` usando el método definido (icontains, exact, etc).

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
        if queryset is None:
            queryset = self.get_queryset()

        # Crear la fábrica de filtros dinámicos y aplicar los filtros específicos (kwargs)
        filterset_factory = DynamicFilterSetFactory(self.model)
        filterset_class = filterset_factory.create()
        filterset = filterset_class(data=kwargs, queryset=queryset)

        if filterset.is_valid():
            queryset = filterset.qs
        else:
            raise ValueError(f"Filtros inválidos: {filterset.errors}")

        # Construir condiciones dinámicas con QueryConditionBuilder
        search_term = args[0] if args else None
        condition_builder = QueryConditionBuilder(self.model, join_type=join_type)
        conditions = condition_builder.build_conditions(search_term=search_term, **kwargs)

        # Aplicar las condiciones al queryset
        if conditions:
            queryset = queryset.filter(conditions)

        return queryset

    def _build_date_search_conditions(self, search_term):
        """
        Interpreta un search_term como fecha exacta o rango de fechas.

        Args:
            search_term (str): Término como "2023-01-01" o "2022-01-01&2023-01-01".

        Returns:
            Q: Condiciones de búsqueda en campos de fecha o None si no es válido.
        """
        try:
            searchable_fields = getattr(self.model, "SEARCHABLE_FIELDS", {})
            conditions = Q()

            # Verificar si el término incluye un rango de fechas
            if '&' in search_term:
                start, end = search_term.split('&')
                start_date = datetime.strptime(start.strip(), "%Y-%m-%d").date()
                end_date = datetime.strptime(end.strip(), "%Y-%m-%d").date()

                date_filter_method = 'range'
                date_filter_value = [start_date, end_date]

            else:  # Búsqueda exacta
                exact_date = datetime.strptime(search_term.strip(), "%Y-%m-%d").date()

                date_filter_method = 'exact'
                date_filter_value = exact_date

            for field, lookup in searchable_fields.items():
                if lookup == "date_range":
                    conditions |= Q(**{f"{field}__{date_filter_method}": {date_filter_value}})

            return conditions if conditions else None

        except ValueError:
            return None  # No es una fecha válida, se interpreta como texto

    def _build_non_date_search_conditions(self, search_term):
        """
        Construye condiciones de búsqueda dinámica basadas en SEARCHABLE_FIELDS.

        Args:
            search_term (str): Término que será buscado en todos los SEARCHABLE_FIELDS.

        Returns:
            Q: Condiciones de búsqueda combinadas.
        """
        searchable_fields = getattr(self.model, "SEARCHABLE_FIELDS", {})
        conditions = Q()
        for field, lookup in searchable_fields.items():
            if lookup != "date_range":  # Excluir campos de fecha en búsquedas generales
                conditions |= Q(**{f"{field}__{lookup}": search_term})
        return conditions


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
    Campo para registrar la fecha de creación del objeto.
    """
    SEARCHABLE_FIELDS = {
        "created_at": "date_range",
    }
    """
    Campo para definir los campos buscables, basta con guardar el nombre del campo como en el ejemplo:
    SEARCHABLE_FIELDS = ["nombre": "icontains", "edad": "exact", "date": "date_range"]
    """

    DB_INDEX = models.IntegerField(null=False, blank=False, editable=False)
    """
    Índice por el cual se regirá el comando de población de bd para ejecutarse en orden.
    """

    objects = BaseModelManager()

    class Meta:
        """
        Este model no crea una tabla en la base de datos.
        """
        abstract = True
        ordering = ['id']
