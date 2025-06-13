from rest_framework.serializers import ValidationError
from ece_requests.models import Request
from ece_requests.serializers import RequestSerializer
from users.tests.tests_users_models import student_user
from ece_requests.tests.tests_requests_models import request_instance


def test_request_serializer_valid_data(student_user):
    """Verifica que el serializer valide correctamente los datos válidos."""
    data = {
        "student": student_user.id,
        "selected_ece": Request.ECE.TD,
        "state": Request.State.PENDING
    }

    serializer = RequestSerializer(data=data)
    assert serializer.is_valid(), serializer.errors


def test_request_serializer_invalid_data(student_user):
    """Verifica que el serializer rechace datos inválidos."""
    data = {
        "student": student_user.id,
        "selected_ece": "",  # ❌ Tipo de ECE vacío
    }

    serializer = RequestSerializer(data=data)
    assert not serializer.is_valid()
    assert "selected_ece" in serializer.errors


def test_request_serializer_valid_data(request_instance):
    """Verifica que el serializer formatee correctamente una instancia ya registrada."""
    request_data = RequestSerializer(request_instance).data
    assert request_data["selected_ece"] == request_instance.selected_ece
