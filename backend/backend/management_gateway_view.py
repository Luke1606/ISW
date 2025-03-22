from rest_framework.response import Response
from rest_framework import status
from users.views import StudentViewSet, ProfessorViewSet
from evidences.views import EvidenceViewSet
from requests.views import RequestViewSet
from defenses_tribunals.views import DefenseTribunalViewSet
from defense_acts.views import DefenseActViewSet
from backend.base.base_model_viewset import BaseModelViewSet
from .utils.constants import DataTypes


class ManagementGatewayView(BaseModelViewSet):
    """
    Un ViewSet centralizado que redirige dinámicamente solicitudes a diferentes ViewSets
    según el tipo de dato (`datatype`).
    Incluye lógica de búsqueda avanzada, paginación y caché.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.datatype = None
        self.related_user_id = None

    def list(self, request, *args, **kwargs):
        """
        Redirige las solicitudes GET (list) según el `datatype`.
        """
        self.datatype = kwargs.get("datatype")
        self.related_user_id = request.GET.get("related_user_id")

        # Validar el mapeo del ViewSet basado en el datatype
        viewset = self.get_viewset_for_action('list')
        if not viewset:
            return Response({"error": "Invalid datatype"}, status=status.HTTP_400_BAD_REQUEST)

        # Reutilizar la funcionalidad list del ViewSet
        return viewset(request._request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        """
        Redirige las solicitudes GET con ID (retrieve).
        """
        self.datatype = kwargs.get("datatype")
        self.related_user_id = request.GET.get("related_user_id")

        viewset = self.get_viewset_for_action('retrieve')
        if not viewset:
            return Response({"error": "Invalid datatype"}, status=status.HTTP_400_BAD_REQUEST)

        return viewset(request._request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        """
        Redirige las solicitudes POST.
        """
        self.datatype = kwargs.get("datatype")
        self.related_user_id = request.GET.get("related_user_id")

        viewset = self.get_viewset_for_action('create')
        if not viewset:
            return Response({"error": "Invalid datatype"}, status=status.HTTP_400_BAD_REQUEST)

        return viewset(request._request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """
        Redirige las solicitudes PUT.
        """
        self.datatype = kwargs.get("datatype")
        self.related_user_id = request.GET.get("related_user_id")

        viewset = self.get_viewset_for_action('update')
        if not viewset:
            return Response({"error": "Invalid datatype"}, status=status.HTTP_400_BAD_REQUEST)

        return viewset(request._request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """
        Redirige las solicitudes DELETE.
        """
        self.datatype = kwargs.get("datatype")
        self.related_user_id = request.GET.get("related_user_id")

        viewset = self.get_viewset_for_action('destroy')
        if not viewset:
            return Response({"error": "Invalid datatype"}, status=status.HTTP_400_BAD_REQUEST)

        return viewset(request._request, *args, **kwargs)

    def get_viewset_mapping(self):
        """
        Define el mapeo de ViewSets para cada `datatype`.
        """
        return {
            DataTypes.User.student: StudentViewSet,
            DataTypes.User.professor: ProfessorViewSet,
            DataTypes.evidence: EvidenceViewSet,
            DataTypes.request: RequestViewSet,
            DataTypes.defense_tribunal: DefenseTribunalViewSet,
            DataTypes.defense_act: DefenseActViewSet,
        }

    def get_viewset_for_action(self, action):
        """
        Devuelve el método específico de un ViewSet según la acción (list, create, etc.).
        """
        view_mapping = self.get_viewset_mapping()
        viewset = view_mapping.get(self.datatype)

        if not viewset:
            return None
        return viewset.as_view({
            'get': 'list',          # Asocia GET con la acción 'list'
            'post': 'create',       # Asocia POST con la acción 'create'
            'put': 'update',        # Asocia PUT con la acción 'update'
            'delete': 'destroy',    # Asocia DELETE con la acción 'destroy'
        })

    def get_queryset(self):
        """
        Reimplementa la lógica del queryset base según el datatype y related_user_id.
        """
        model, _ = self.get_model_and_serializer()
        if not model:
            return self.queryset.none()

        queryset = model.objects.all()
        if self.datatype == DataTypes.User.student and self.related_user_id:
            queryset = queryset.search(related_user_id=self.related_user_id)
        return queryset

    def get_model_and_serializer(self):
        """
        Devuelve el modelo y el serializador basado en el `datatype`.
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
        if not model_serializer:
            raise ValueError(f"No se ha definido un modelo/serializador para el datatype: {self.datatype}")
        return model_serializer
