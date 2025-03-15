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


class ManagementGatewayView(APIView):
    """
    Esta clase pretende servir como puente entre los views especificos de manejo d datos dependiendo del tipo de dato
    """
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.request = None
        self.datatype = None
        self.related_user_id = None

    def dispatch(self, request, *args, **kwargs):
        self.request = request
        self.datatype = kwargs.get('datatype')
        self.related_user_id = kwargs.get('related_user_id')

        if request.method == 'GET':
            return self.get()
        return self.dispatch_request_to_view()

    def dispatch_request_to_view(self, *args, **kwargs):
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
        view = view_mapping.get(self.datatype)

        if view:
            return view(self.request, *args, **kwargs)
        return Response({"error": "Invalid datatype"}, status=status.HTTP_400_BAD_REQUEST)

    def get(self):
        """
        Este método maneja la lógica de la solicitud GET.
        """
        cache_key = self.get_cache_key()
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

        model, serializer_class = self.get_model_and_serializer()

        if model is None or serializer_class is None:
            return Response({"error": "Invalid datatype"}, status=status.HTTP_400_BAD_REQUEST)

        queryset = self.get_queryset(model)
        page_data = self.paginate_queryset(queryset)

        # Serialización
        serializer = serializer_class(page_data['object_list'], many=True)

        # Cache
        response_data = {
            f'{self.datatype}': serializer.data,
            'total_pages': page_data['total_pages'],
            'current_page': page_data['current_page']
        }
        cache.set(cache_key, response_data, timeout=300)

        return Response(response_data)

    def get_cache_key(self):
        """
        Genera la clave de caché basada en el tipo de dato y los parámetros de búsqueda.
        """
        return f"{self.datatype}_{self.related_user_id}_{self.request.query_params.get('search', '')}"

    def get_queryset(self, model):
        """
        Obtiene el queryset filtrado según los parámetros de búsqueda.
        """
        queryset = model.objects.all().select_related('related_model')

        conditions = self.build_search_conditions(model)

        if conditions:
            queryset = queryset.filter(*conditions)

        return queryset

    def build_search_conditions(self, model):
        """
        Este metodo crea las condiciones de filtrado si hay un termino de busqueda
        """
        conditions = []

        search_term = self.request.query_params.get('search', '')

        if self.datatype == DataTypes.User.student:
            related_students_ids = self.get_related_students_ids()
            conditions.append(Q(id__in=related_students_ids))

        if search_term:
            searchable_fields = model.get_searchable_fields()

            for field in searchable_fields:
                conditions.append(Q(**{f"{field.name}__icontains": search_term}))
            return conditions
        return None

    def get_related_students_ids(self):
        """
        Este metodo devuelve una lista con los ids de los estudiantes que tienen al usuario de id related_user_id como miembro
        de su tribunal
        """
        if self.related_user_id:
            tribunal_model = DefenseTribunalViewSet.get_model()

            tribunal_queryset = tribunal_model.objects.filter(
                                    Q(president=self.related_user_id) |
                                    Q(secretary=self.related_user_id) |
                                    Q(vocal=self.related_user_id) |
                                    Q(oponent=self.related_user_id)
                                )
            student_ids = tribunal_queryset.values_list('id', flat=True)
            return list(student_ids)
        return None

    def paginate_queryset(self, queryset):
        """
        Maneja la paginación del queryset.
        """
        page_size = 10
        paginator = Paginator(queryset, page_size)
        page_number = int(self.request.query_params.get('page', 1))
        page = paginator.get_page(page_number)

        return {
            'object_list': page.object_list,
            'total_pages': paginator.num_pages,
            'current_page': page_number - 1
        }

    def get_model_and_serializer(self):
        """
        Este método es un auxiliar del método get para obtener la información necesaria del modelo específico.
        """

        model_serializer_mapping = {
            DataTypes.User.student: StudentViewSet.get_model_and_serializer(),
            DataTypes.User.professor: ProfessorViewSet.get_model_and_serializer(),
            DataTypes.evidence: EvidenceViewSet.get_model_and_serializer(),
            DataTypes.request: RequestViewSet.get_model_and_serializer(),
            DataTypes.defense_tribunal: DefenseTribunalViewSet.get_model_and_serializer(),
            DataTypes.defense_act: DefenseActViewSet.get_model_and_serializer(),
        }
        model_serializer = model_serializer_mapping.get(self.datatype)

        if model_serializer:
            return model_serializer()
        return None, None
