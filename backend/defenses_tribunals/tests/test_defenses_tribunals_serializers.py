import pytest
from defenses_tribunals.models import DefenseTribunal
from ece_requests.models import Request
from defenses_tribunals.serializers import DefenseTribunalSerializer
from users.tests.tests_users_models import student_user
from .tests_defenses_tribunals_models import professors, defense_tribunal


@pytest.mark.django_db
def test_defense_tribunal_serializer_valid_data(student_user, professors):
    """Verifica que el serializer valide correctamente los datos válidos."""
    data = {
        "student": student_user.id.id,
        "defense_date": "2025-06-15",
        "selected_ece": Request.ECE.TD,
        "president": professors["president"].id.id,
        "secretary": professors["secretary"].id.id,
        "vocal": professors["vocal"].id.id,
        "opponent": professors["opponent"].id.id,
        "state": DefenseTribunal.State.PENDING
    }

    serializer = DefenseTribunalSerializer(data=data)
    assert serializer.is_valid(), serializer.errors  # 🚀 Debe ser válido


@pytest.mark.django_db
def test_defense_tribunal_serializer_invalid_data(student_user):
    """Verifica que el serializer rechace datos inválidos."""
    data = {
        "student": student_user.id.id,
        "defense_date": "2025-06-15",
        "selected_ece": "INVALID",
        "president": None,
        "secretary": None,
        "vocal": None,
        "opponent": None,
        "state": "INVALID_STATE",
    }

    serializer = DefenseTribunalSerializer(data=data)
    assert not serializer.is_valid()
    assert "selected_ece" in serializer.errors
    assert "state" in serializer.errors


@pytest.mark.django_db
def test_defense_tribunal_serializer(defense_tribunal):
    """Verifica que el serializer serializa correctamente un tribunal existente."""
    serializer = DefenseTribunalSerializer(defense_tribunal)
    data = serializer.data

    assert data["student"] == defense_tribunal.student.id.id
    assert data["defense_date"] == defense_tribunal.defense_date
    assert data["selected_ece"] == defense_tribunal.selected_ece
    assert data["president"] == defense_tribunal.president.id.id
    assert data["secretary"] == defense_tribunal.secretary.id.id
    assert data["vocal"] == defense_tribunal.vocal.id.id
    assert data["opponent"] == defense_tribunal.opponent.id.id
    assert data["state"] == DefenseTribunal.State.PENDING
