from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from django.core.paginator import Paginator
from rest_framework.pagination import PageNumberPagination
from django.core.cache import cache
from django.db.models import Q


class DataTypes:
    class User:
        student = "student"
        professor = "professor"
        dptoInf = "dptoInf"
        decan = "decan"

    evidence = "evidence"
    request = "request"
    defense_tribunal = "defense_tribunal"
    tribunal = "tribunal"
    defense_act = "defense_act"


class GateawayView(APIView):
    permission_classes = [permissions.AllowAny]  # Permite acceso a cualquier usuario

    def dispatch(self, request, *args, **kwargs):
        datatype = request.query_params.get('datatype')
        return self.handle_request(datatype, request)

    def handle_request(self, datatype, request, *args, **kwargs):
        if datatype == 'A':
            return DataTypeAViewSet.as_view()(request, *args, **kwargs)
        elif datatype == 'B':
            return DataTypeBViewSet.as_view()(request, *args, **kwargs)
        else:
            return Response({"error": "Invalid datatype"}, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset_and_serializer_for_a(self):
        # Aquí obtienes el queryset y el serializer específico para DataType A
        queryset = DataTypeA.objects.all()  # Reemplaza con tu modelo
        serializer_class = DataTypeASerializer  # Reemplaza con tu serializer
        return queryset, serializer_class

    def get_queryset_and_serializer_for_b(self):
        # Aquí obtienes el queryset y el serializer específico para DataType B
        queryset = DataTypeB.objects.all()  # Reemplaza con tu modelo
        serializer_class = DataTypeBSerializer  # Reemplaza con tu serializer
        return queryset, serializer_class

    def paginate_and_respond(self, queryset, serializer_class):
        paginator = PageNumberPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, self.request)
        serializer = serializer_class(paginated_queryset, many=True)
        return Response({f"{queryset.model.__name__.lower()}": serializer.data}, status=status.HTTP_200_OK)

    def get(self, datatype, request):
        cache_key = f"{datatype}_{request.query_params.get('search', '')}"
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

        page_size = 10
        queryset = Student.objects.all().select_related('related_model')

        # Filtrado
        search_term = request.query_params.get('search', '')

        if search_term:
            queryset = queryset.filter(
                Q(username__icontains=search_term) |
                Q(age__icontains=search_term) |
                Q(type__icontains=search_term)
                )

        # Paginación
        paginator = Paginator(queryset, page_size)
        page_number = int(request.query_params.get('page', 1))
        page = paginator.get_page(page_number)

        # Serialización
        serializer = StudentSerializer(page.object_list, many=True)

        # Cache
        response_data = {
            'users': [serializer.data],
            'total_pages': paginator.num_pages,
            'current_page': page_number - 1
        }
        cache.set(cache_key, response_data, timeout=300)

        return Response(response_data)
