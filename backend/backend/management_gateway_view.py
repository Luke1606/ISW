from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from users.views import StudentViewSet, ProfessorViewSet
from evidences.views import EvidenceViewSet
from requests.views import RequestViewSet
from defenses_tribunals.views import DefenseTribunalViewSet
from defense_acts.views import DefenseActViewSet
from backend.base.base_model_viewset import BaseModelViewSet
from .utils.constants import DataTypes


class ManagementGatewayView(APIView):
    """
    Vista centralizada que conecta solicitudes HTTP con diferentes ViewSets según el tipo de dato (`datatype`).
    Incluye funcionalidades de búsqueda avanzada, paginación y lógica específica (e.g., estudiantes relacionados a profesores).
    """
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.datatype = None
        self.related_user_id = None

    def dispatch(self, request, *args, **kwargs):
        """
        Configura la solicitud inicial y redirige a la acción correspondiente.
        """
        self.datatype = kwargs.get("datatype")
        self.related_user_id = kwargs.get("related_user_id")

        if request.method == "GET":
            return self.get(request)
        return self.dispatch_request_to_view(request, *args, **kwargs)

    def dispatch_request_to_view(self, request, *args, **kwargs):
        """
        Redirige la solicitud al ViewSet específico basado en el tipo de dato.
        """
        view_mapping = {
            DataTypes.User.student: StudentViewSet.as_view(),
            DataTypes.User.professor: ProfessorViewSet.as_view(),
            DataTypes.evidence: EvidenceViewSet.as_view(),
            DataTypes.request: RequestViewSet.as_view(),
            DataTypes.defense_tribunal: DefenseTribunalViewSet.as_view(),
            DataTypes.defense_act: DefenseActViewSet.as_view(),
        }
        view = view_mapping.get(self.datatype)
        if view:
            return view(request, *args, **kwargs)
        return Response({"error": "Invalid datatype"}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        """
        Maneja solicitudes GET con búsqueda avanzada, paginación y caché.
        """
        cache_key = self.get_cache_key(request)
        cached_data = self.get_cached_response(cache_key)

        if cached_data:
            return Response(cached_data)

        # Modelo y serializador asociado al tipo de dato
        model, serializer_class = self.get_model_and_serializer()
        if not model or not serializer_class:
            return Response({"error": "Invalid datatype"}, status=status.HTTP_400_BAD_REQUEST)

        # Obtener y personalizar el queryset
        queryset = self.get_specific_queryset(model)

        # Procesar la búsqueda avanzada con `search_term`
        search_term = request.query_params.get("search", "")
        queryset = self.handle_search_conditions(queryset, model, search_term)

        # Paginación
        page_data = self.paginate_queryset(queryset)

        # Serialización y respuesta con caché
        serializer = serializer_class(page_data["object_list"], many=True)
        response_data = {
            f"{self.datatype}": serializer.data,
            "total_pages": page_data["total_pages"],
            "current_page": page_data["current_page"],
        }
        self.cache_response(cache_key, response_data)
        return Response(response_data)

    def get_specific_queryset(self, model):
        """
        Modifica el queryset según el tipo de usuario.
        """
        queryset = model.objects.all()

        # Lógica específica para listar estudiantes relacionados a profesores simples
        if self.datatype == DataTypes.User.student and self.related_user_id:
            related_students_ids = self.get_related_students_ids()
            if related_students_ids:
                queryset = queryset.filter(id__in=related_students_ids)

        return queryset

    def handle_search_conditions(self, queryset, model, search_term):
        """
        Maneja las condiciones de búsqueda para incluir términos de texto y fechas.
        """
        search_params = {}

        # Verificar si el término de búsqueda es una fecha válida
        try:
            date_conditions = model.parse_date_filter(search_term)
            search_params.update(date_conditions)  # Agregar condición de fecha
        except ValueError:
            # Si no es una fecha válida, se considera como texto
            pass

        # Aplicar el término de búsqueda dinámico utilizando `search`
        return model.objects.search(queryset=queryset, search_term=search_term, **search_params)

    def get_related_students_ids(self):
        """
        Obtiene los IDs de estudiantes relacionados al profesor (si aplica).
        """
        if self.related_user_id:
            tribunal_queryset = DefenseTribunalViewSet.get_model().objects.filter(
                Q(president=self.related_user_id) |
                Q(secretary=self.related_user_id) |
                Q(vocal=self.related_user_id) |
                Q(oponent=self.related_user_id)
            )
            return list(tribunal_queryset.values_list("student_id", flat=True))
        return []

    def get_cache_key(self, request):
        """
        Genera una clave de caché única basada en los parámetros.
        """
        return f"{self.datatype}_{self.related_user_id}_{request.query_params.get('search', '')}_{request.query_params.get('page', 1)}"

    def get_cached_response(self, cache_key):
        """
        Recupera datos de caché si están disponibles.
        """
        return BaseModelViewSet.get_cached_response(self, cache_key)

    def cache_response(self, cache_key, data, timeout=300):
        """
        Guarda datos en caché.
        """
        BaseModelViewSet.cache_response(self, cache_key, data, timeout)

    def get_model_and_serializer(self):
        """
        Devuelve el modelo y el serializador asociado al tipo de dato.
        """
        model_serializer_mapping = {
            DataTypes.User.student: StudentViewSet.get_model_and_serializer(),
            DataTypes.User.professor: ProfessorViewSet.get_model_and_serializer(),
            DataTypes.evidence: EvidenceViewSet.get_model_and_serializer(),
            DataTypes.request: RequestViewSet.get_model_and_serializer(),
            DataTypes.defense_tribunal: DefenseTribunalViewSet.get_model_and_serializer(),
            DataTypes.defense_act: DefenseActViewSet.get_model_and_serializer(),
        }
        return model_serializer_mapping.get(self.datatype, (None, None))

    def paginate_queryset(self, queryset):
        """
        Aplica paginación al queryset.
        """
        return BaseModelViewSet.paginate_queryset(self, queryset)
