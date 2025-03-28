from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from django_filters import rest_framework as filters
from django.core.paginator import Paginator
from django.core.cache import cache
from django.db.models import Q
from .management.helpers.dynamic_filterset_factory import DynamicFilterSetFactory


class BaseModelViewSet(ModelViewSet):
    """
    ViewSet base que incluye funcionalidades de:
    - Filtrado dinámico basado en SEARCHABLE_FIELDS utilizando la clase `DynamicFilterSetFactory.
    - Paginación.
    - Búsquedas.
    - Caché opcional.
    """
    filter_backends = [filters.DjangoFilterBackend]
    page_size = 5  # Tamaño de página por defecto

    def get_filterset_class(self):
        """
        Retorna un FilterSet dinámico basado en el modelo asociado.
        """
        if not hasattr(self.queryset, "model"):
            raise ValueError("El queryset debe tener un modelo asociado para generar el FilterSet dinámico.")

        # Usar DynamicFilterSetFactory para crear el filtro dinámico
        factory = DynamicFilterSetFactory(self.queryset.model)
        return factory.create()

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset

    def list(self, request, *args, **kwargs):
        """
        Sobrescribe el método 'list' para devolver todos los datos, divididos por página.
        """
        queryset = self.get_queryset()

        if not queryset.exists():
            return Response(
                {"message": "No hay elementos disponibles."},
                status=status.HTTP_204_NO_CONTENT
            )

        paginated_data = self.paginate_queryset()

        # Serializar los datos paginados
        for page, object_list in paginated_data["data"].items():
            serializer = self.get_serializer(object_list, many=True)
            paginated_data["data"][page] = serializer.data

        # Devolver la respuesta final
        print(paginated_data)
        return Response(paginated_data, status=status.HTTP_200_OK)

    def search_queryset(self, search_term):
        """
        Realiza búsquedas en el queryset utilizando los SEARCHABLE_FIELDS.
        """
        model = self.queryset.model
        searchable_fields = getattr(model, "SEARCHABLE_FIELDS", {})
        if not searchable_fields or not search_term:
            return self.queryset.objects.all()

        conditions = Q()
        for field, lookup in searchable_fields.items():
            conditions |= Q(**{f"{field}__{lookup}": search_term})

        return self.queryset.filter(conditions)

    def paginate_queryset(self):
        """
        Maneja la paginación del queryset y devuelve todos los datos divididos por páginas.
        """
        paginator = Paginator(self.queryset, self.page_size)
        total_pages = paginator.num_pages
        all_data = {}

        for page_number in range(0, total_pages):
            page = paginator.get_page(page_number)
            all_data[page_number] = page.object_list

        return {
            "data": all_data,
            "total_pages": total_pages
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
