from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from django.core.paginator import Paginator
from django.core.cache import cache
from django.db.models import Q

from users.views import StudentViewSet, ProfessorViewSet
from evidences.views import EvidenceViewSet
from requests.views import RequestViewSet
from defenses_tribunals.views import DefenseTribunalViewSet
from defense_acts.views import DefenseActViewSet


class DataTypes:
    """
    Esta clase dicta los distintos valores que puede tener el atributo datatype
    """
    class User:
        """
        Esta clase dicta los distintos tipos de usuarios
        """
        student = "student"
        professor = "professor"
        dptoInf = "dptoInf"
        decan = "decan"

    evidence = "evidence"
    request = "request"
    defense_tribunal = "defense_tribunal"
    tribunal = "tribunal"
    defense_act = "defense_act"


class ManagementGateawayView(APIView):
    """
    Esta clase pretende servir como puente entre los views especificos de manejo d datos dependiendo del tipo de dato
    """

    def dispatch(self, request, *args, **kwargs):
        datatype = kwargs.get('datatype')
        super_id = kwargs.get('super_id')

        if request.method == 'GET':
            return self.get(datatype, super_id, request)
        return self.handle_request(datatype, request, *args, **kwargs)

    def handle_request(self, datatype, super_id, request, *args, **kwargs):
        """
        Este metodo es el puente entre el endpoint y cada vista especifica
        """
        view_mapping = {
            DataTypes.User.student: StudentViewSet.as_view(),
            DataTypes.User.professor: ProfessorViewSet.as_view(),
            DataTypes.evidence: EvidenceViewSet.as_view(),
            DataTypes.request: RequestViewSet.as_view(),
            DataTypes.defense_tribunal: DefenseTribunalViewSet.as_view(),
            DataTypes.defense_act: DefenseActViewSet.as_view(),
        }
        view = view_mapping.get(datatype)

        if view:
            return view(super_id, request, *args, **kwargs)
        return Response({"error": "Invalid datatype"}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, datatype, super_id, request):
        """
        Este método maneja la lógica de la solicitud GET.
        """
        cache_key = self.get_cache_key(datatype, super_id, request)
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

        model, serializer_class = self.get_model_and_serializer(datatype)

        if model is None or serializer_class is None:
            return Response({"error": "Invalid datatype"}, status=status.HTTP_400_BAD_REQUEST)

        queryset = self.get_queryset(model, super_id, request)
        page_data = self.paginate_queryset(queryset, request)

        # Serialización
        serializer = serializer_class(page_data['object_list'], many=True)

        # Cache
        response_data = {
            f'{datatype}': serializer.data,
            'total_pages': page_data['total_pages'],
            'current_page': page_data['current_page']
        }
        cache.set(cache_key, response_data, timeout=300)

        return Response(response_data)

    def get_cache_key(self, datatype, super_id, request):
        """
        Genera la clave de caché basada en el tipo de dato y los parámetros de búsqueda.
        """
        return f"{datatype}_{super_id}_{request.query_params.get('search', '')}"

    def get_queryset(self, model, super_id, request):
        """
        Obtiene el queryset filtrado según los parámetros de búsqueda.
        """
        queryset = model.objects.all().select_related('related_model')
        search_term = request.query_params.get('search', '')

        conditions = []

        if super_id:
            conditions.append(Q(student=super_id))

        if search_term:
            searchable_fields = model.get_searchable_fields()

            for field in searchable_fields:
                conditions.append(Q(**{f"{field.name}__icontains": search_term}))

        if conditions:
            queryset = queryset.filter(*conditions)

        return queryset

    def paginate_queryset(self, queryset, request):
        """
        Maneja la paginación del queryset.
        """
        page_size = 10
        paginator = Paginator(queryset, page_size)
        page_number = int(request.query_params.get('page', 1))
        page = paginator.get_page(page_number)

        return {
            'object_list': page.object_list,
            'total_pages': paginator.num_pages,
            'current_page': page_number - 1
        }

    def get_model_and_serializer(self, datatype):
        """
        Este método es un auxiliar del método get para obtener la información necesaria del modelo específico.
        """
        match datatype:
            case DataTypes.User.student:
                return StudentViewSet.get_model_and_serializer()
            case DataTypes.User.professor:
                return ProfessorViewSet.get_model_and_serializer()
            case DataTypes.evidence:
                return EvidenceViewSet.get_model_and_serializer()
            case DataTypes.defense_act:
                return DefenseActViewSet.get_model_and_serializer()
            case _:
                return None, None
