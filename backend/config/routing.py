from django.urls import path
from notifications.consumers import NotificationsConsumer

websocket_urlpatterns = [
    path(r'ws/notifications/', NotificationsConsumer.as_asgi()),
]
