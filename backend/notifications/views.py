from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def send_notification(notification_message, notification_url, users):
    channel_layer = get_channel_layer()

    notification = {
        'message': notification_message,
        'url': notification_url,
    }

    for user in users:
        group_name = f'notifications_{user.id}'  # Crear un grupo específico para el usuario
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'send_notification',
                'notification': notification,
            }
        )
