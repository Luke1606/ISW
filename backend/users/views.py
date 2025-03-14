from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .serializers import AuthTokenObtainPairSerializer, StudentSerializer, ProfessorSerializer
from .models import CustomUser, Student, Professor


class AuthTokenObtainPairView(TokenObtainPairView):
    """
    Esta vista maneja la logica de devolucion de tokens de autenticacion
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = AuthTokenObtainPairSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({"data": serializer.data, "count": queryset.count()})

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({"message": "Created successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({"data": serializer.data})

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"message": "Updated successfully", "data": serializer.data})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    @staticmethod
    def get_model_and_serializer():
        return Student, StudentSerializer


class ProfessorViewSet(viewsets.ModelViewSet):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer

    @staticmethod
    def get_model_and_serializer():
        return Professor, ProfessorSerializer
