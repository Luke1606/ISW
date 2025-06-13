import pytest
from evidences.models import Evidence
from users.tests.tests_users_models import student_user


@pytest.fixture
def evidence_url(db, student_user):
    """Verifica que se pueda crear una evidencia correctamente."""
    evidence = Evidence.objects.create(
        student=student_user,
        name="Evidencia Test",
        description="Descripción detallada",
        attachment_type=Evidence.Type.URL,
        attachment_url="http://example.com/test"
    )
    evidence.save()

    assert evidence.id is not None
    assert evidence.student == student_user
    assert evidence.name == "Evidencia Test"
    assert evidence.description == "Descripción detallada"
    assert evidence.attachment_type == Evidence.Type.URL
    assert evidence.attachment_url == "http://example.com/test"
    assert not evidence.attachment_file

    yield evidence
    evidence.delete()


@pytest.fixture
def evidence_file(db, student_user):
    """Verifica que se pueda crear una evidencia correctamente."""
    evidence = Evidence.objects.create(
        student=student_user,
        name="Evidencia Test",
        description="Descripción detallada",
        attachment_type=Evidence.Type.FILE,
        attachment_file="evidences/attachments/test_file.pdf"
    )
    evidence.save()

    assert evidence.student == student_user
    assert evidence.name == "Evidencia Test"
    assert evidence.description == "Descripción detallada"
    assert evidence.attachment_type == Evidence.Type.FILE
    assert evidence.attachment_file.name == "evidences/attachments/test_file.pdf"
    assert not evidence.attachment_url

    yield evidence
    evidence.delete()


@pytest.mark.django_db
def test_retrieve_evidences(evidence_url, evidence_file):
    """Verifica que se pueda obtener una evidencia existente de cada tipo."""
    retrieved_url_evidence = Evidence.objects.get(id=evidence_url.id)
    retrieved_file_evidence = Evidence.objects.get(id=evidence_file.id)

    assert retrieved_url_evidence == evidence_url
    assert retrieved_file_evidence == evidence_file


@pytest.mark.django_db
def test_update_evidence(evidence_url):
    """Verifica que se pueda actualizar una evidencia."""
    evidence_url.name = "Evidencia Actualizada"
    evidence_url.save()

    updated_evidence = Evidence.objects.get(id=evidence_url.id)
    assert updated_evidence.name == "Evidencia Actualizada"


@pytest.mark.django_db
def test_update_attachment_type_evidence(evidence_url):
    """Verifica que se pueda actualizar una evidencia."""
    evidence_url.attachment_type = Evidence.Type.FILE
    evidence_url.attachment_url = None
    evidence_url.attachment_file = "evidences/attachments/test_file.pdf"
    evidence_url.save()

    updated_evidence = Evidence.objects.get(id=evidence_url.id)
    assert updated_evidence.attachment_type == Evidence.Type.FILE
    assert updated_evidence.attachment_file.name == "evidences/attachments/test_file.pdf"
    assert updated_evidence.attachment_url is None


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
    evidence.save()

    evidence_id = evidence.id
    evidence.delete()

    assert not Evidence.objects.filter(id=evidence_id).exists()


@pytest.mark.django_db
def test_list_evidence(student_user, evidence_url, evidence_file):
    """Verifica que se puedan listar múltiples evidencias."""
    evidences = Evidence.objects.all()
    assert evidences.count() == 2


@pytest.mark.django_db
def test_create_evidence_without_description(student_user):
    """Verifica que se pueda crear una evidencia sin descripción."""
    evidence = Evidence.objects.create(
        student=student_user,
        name="Evidencia Test",
        attachment_type=Evidence.Type.FILE,
        attachment_file="evidences/attachments/test_file.pdf"
    )
    assert evidence.description is None
