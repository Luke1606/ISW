from rest_framework import viewsets
from .models import Request
from .serializers import RequestSerializer


class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer

    @staticmethod
    def get_model_and_serializer():
        return Request, RequestSerializer
