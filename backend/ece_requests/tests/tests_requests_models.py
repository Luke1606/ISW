import pytest
from django.core.exceptions import ValidationError
from ece_requests.models import Request
from users.tests.tests_users_models import student_user
from core.management.utils.constants import Datatypes
from notifications.models import Notification
from defenses_tribunals.models import DefenseTribunal


@pytest.fixture
def request_instance(db, student_user):
    """Verifica que se pueda crear una solicitud correctamente."""
    request = Request.objects.create(
        student=student_user,
        selected_ece=Request.ECE.TD,
    )
    request.save()

    assert request.id is not None
    assert request.student == student_user
    assert request.selected_ece == Request.ECE.TD
    assert request.state == Request.State.PENDING

    # last_notification = Notification.objects.all().last()
    # name = student_user.id.name
    # message = f"El estudiante {name} envió una solicitud de ECE para optar por la categoría {request.get_selected_ece_display()}."
    # assert last_notification.title == 'Envío de solicitud'
    # assert last_notification.message == message

    yield request
    request.delete()


@pytest.mark.django_db
def test_retrieve_request(request_instance):
    """Verifica que se pueda obtener una solicitud existente."""
    retrieved_request = Request.objects.get(id=request_instance.id)
    assert retrieved_request == request_instance


@pytest.mark.django_db
def test_update_request_state(request_instance):
    """Verifica que se pueda actualizar el estado de una solicitud."""
    request_instance.state = Request.State.APPROVED
    request_instance.save()

    updated_request = Request.objects.get(id=request_instance.id)
    assert updated_request.state == Request.State.APPROVED

    # last_notification = Notification.objects.all().last()
    # assert last_notification.title == 'Su solicitud ha sido revisada'
    # assert last_notification.message == f"Su solicitud ha sido revisada y el veredicto fue {request_instance.get_state_display()}."

    # last_tribunal = DefenseTribunal.objects.all().last()
    # assert last_tribunal.student == request_instance.student
    # assert last_tribunal.selected_ece == request_instance.selected_ece
    # assert last_tribunal.defense_date == request_instance.student
    # assert last_tribunal.president is None
    # assert last_tribunal.secretary is None
    # assert last_tribunal.vocal is None
    # assert last_tribunal.opponent is None
    # assert last_tribunal.tutors.count() == 0


@pytest.mark.django_db
def test_invalid_update_request(request_instance):
    """Verifica que no se pueda actualizar campos de una solicitud que no sean el estado."""
    request_instance.selected_ece = Request.ECE.EX
    with pytest.raises(ValidationError, match="No está permitido modificar los datos de la solicitud, excepto el estado."):
        request_instance.save()


@pytest.mark.django_db
def test_destroy_request(student_user):
    """Verifica que se pueda eliminar una solicitud."""
    request = Request.objects.create(
        student=student_user,
        selected_ece=Request.ECE.PF,
    )

    request_id = request.id
    request.delete()

    assert not Request.objects.filter(id=request_id).exists()


@pytest.mark.django_db
def test_list_requests(student_user):
    """Verifica que se puedan no se puedan registrar mas solicitudes a no ser que la anterior este denegada."""
    Request.objects.create(student=student_user, selected_ece=Request.ECE.AA)
    Request.objects.create(student=student_user, selected_ece=Request.ECE.EX)

    requests = Request.objects.all()
    assert requests.count() == 2
