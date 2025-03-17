"""
Un model manager base personalizado con un método `search`, que utiliza `SEARCHABLE_FIELDS` para realizar búsquedas dinámicas
sobre un queryset utilizando filtros definidos.
"""
from django.db import models
from .dynamic_filterset_factory import DynamicFilterSetFactory


class BaseModelManager(models.Manager):
    """
    Manager personalizado que incluye funcionalidades comunes para todos los modelos hijos.
    """
    def search(self, queryset=None, **kwargs):
        """
        Aplica filtros basados en SEARCHABLE_FIELDS, usando DynamicFilterSetFactory.

        Ejemplo de Uso:
        ---------------
        SEARCHABLE_FIELDS = {"nombre": "icontains", "edad": "exact"}
        queryset = MyModel.objects.search(nombre="Juan", edad=30)
        """
        # Crear la fábrica de filtros dinámicos
        filterset_factory = DynamicFilterSetFactory(self.model)
        filterset_class = filterset_factory.create()

        # Si no se especifica un queryset, utilizar todos los objetos
        if queryset is None:
            queryset = self.get_queryset()

        # Crear una instancia del FilterSet con el queryset y los filtros (kwargs)
        filterset = filterset_class(data=kwargs, queryset=queryset)

        # Validar y retornar el queryset filtrado
        if filterset.is_valid():
            return filterset.qs
        raise ValueError(f"Filtros inválidos: {filterset.errors}")
