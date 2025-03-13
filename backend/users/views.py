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
