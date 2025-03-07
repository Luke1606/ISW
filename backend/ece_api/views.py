from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework import status, viewsets
from django.core.cache import cache
from django.core.paginator import Paginator
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from . import models
from . import serializers



# class UserListView(APIView):
#     def get(self, request):
#         cache_key = f"users_{request.query_params.get('search', '')}"
#         cached_data = cache.get(cache_key)

#         if cached_data:
#             return Response(cached_data)

#         page_size = 10
#         queryset = User.objects.all().select_related('related_model')

#         # Filtrado
#         search_term = request.query_params.get('search', '')
#         if search_term:
#             queryset = queryset.filter(Q(username__icontains=search_term) | ...)

#  # Paginación
#         paginator = Paginator(queryset, page_size)
#         page_number = int(request.query_params.get('page', 1))
#         page = paginator.get_page(page_number)

#         # Serialización
#         serializer = UserReadOnlySerializer(page.object_list, many=True)

#         # Cache
#         response_data = {
#             'users': [serializer.data],
#             'total_pages': paginator.num_pages,
#             'current_page': page_number - 1
#         }
#         cache.set(cache_key, response_data, timeout=300)

#         return Response(response_data)


# class UserListView(APIView):
#     def get(self, request):
#         search_term = request.query_params.get('search', '')
#         queryset = User.objects.all()

#         if search_term:
#             queryset = queryset.filter(
#                 Q(username__icontains=search_term) |
#                 Q(age__icontains=search_term) |
#                 Q(type__icontains=search_term)
#             )

#         total_users = queryset.count()

#         if total_users <= 8000:
#             # Enviar todos los datos
#             serializer = UserReadOnlySerializer(queryset, many=True)
#             return Response({
#                 'users': serializer.data,
#                 'total_pages': 1,
#                 'current_page': 0
#             })
#         else:
#             # Paginación híbrida
#             page_size = 10
#             paginator = Paginator(queryset, page_size)
#             page_number = request.query_params.get('page', 1)
#             page = paginator.get_page(page_number)
#             serializer = UserReadOnlySerializer(page.object_list, many=True)

#             return Response({
#                 'users': serializer.data,
#                 'total_pages': paginator.num_pages,
#                 'current_page': page.number - 1
#             })


# class SuperView(viewsets.ModelViewSet):
#     queryset = YourModel.objects.all()
#     serializer_class = YourModelSerializer

#     @action(detail=False, methods=['get'], url_path='(?P<super_id>[^/.]+)')
#     def get_by_super_id(self, request, super_id=None):
#         # Lógica para manejar el super_id
#         queryset = self.queryset.filter(super_id=super_id)
#         serializer = self.get_serializer(queryset, many=True)
#         return Response(serializer.data)


class ManagementView(APIView):
    def get_viewset(self, datatype, super_id):
        match datatype:
            case 'estudiante':
                return StudentViewSet.as_view({'get': 'list', 'post': 'create'})
            case 'profesor':
                return ProfessorViewSet.as_view({'get': 'list', 'post': 'create'})
            case 'evidencia':
                return EvidenceViewSet.as_view({'get': 'list', 'post': 'create'})
            case 'solicitud':
                return RequestViewSet.as_view({'get': 'list', 'post': 'create'})
            case 'defensa-tribunal':
                return DefenseTribunalViewSet.as_view({'get': 'list', 'post': 'create'})
            case 'acta de defensa':
                return DefenseActViewSet.as_view({'get': 'list', 'post': 'create'})
            case _:
                return None

    def get(self, request, datatype, super_id=None):
        viewset = self.get_viewset(datatype)
        if viewset:
            return viewset(request, super_id=super_id)
        return Response({"error": "Invalid datatype"}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, datatype, super_id=None):
        viewset = self.get_viewset(datatype, super_id)
        if viewset:
            return viewset(request)
        return Response({"error": "Invalid datatype"}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, datatype, id, super_id=None):
        viewset = self.get_viewset(datatype, super_id)
        if viewset:
            return viewset(request, id=id, super_id=super_id)
        return Response({"error": "Invalid datatype or id"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, datatype, id, super_id=0):
        viewset = self.get_viewset(datatype, super_id)
        if viewset:
            return viewset(request, id=id, super_id=super_id)
        return Response({"error": "Invalid datatype or id"}, status=status.HTTP_400_BAD_REQUEST)


class StudentViewSet(viewsets.ModelViewSet):
    queryset = models.Student.objects.all()
    serializer_class = serializers.StudentSerializer

    def list(self, request, super_id=None):
        # Aquí puedes acceder a super_id
        # Lógica para listar estudiantes
        pass

    def create(self, request, super_id=None):
        # Aquí puedes acceder a super_id
        # Lógica para crear un estudiante
        pass


class ProfessorViewSet(viewsets.ModelViewSet):
    queryset = models.Professor.objects.all()
    serializer_class = serializers.ProfessorSerializer


class EvidenceViewSet(viewsets.ModelViewSet):
    queryset = models.Evidence.objects.all()
    serializer_class = serializers.EvidenceSerializer


class RequestViewSet(viewsets.ModelViewSet):
    queryset = models.Request.objects.all()
    serializer_class = serializers.RequestSerializer


class DefenseTribunalViewSet(viewsets.ModelViewSet):
    queryset = models.DefenseTribunal.objects.all()
    serializer_class = serializers.DefenseTribunalSerializer


class DefenseActViewSet(viewsets.ModelViewSet):
    queryset = models.DefenseAct.objects.all()
    serializer_class = serializers.DefenseActSerializer
