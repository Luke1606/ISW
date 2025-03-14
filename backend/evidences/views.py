from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Evidence
from .serializers import EvidenceSerializer


class EvidenceViewSet(viewsets.ModelViewSet):
    queryset = Evidence.objects.all()
    serializer_class = EvidenceSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @staticmethod
    def get_model_and_serializer(super_id):
        if (super_id):
            pass
        return Evidence, EvidenceSerializer
