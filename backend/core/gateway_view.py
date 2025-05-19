import traceback
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from users.views import StudentViewSet, ProfessorViewSet
from evidences.views import EvidenceViewSet
from requests.views import RequestViewSet
from defenses_tribunals.views import DefenseTribunalViewSet
from defense_acts.views import DefenseActViewSet
from .management.utils.constants import Datatypes


class ManagementGatewayView(ModelViewSet):
    '''
    Un ViewSet centralizado que redirige dinámicamente solicitudes a diferentes ViewSets
    según el tipo de dato (`datatype`).
    Incluye lógica de búsqueda avanzada, paginación y caché.
    '''

    _VIEWSET_MAPPING = {
        Datatypes.User.student: StudentViewSet,
        Datatypes.User.professor: ProfessorViewSet,
        Datatypes.evidence: EvidenceViewSet,
        Datatypes.request: RequestViewSet,
        Datatypes.defense_tribunal: DefenseTribunalViewSet,
        Datatypes.defense_act: DefenseActViewSet,
    }

    def _initialize_attrs(self, request, **kwargs):
        self.datatype = kwargs.get('datatype')

        if not self.datatype or self.datatype not in self._VIEWSET_MAPPING:
            raise ValidationError('Tipo de dato no válido o no proporcionado')

    def list(self, request, *args, **kwargs):
        '''
        Maneja las peticiones de la accion `list`.
        '''
        return self._execute_viewset('list', request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        '''
        Maneja las peticiones de la accion `retrieve`.
        '''
        return self._execute_viewset('retrieve', request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        '''
        Maneja las peticiones de la accion `create`.
        '''
        return self._execute_viewset('create', request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        '''
        Maneja las peticiones de la accion `update`.
        '''
        return self._execute_viewset('update', request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        '''
        Maneja las peticiones de la accion `destroy`.
        '''
        return self._execute_viewset('destroy', request, *args, **kwargs)

    def _execute_viewset(self, action, request, *args, **kwargs):
        '''
        Ejecuta el viewset correspondiente de manera dinámica a partir del `action` y el `datatype`.
        '''
        try:
            viewset = self._get_viewset_for_action(action, request, kwargs)

            if isinstance(viewset, Response):  # Si es una respuesta de error
                return viewset

            if viewset is None:  # Validación para evitar errores
                return Response(
                    f"No se pudo obtener el ViewSet para la acción {action}.",
                    status=status.HTTP_400_BAD_REQUEST
                )

            return viewset(request._request, *args, **kwargs)

        except AttributeError as e:
            # Imprimir el traceback completo en la consola
            print('Traceback completo:')
            traceback.print_exc()

            return Response(
                f'Acción {action} no válida para ese tipo de dato provocó {str(e)}',
                status=status.HTTP_400_BAD_REQUEST
            )

    def _get_viewset_for_action(self, action, request, kwargs):
        '''
        Devuelve una vista generada dinámicamente para el ViewSet correspondiente
        basado en el `datatype` y la acción (list, create, etc.).
        '''
        # Inicializar atributos (datatype y related_user_id)
        self._initialize_attrs(request, **kwargs)

        # Obtén el ViewSet y la acción correspondiente
        view_mapping = self._get_viewset_mapping()
        viewset_class = view_mapping.get(self.datatype)

        if not viewset_class:
            return Response(
                'Tipo de dato no válido',
                status=status.HTTP_400_BAD_REQUEST
            )

        if not action:
            return Response(
                f'Acción no soportada: {action}.',
                status=status.HTTP_400_BAD_REQUEST
            )

        viewset = viewset_class.as_view({request.method.lower(): action})

        return viewset

    def _get_viewset_mapping(self):
        '''
        Devuelve el mapeo de ViewSets para cada `datatype`.
        '''
        return self._VIEWSET_MAPPING
