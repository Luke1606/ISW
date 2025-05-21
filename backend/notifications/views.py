from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework import permissions, status
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer


def send_notification(notification_title, notification_message, notification_url, users, important=False):
    channel_layer = get_channel_layer()

    if not notification_url:
        notification_url = 'http://localhost:8000/'

    notification = Notification.objects.create(
        title=notification_title,
        message=notification_message,
        url=notification_url,
    )

    notification.users.set(users)

    serialized_notification = NotificationSerializer(notification).data

    for user in users:

        group_name = f'notifications_{user.id}'  # Crear un grupo específico para el usuario
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'send_notification',
                'notification': dict(
                    notification=serialized_notification,
                    important=important
                )
            }
        )


class NotificationViewSet(ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Notification.objects.all()

    def get_queryset(self):
        # Filtrar notificaciones solo para el usuario autenticado
        return Notification.objects.filter(users=self.request.user)

    @action(detail=True, methods=['put'])
    def mark_as_read(self, request, pk=None):
        """Marcar una notificación como leída"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response(status=status.HTTP_200_OK)
