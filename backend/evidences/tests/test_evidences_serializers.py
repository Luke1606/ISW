import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from users.tests.tests_users_models import student_user
from .tests_evidences_models import evidence_url, evidence_file
from evidences.serializers import EvidenceFullSerializer, EvidenceListSerializer
from evidences.models import Evidence


def test_url_evidence_full_serializer(evidence_url):
    """Verifica que el serializer completo de evidencias url serializa correctamente"""
    student = evidence_url.student
    evidence = EvidenceFullSerializer(evidence_url).data

    assert evidence["id"] == str(evidence_url.id)
    assert evidence["student"] == student.id.id
    assert evidence["name"] == evidence_url.name
    assert evidence["description"] == evidence_url.description
    assert evidence["attachment_type"] == evidence_url.attachment_type
    assert evidence["attachment_url"] == evidence_url.attachment_url
    assert evidence["attachment_file"] is None


def test_file_evidence_full_serializer(evidence_file):
    """Verifica que el serializer completo de evidencias file serializa correctamente"""
    student = evidence_file.student
    evidence = EvidenceFullSerializer(evidence_file).data

    assert evidence["id"] == str(evidence_file.id)
    assert evidence["student"] == student.id.id
    assert evidence["name"] == evidence_file.name
    assert evidence["description"] == evidence_file.description
    assert evidence["attachment_type"] == evidence_file.attachment_type
    assert evidence["attachment_url"] is None
    assert evidence["attachment_file"] == f"/media/{evidence_file.attachment_file.name}"


def test_evidences_list_serializer(evidence_url, evidence_file):
    """Verifica que el serializer de listas de evidencias de ambos tipos serializa correctamente"""
    evidence_url_data = EvidenceListSerializer(evidence_url).data
    assert evidence_url_data["id"] == str(evidence_url.id)
    assert evidence_url_data["name"] == evidence_url.name

    evidence_file_data = EvidenceListSerializer(evidence_file).data
    assert evidence_file_data["id"] == str(evidence_file.id)
    assert evidence_file_data["name"] == evidence_file.name


@pytest.mark.django_db
def test_evidence_file_valid_data(student_user):
    """Verifica que el serializer valide correctamente los datos válidos."""
    file_mock = SimpleUploadedFile(
        "test_file.pdf",
        b"contenido de prueba del archivo",
        content_type="application/pdf"
    )

    data = {
        "student": student_user.id,
        "name": "Evidencia Test",
        "description": "Descripción específica",
        "attachment_type": Evidence.Type.FILE,
        "attachment_file": file_mock,
    }

    serializer = EvidenceFullSerializer(data=data)
    assert serializer.is_valid(), serializer.errors


@pytest.mark.django_db
def test_evidence_url_valid_data(student_user):
    """Verifica que el serializer valide correctamente los datos válidos."""
    data = {
        "student": student_user.id,
        "name": "Evidencia Test",
        "description": "Descripción específica",
        "attachment_type": Evidence.Type.URL,
        "attachment_url": "http://example.com/test",
    }

    serializer = EvidenceFullSerializer(data=data)
    assert serializer.is_valid(), serializer.errors


@pytest.mark.django_db
def test_evidencet_serializer_invalid_data(student_user):
    """Verifica que el serializer rechace datos inválidos."""
    data = {
        "student": student_user.id,
        "name": "",
        "description": "Descripción específica",
        "attachment_type": "hola",
        "attachment_file": None,
    }

    serializer = EvidenceFullSerializer(data=data)
    assert not serializer.is_valid()  # 🚀 Debe ser inválido
    assert "name" in serializer.errors
    assert "attachment_type" in serializer.errors


@pytest.mark.django_db
def test_evidence_serializer_invalid_attachment(student_user):
    """Verifica que el serializer rechace datos inválidos."""
    file_mock = SimpleUploadedFile(
        "test_file.pdf",
        b"contenido de prueba del archivo",
        content_type="application/pdf"
    )

    data = {
        "student": student_user.id,
        "name": "Prueba",
        "description": "Descripción específica",
        "attachment_type": Evidence.Type.URL,
        "attachment_file": file_mock,
    }

    serializer = EvidenceFullSerializer(data=data)
    assert not serializer.is_valid()
    assert "non_field_errors" in serializer.errors
