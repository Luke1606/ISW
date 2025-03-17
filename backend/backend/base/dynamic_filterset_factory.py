"""
Una fábrica para generar clases `FilterSet` dinámicas basadas en los campos definidos en `SEARCHABLE_FIELDS` de un modelo.
"""
from django_filters import rest_framework as filters


class DynamicFilterSetFactory:
    """
    Clase para crear FilterSet dinámicos basados en SEARCHABLE_FIELDS.

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
        self.searchable_fields = getattr(model, "SEARCHABLE_FIELDS", {})

    def create(self):
        """
        Crea y devuelve una clase FilterSet dinámica.

        Returns:
            Type[FilterSet]: Clase FilterSet dinámica personalizada para el modelo.
        """
        searchable_fields = self.searchable_fields

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
                }

        return DynamicFilterSet
