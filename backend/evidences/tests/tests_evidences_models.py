import pytest
from evidences.models import Evidence
from users.tests.tests_users_models import student_user


@pytest.mark.django_db
def test_create_evidence(student_user):
    """Verifica que se pueda crear una evidencia correctamente."""
    evidence = Evidence.objects.create(
        student=student_user,
        name="Evidencia Test",
        description="Descripción detallada",
        attachment_type=Evidence.Type.URL,
        attachment_url="http://example.com/test"
    )

    assert evidence.name == "Evidencia Test"
    assert evidence.description == "Descripción detallada"
    assert evidence.attachment_type == Evidence.Type.URL
    assert evidence.student == student_user


@pytest.mark.django_db
def test_retrieve_evidence(student_user):
    """Verifica que se pueda obtener una evidencia existente."""
    evidence = Evidence.objects.create(
        student=student_user,
        name="Evidencia Test",
        description="Descripción detallada",
        attachment_type=Evidence.Type.URL,
        attachment_url="http://example.com/test"
    )

    retrieved_evidence = Evidence.objects.get(id=evidence.id)
    assert retrieved_evidence == evidence


@pytest.mark.django_db
def test_update_evidence(student_user):
    """Verifica que se pueda actualizar una evidencia."""
    evidence = Evidence.objects.create(
        student=student_user,
        name="Evidencia Test",
        description="Descripción detallada",
        attachment_type=Evidence.Type.URL,
        attachment_url="http://example.com/test"
    )

    evidence.name = "Evidencia Actualizada"
    evidence.save()

    updated_evidence = Evidence.objects.get(id=evidence.id)
    assert updated_evidence.name == "Evidencia Actualizada"


@pytest.mark.django_db
def test_destroy_evidence(student_user):
    """Verifica que se pueda eliminar una evidencia."""
    evidence = Evidence.objects.create(
        student=student_user,
        name="Evidencia Test",
        description="Descripción detallada",
        attachment_type=Evidence.Type.URL,
        attachment_url="http://example.com/test"
    )

    evidence_id = evidence.id
    evidence.delete()

    assert not Evidence.objects.filter(id=evidence_id).exists()


@pytest.mark.django_db
def test_list_evidence(student_user):
    """Verifica que se puedan listar múltiples evidencias."""
    Evidence.objects.create(
        student=student_user,
        name="Evidencia 1",
        description="Descripción 1",
        attachment_type=Evidence.Type.URL,
        attachment_url="http://example.com/1"
    )
    Evidence.objects.create(
        student=student_user,
        name="Evidencia 2",
        description="Descripción 2",
        attachment_type=Evidence.Type.FILE,
        attachment_file="evidences/attachments/test_file.pdf"
    )

    evidences = Evidence.objects.all()
    assert evidences.count() == 2
