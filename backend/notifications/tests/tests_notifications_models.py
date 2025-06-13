import pytest
from notifications.models import Notification
from users.tests.tests_users_models import student_user


@pytest.fixture
def notification(db, student_user):
    """Verifica que se pueda crear una notificación correctamente."""
    notification = Notification.objects.create(
        title="Nueva notificación",
        message="Este es un mensaje de prueba",
    )
    notification.users.add(student_user.id)

    assert notification.id is not None
    assert notification.title == "Nueva notificación"
    assert notification.message == "Este es un mensaje de prueba"
    assert list(notification.users.values_list("id", flat=True)) == [student_user.id.id]
    assert notification.is_read is False

    yield notification
    notification.delete()


@pytest.mark.django_db
def test_toggle_notification_read_status(notification):
    """Verifica que se pueda cambiar el estado de lectura de una notificación."""
    notification.is_read = True
    notification.save()

    updated_notification = Notification.objects.get(id=notification.id)
    assert updated_notification.is_read is True
