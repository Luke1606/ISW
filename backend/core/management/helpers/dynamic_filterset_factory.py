"""
Una fábrica para generar clases `FilterSet` dinámicas basadas en los campos definidos en `SEARCHABLE_FIELDS` de un modelo.
"""
import traceback
from django_filters import rest_framework as filters
from django.db.models import Q


class DynamicFilterSetFactory:
    """
    Clase para crear FilterSet dinámicos basados en el campo SEARCHABLE_FIELDS.

    Esta clase encapsula la lógica necesaria para construir FilterSets dinámicos
    y permite acceder al modelo y campos como atributos.
    """
    def __init__(self, model):
        """
        Inicializa la fábrica con el modelo proporcionado.

        Args:
            model (Model): Modelo de Django que contiene SEARCHABLE_FIELDS.
        """
        self.model = model

    def create(self):
        """
        Crea y devuelve una clase FilterSet dinámica.

        Returns:
            Type[FilterSet]: Clase FilterSet dinámica personalizada para el modelo.
        """
        searchable_fields = self.model.SEARCHABLE_FIELDS

        # Clase interna que actúa como FilterSet dinámico
        class DynamicFilterSet(filters.FilterSet):
            """
            FilterSet dinámico basado en SEARCHABLE_FIELDS.
            """
            class Meta:
                """
                Define los miembros de la clase
                """
                model = self.model
                fields = {
                    field: [lookup] for field, lookup in searchable_fields.items()
                    if lookup != 'date_range'
                }

        return DynamicFilterSet

    def filter_with_join_type(self, queryset, data, join_type):
        """
        Aplica el FilterSet dinámico a un queryset con soporte para lógica de combinación (AND/OR).

        Args:
            queryset (QuerySet): QuerySet base al que se aplicarán los filtros.
            data (dict): Datos para filtrar.
            join_type (str): Tipo de combinación lógica ("AND" o "OR").

        Returns:
            QuerySet: QuerySet filtrado basado en las condiciones combinadas.
        """

        # Crear el FilterSet dinámico
        filterset_class = self.create()
        filterset = filterset_class(data=data, queryset=queryset)

        # Validar filtros con lógica predeterminada
        if not filterset.is_valid():
            raise ValueError(f"Filtros inválidos: {filterset.errors}")

        # Extraer las condiciones validadas del filterset
        conditions = Q()
        for field, value in filterset.form.cleaned_data.items():
            if value is not None:  # Solo procesar los filtros válidos
                condition = Q(**{field: value})
                conditions = (
                    conditions | condition if join_type == "OR" else conditions & condition
                )

        return conditions
