from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.serializers import Serializer
from django.core.paginator import Paginator
from django.core.cache import cache


class BaseModelViewSet(ModelViewSet):
    """
    ViewSet base que incluye funcionalidades de:
    - Filtrado dinámico basado en SEARCHABLE_FIELDS utilizando la clase `DynamicFilterSetFactory.
    - Paginación.
    - Búsquedas.
    - Caché opcional.
    """
    _page_size = 5  # Tamaño de página por defecto
    _cache_timeout = 300  # Tiempo de vencimiento de cache
    list_serializer_class: type[Serializer] | None = None  # Opción para un serializer de lista

    def get_queryset(self):
        """
        Sobrescribe el queryset inicial utilizando el método 'search' del manager.
        """
        # Obtener el queryset inicial
        queryset = super().get_queryset()

        # Usar el método auxiliar para obtener el 'search_term' y filtrar el queryset a partir de este
        queryset = queryset.model.objects.search(self._get_search_term())

        return queryset

    def get_serializer_class(self):
        # Si la acción es 'list' y hay un list_serializer_class definido, usarlo
        if self.action == 'list' and self.list_serializer_class:
            return self.list_serializer_class
        # En otros casos, usar el serializer definido en serializer_class
        return self.serializer_class

    def list(self, request, *args, **kwargs):
        """
        Sobrescribe el método 'list' para devolver los datos filtrados y paginados.
        Utiliza caché para optimizar el rendimiento.
        """
        # Crear una clave de caché única basada en los parámetros de la request
        search_term = self._get_search_term()

        cache_key = f"{self.__class__.__name__}_list_{search_term or ""}"

        # Intentar recuperar los datos del caché
        return Response(
            self._get_or_set_cached_response(cache_key, lambda: self._generate_response()),
            status=status.HTTP_200_OK
        )

    def _get_or_set_cached_response(self, cache_key, data_function):
        cached_data = self._get_cached_response(cache_key)
        if cached_data:
            return cached_data

        # Llama a la función que genera los datos si no están en la caché
        data = data_function()
        self._cache_response(cache_key, data, timeout=self._cache_timeout)
        return data

    def _generate_response(self):
        queryset = self.get_queryset()
        if not queryset.exists():
            return {"message": "No hay elementos disponibles."}

        paginated_data = self._paginate_queryset(queryset=queryset)
        paginated_data["data"] = {
            page: self.get_serializer(object_list, many=True).data
            for page, object_list in paginated_data["data"].items()
        }
        return paginated_data

    def _paginate_queryset(self, queryset):
        """
        Maneja la paginación del queryset y devuelve todos los datos divididos por páginas.
        """
        paginator = Paginator(queryset, self._page_size)
        total_pages = paginator.num_pages
        all_data = {}

        for page_number in range(0, total_pages):
            page = paginator.get_page(page_number)
            all_data[page_number] = page.object_list

        return {
            "data": all_data,
            "total_pages": total_pages
        }

    def _get_search_term(self):
        """
        Método auxiliar para obtener el parámetro 'search_term' de la request.
        Verifica que no sea nulo o una cadena vacía compuesta solo de espacios.
        """
        search_term = self.request.query_params.get('search_term', '').strip()
        if search_term and not search_term.isspace():
            return search_term
        return None  # Retorna None si es inválido

    def _cache_response(self, cache_key, data, timeout=300):
        """
        Guarda los datos en caché.
        """
        cache.set(cache_key, data, timeout)

    def _get_cached_response(self, cache_key):
        """
        Recupera datos del caché.
        """
        return cache.get(cache_key)
