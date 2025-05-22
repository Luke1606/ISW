from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.serializers import Serializer
from django.core.paginator import Paginator
from django.core.cache import cache
from core.management.utils.constants import Datatypes
from users.models import Professor


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
        search_term = self._get_search_term() or ''
        queryset = queryset.model.objects.search(search_term)

        related_user_id = self._get_related_user_id()

        datatype = self.kwargs.get('datatype')

        if related_user_id:
            if self.request.user.user_role != Datatypes.User.professor:
                queryset = queryset.filter(student=related_user_id)
            if self.request.user.user_role == Datatypes.User.professor and datatype == Datatypes.User.student:
                professor = Professor.objects.get(id_id=related_user_id)
                student_ids = professor.get_related_students_ids()
                queryset = queryset.filter(id_id__in=student_ids)

        return queryset.order_by('-created_at')

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

        # Intentar recuperar los datos del caché
        return Response(
            self._get_or_set_cached_response(lambda: self._generate_response()),
            status=status.HTTP_200_OK
        )

    def create(self, request, *args, **kwargs):
        self.invalidate_cache()
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.invalidate_cache()
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """
        Método destroy personalizado para poder eliminar un conjunto de elementos a partir de una lista de ids.
        """
        self.invalidate_cache()

        ids = request.data.get("ids", [])

        if not ids or not isinstance(ids, list):
            return Response({"error": "Debe proporcionar una lista de IDs"}, status=status.HTTP_400_BAD_REQUEST)

        queryset = self.get_queryset()
        deleted_count, _ = queryset.filter(id__in=ids).delete()

        return Response({"message": f"{deleted_count} elementos eliminados"}, status=status.HTTP_200_OK)

    def _get_or_set_cached_response(self, data_function):
        cached_data = self._get_cached_response()
        if cached_data:
            return cached_data

        # Llama a la función que genera los datos si no están en la caché
        data = data_function()
        self._cache_response(data, timeout=self._cache_timeout)
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

        for page_number in range(1, total_pages + 1):
            page = paginator.get_page(page_number)
            all_data[page_number - 1] = page.object_list

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

    def _get_related_user_id(self):
        """
        Método auxiliar para obtener el parámetro 'related_user_id' de la request.
        """
        related_user_id = self.request.query_params.get('related_user_id', '')
        return related_user_id

    def _cache_response(self, data, timeout=300):
        """
        Guarda los datos en caché.
        """
        cache_key = self._build_cache_key()
        cache.set(cache_key, data, timeout)

    def _get_cached_response(self):
        """
        Recupera datos del caché.
        """
        cache_key = self._build_cache_key()
        return cache.get(cache_key)

    def invalidate_cache(self):
        """
        Elimina la caché basada en los parámetros de búsqueda.
        """
        cache.clear()

    def _build_cache_key(self):
        '''
        Devuelve una caché key única basada en los parámetros de la request.
        '''
        search_term = self._get_search_term()
        related_user_id = self._get_related_user_id()
        return f'{self.__class__.__name__}_list_{search_term or ''}_{related_user_id}'
