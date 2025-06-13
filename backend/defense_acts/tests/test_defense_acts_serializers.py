import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from users.tests.tests_users_models import student_user, professor_user
from .tests_defense_acts_models import defense_act
from defense_acts.serializers import DefenseActFullSerializer, DefenseActListSerializer


def test_defense_act_full_serializer(defense_act):
    """Verifica que el serializer completo de actas de defensa serializa correctamente"""
    student = defense_act.student
    defense_act_data = DefenseActFullSerializer(defense_act).data

    assert defense_act_data["id"] == str(defense_act.id)
    assert defense_act_data["student"] == student.id.id
    assert defense_act_data["name"] == defense_act.name
    assert defense_act_data["description"] == defense_act.description
    assert defense_act_data["attachment"] == f"/media/{defense_act.attachment.name}"


def test_defense_act_list_serializer(defense_act):
    """Verifica que el serializer de listas de actas de defensa serializa correctamente"""
    defense_act_data = DefenseActListSerializer(defense_act).data

    assert defense_act_data["id"] == str(defense_act.id)
    assert defense_act_data["name"] == defense_act.name


@pytest.mark.django_db
def test_defense_act_serializer_invalid_data(student_user, professor_user):
    """Verifica que el serializer rechace datos inválidos."""
    data = {
        "student": student_user.id,
        "author": professor_user.id,
        "name": "",  # ❌ Nombre vacío
        "description": "Descripción válida",
        "attachment": None,  # ❌ Archivo adjunto obligatorio
    }

    serializer = DefenseActFullSerializer(data=data)
    assert not serializer.is_valid()  # 🚀 Debe ser inválido
    assert "name" in serializer.errors
    assert "attachment" in serializer.errors


@pytest.mark.django_db
def test_defense_act_serializer_valid_data(student_user, professor_user):
    """Verifica que el serializer valide correctamente los datos válidos."""
    file_mock = SimpleUploadedFile(
        "test_file.pdf",
        b"contenido de prueba del archivo",
        content_type="application/pdf"
    )

    data = {
        "student": student_user.id,
        "author": professor_user.id,
        "name": "Defensa Test",
        "description": "Descripción específica",
        "attachment": file_mock,
    }

    serializer = DefenseActFullSerializer(data=data)
    assert serializer.is_valid(), serializer.errors
