from channels.generic.websocket import AsyncWebsocketConsumer
import json


class NotificationsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['user'].id  # Obtener el ID del usuario conectado
        self.group_name = f'notifications_{self.user_id}'  # Crear un grupo específico para el usuario

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def send_notification(self, event):
        notification = event['notification']
        await self.send(text_data=json.dumps(notification))
