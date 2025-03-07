from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import viewsets
from . import models

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
