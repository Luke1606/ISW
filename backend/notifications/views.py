from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F
from core.views import BaseModelViewSet
from .models import Notification
from .serializers import NotificationSerializer


def send_notification(notification_title, notification_message, users, important=False):
    channel_layer = get_channel_layer()

    notification = Notification.objects.create(
        title=notification_title,
        message=notification_message,
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


class NotificationViewSet(BaseModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Notification.objects.all().order_by('-created_at')
    permission_classes_by_action = {
        'retrieve': [],
        'update': [],
        'destroy': [permissions.IsAuthenticated],
        'create': [],
        'list': [],
    }

    def get_permissions(self):
        """
        Asigna permisos dinámicos según la acción.
        """
        permissions_list = self.permission_classes_by_action.get(self.action, [])
        return [permission() for permission in permissions_list]

    def get_queryset(self):
        # Filtrar notificaciones solo para el usuario autenticado
        return Notification.objects.filter(users=self.request.user)

    @action(detail=False, methods=['put'])
    def toggle_as_read(self, request, *args, **kwargs):
        """
        Método destroy personalizado para poder eliminar un conjunto de elementos a partir de una lista de ids.
        """
        super().invalidate_cache()

        ids = request.data.get("ids", [])

        if not ids or not isinstance(ids, list):
            return Response({"error": "Debe proporcionar una lista de IDs"}, status=status.HTTP_400_BAD_REQUEST)

        queryset = self.get_queryset()
        queryset.filter(id__in=ids).update(is_read=~F('is_read'))

        return Response({"message": "Sincronización exitosa"}, status=status.HTTP_200_OK)

    def list(self, request, *args, **kwargs):
        """Sobrescribe el método 'list' para asegurarse de que no se usa caché."""
        self.invalidate_cache()
        return super().list(request, *args, **kwargs)
