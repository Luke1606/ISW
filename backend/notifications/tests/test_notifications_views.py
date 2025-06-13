import pytest
from .tests_notifications_models import notification
from notifications.models import Notification
from users.tests.test_users_views import student_user, student_authenticate_client


@pytest.mark.django_db
def test_list_notifications(student_authenticate_client):
    """Verifica que el usuario pueda obtener su lista de notificaciones."""
    response = student_authenticate_client.get("/notifications/")
    assert response.status_code == 200
    assert isinstance(response.json(), list) or response.json() == {'message': 'No hay elementos disponibles.'}


@pytest.mark.django_db
def test_toggle_notifications_as_read(notification, student_authenticate_client):
    """Verifica que el usuario pueda marcar notificaciones como leídas."""
    response = student_authenticate_client.put("/notifications/toggle_as_read/", json={"ids": [str(notification.id)]})
    assert response.status_code == 200
    assert Notification.objects.get(id=notification.id).is_read is not notification.is_read
    assert response.json()["message"] == "Sincronización exitosa"
