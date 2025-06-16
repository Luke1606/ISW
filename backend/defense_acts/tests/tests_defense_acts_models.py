import pytest
from defense_acts.models import DefenseAct
from django.core.files.uploadedfile import SimpleUploadedFile
from users.tests.tests_users_models import student_user, professor_user
from notifications.models import Notification


@pytest.fixture
def defense_act(db, student_user, professor_user):
    """Verifica que se pueda crear un acto de defensa correctamente."""
    file_mock = SimpleUploadedFile(
        "test_file.pdf",
        b"contenido de prueba del archivo",
        content_type="application/pdf"
    )

    defense_act = DefenseAct.objects.create(
        student=student_user,
        author=professor_user,
        name="Defensa Test",
        description="Descripción específica",
        attachment=file_mock
    )
    defense_act.save()
    defense_act.refresh_from_db()
    assert defense_act.id is not None
    assert defense_act.student == student_user
    assert defense_act.author == professor_user
    assert defense_act.name == "Defensa Test"
    assert defense_act.description == "Descripción específica"
    assert defense_act.attachment.name is not None

    yield defense_act
    defense_act.delete()


@pytest.mark.django_db
def test_retrieve_defense_act(defense_act):
    """Verifica que se pueda obtener un acto de defensa existente."""
    retrieved_defense_act = DefenseAct.objects.get(id=defense_act.id)
    assert retrieved_defense_act == defense_act


@pytest.mark.django_db
def test_update_defense_act(defense_act):
    """Verifica que se pueda actualizar un acto de defensa."""
    defense_act.name = "Defensa Actualizada"
    defense_act.save()

    updated_defense_act = DefenseAct.objects.get(id=defense_act.id)
    assert updated_defense_act.name == "Defensa Actualizada"


@pytest.mark.django_db
def test_destroy_defense_act(student_user, professor_user):
    """Verifica que se pueda eliminar un acto de defensa."""
    defense_act = DefenseAct.objects.create(
        student=student_user,
        author=professor_user,
        name="Defensa Test",
        description="Descripción específica",
        attachment="defense_acts/attachments/test_file.pdf"
    )

    defense_act.save()
    defense_act_id = defense_act.id
    defense_act.delete()

    assert not DefenseAct.objects.filter(id=defense_act_id).exists()


@pytest.mark.django_db
def test_list_defense_act(student_user, professor_user, defense_act):
    """Verifica que se puedan listar múltiples actos de defensa."""
    DefenseAct.objects.create(
        student=student_user,
        author=professor_user,
        name="Defensa 2",
        description="Descripción 2",
        attachment="defense_acts/attachments/test_file2.pdf"
    )

    defense_acts = DefenseAct.objects.all()
    assert defense_acts.count() == 2


@pytest.mark.django_db
def test_create_defense_act_without_description(student_user, professor_user):
    """Verifica que se pueda crear un acta de defensa sin descripción."""
    defense_act = DefenseAct.objects.create(
        student=student_user,
        author=professor_user,
        name="Defensa sin descripción",
        description=None,
        attachment="defense_acts/attachments/test_file.pdf"
    )
    assert defense_act.description is None
