"""
Un ViewSet base que integra funcionalidad de filtrado dinámico basado en `SEARCHABLE_FIELDS`, utilizando la
clase `DynamicFilterSetFactory`.
"""
from rest_framework.viewsets import ModelViewSet
from django_filters import rest_framework as filters
from django.core.paginator import Paginator
from django.core.cache import cache
from django.db.models import Q
from .dynamic_filterset_factory import DynamicFilterSetFactory


class BaseModelViewSet(ModelViewSet):
    """
    ViewSet base que incluye funcionalidades de:
    - Filtrado dinámico basado en SEARCHABLE_FIELDS.
    - Paginación.
    - Búsquedas.
    - Caché opcional.
    """
    filter_backends = [filters.DjangoFilterBackend]
    page_size = 10  # Tamaño de página por defecto

    def get_filterset_class(self):
        """
        Retorna un FilterSet dinámico basado en el modelo asociado.
        """
        if not hasattr(self.queryset, "model"):
            raise ValueError("El queryset debe tener un modelo asociado para generar el FilterSet dinámico.")

        # Usar DynamicFilterSetFactory para crear el filtro dinámico
        factory = DynamicFilterSetFactory(self.queryset.model)
        return factory.create()

    def search_queryset(self, queryset, search_term):
        """
        Realiza búsquedas en el queryset utilizando los SEARCHABLE_FIELDS.
        """
        model = self.queryset.model
        searchable_fields = getattr(model, "SEARCHABLE_FIELDS", {})
        if not searchable_fields or not search_term:
            return queryset.objects.all()

        conditions = Q()
        for field, lookup in searchable_fields.items():
            conditions |= Q(**{f"{field}__{lookup}": search_term})

        return queryset.filter(conditions)

    def paginate_queryset(self, queryset):
        """
        Maneja la paginación del queryset.
        """
        page_number = int(self.request.GET.get("page", 1))
        paginator = Paginator(queryset, self.page_size)
        page = paginator.get_page(page_number)
        return {
            "object_list": page.object_list,
            "total_pages": paginator.num_pages,
            "current_page": page_number,
        }

    def cache_response(self, cache_key, data, timeout=300):
        """
        Guarda los datos en caché.
        """
        cache.set(cache_key, data, timeout)

    def get_cached_response(self, cache_key):
        """
        Recupera datos del caché.
        """
        return cache.get(cache_key)
