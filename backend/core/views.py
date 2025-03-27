import traceback
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import ValidationError
from rest_framework import status
from django_filters import rest_framework as filters
from django.core.paginator import Paginator
from django.core.cache import cache
from django.db.models import Q
from users.views import StudentViewSet, ProfessorViewSet
from evidences.views import EvidenceViewSet
from requests.views import RequestViewSet
from defenses_tribunals.views import DefenseTribunalViewSet
from defense_acts.views import DefenseActViewSet
from .utils.constants import DataTypes
from helpers.dynamic_filterset_factory import DynamicFilterSetFactory


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


class ManagementGatewayView(BaseModelViewSet):
    """
    Un ViewSet centralizado que redirige dinámicamente solicitudes a diferentes ViewSets
    según el tipo de dato (`datatype`).
    Incluye lógica de búsqueda avanzada, paginación y caché.
    """

    VIEWSET_MAPPING = {
        DataTypes.User.student: StudentViewSet,
        DataTypes.User.professor: ProfessorViewSet,
        DataTypes.evidence: EvidenceViewSet,
        DataTypes.request: RequestViewSet,
        DataTypes.defense_tribunal: DefenseTribunalViewSet,
        DataTypes.defense_act: DefenseActViewSet,
    }

    def initialize_attrs(self, request, **kwargs):
        self.datatype = kwargs.get("datatype")
        self.related_user_id = request.query_params.get("related_user_id", None)

        if not self.datatype or self.datatype not in self.VIEWSET_MAPPING:
            raise ValidationError("Invalid or missing datatype")

    def list(self, request, *args, **kwargs):
        """
        Maneja las peticiones de la accion `list`.
        """
        return self.execute_viewset('list', request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        """
        Maneja las peticiones de la accion `retrieve`.
        """
        return self.execute_viewset('retrieve', request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        """
        Maneja las peticiones de la accion `create`.
        """
        return self.execute_viewset('create', request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """
        Maneja las peticiones de la accion `update`.
        """
        return self.execute_viewset('update', request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """
        Maneja las peticiones de la accion `destroy`.
        """
        return self.execute_viewset('destroy', request, *args, **kwargs)

    def execute_viewset(self, action, request, *args, **kwargs):
        """
        Ejecuta el viewset correspondiente de manera dinámica a partir del `action` y el `datatype`.
        """
        try:
            viewset = self.get_viewset_for_action(action, request, kwargs)

            if isinstance(viewset, Response):  # Si es una respuesta de error
                return viewset
            return viewset(request._request, *args, **kwargs)

        except AttributeError as e:
            # Imprimir el traceback completo en la consola
            print("Traceback completo:")
            traceback.print_exc()

            return Response(
                {"error": f"Action {action} not implemented for {self.datatype} and caused {str(e)}"},
                status=status.HTTP_501_NOT_IMPLEMENTED
            )

    def get_viewset_for_action(self, action, request, kwargs):
        """
        Devuelve una vista generada dinámicamente para el ViewSet correspondiente
        basado en el `datatype` y la acción (list, create, etc.).
        """
        # Inicializar atributos (datatype y related_user_id)
        self.initialize_attrs(request, **kwargs)

        # Obtén el ViewSet y la acción correspondiente
        view_mapping = self.get_viewset_mapping()
        viewset_class = view_mapping.get(self.datatype)

        if not viewset_class:
            return Response(
                {"error": "Invalid datatype"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not action:
            return Response(
                {"error": f"Unsupported action: {action}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        viewset = viewset_class.as_view({request.method.lower(): action})

        return viewset

    def get_viewset_mapping(self):
        """
        Devuelve el mapeo de ViewSets para cada `datatype`.
        """
        return self.VIEWSET_MAPPING
