import pytest
from notifications.serializers import NotificationSerializer
from notifications.models import Notification
from .tests_notifications_models import notification
from users.tests.tests_users_models import student_user


@pytest.mark.django_db
def test_notification_serializer(notification):
    """Verifica que el serializer serializa correctamente los datos de una notificación."""
    data = NotificationSerializer(notification).data

    assert data["id"] == str(notification.id)
    assert data["title"] == notification.title
    assert data["message"] == notification.message
    assert data["is_read"] is False
