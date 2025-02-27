from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework import status, viewsets
from . import models
from . import serializers


class LoginTokenObtainPairView(TokenObtainPairView):
    serializer_class = serializers.LoginTokenObtainPairSerializer


# class SuperView(viewsets.ModelViewSet):
#     queryset = YourModel.objects.all()
#     serializer_class = YourModelSerializer

#     @action(detail=False, methods=['get'], url_path='(?P<super_id>[^/.]+)')
#     def get_by_super_id(self, request, super_id=None):
#         # Lógica para manejar el super_id
#         queryset = self.queryset.filter(super_id=super_id)
#         serializer = self.get_serializer(queryset, many=True)
#         return Response(serializer.data)


class SuperView(APIView):
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


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = models.Notification.objects.all()
    serializer_class = serializers.NotificationSerializer

    @action(detail=False, methods=['post'])
    def notificate(self, request):
        header = request.data.get('header')
        description = request.data.get('description')
        on_click = request.data.get('onClick')  # Aquí puedes definir cómo manejar el onClick

        notification = models.Notification.objects.create(
            header=header,
            description=description,
            on_click=on_click
        )

        # Aquí puedes agregar la lógica para enviar un correo

        return Response(serializers.NotificationSerializer(notification).data)
