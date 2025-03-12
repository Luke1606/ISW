# from django.shortcuts import render
# from rest_framework.permissions import IsAuthenticated
# from django.shortcuts import render
# from rest_framework.response import Response
# from rest_framework.decorators import action
# from rest_framework.views import APIView
# from rest_framework import status, viewsets
# from django.core.cache import cache
# from django.core.paginator import Paginator
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from django.db.models import Q
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import viewsets
from .serializers import AuthTokenObtainPairSerializer, StudentSerializer, ProfessorSerializer
from .models import Student, Professor


class AuthTokenObtainPairView(TokenObtainPairView):
    serializer_class = AuthTokenObtainPairSerializer


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class ProfessorViewSet(viewsets.ModelViewSet):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer


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
