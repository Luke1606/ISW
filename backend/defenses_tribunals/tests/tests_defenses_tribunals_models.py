import pytest
from defenses_tribunals.models import DefenseTribunal, Datatypes
from users.models import CustomUser
from ece_requests.models import Request
from users.tests.tests_users_models import student_user
from notifications.models import Notification


@pytest.fixture
def professors(db):
    """Crea múltiples profesores para pruebas de tribunales de defensa."""
    roles = ["president", "secretary", "vocal", "opponent", "tutor1", "tutor2"]
    professors = {}

    for role in roles:
        professor = CustomUser.objects.create_user_by_role(
            role=Datatypes.User.professor,
            username=f"professor_{role}",
            name=f"Profesor {role.capitalize()}"
        )
        professor.save()
        professors[role] = professor

    yield professors

    for professor in professors.values():
        professor.delete()


@pytest.fixture
def defense_tribunal(db, student_user, professors):
    """Crea un tribunal de defensa correctamente configurado."""
    tribunal = DefenseTribunal.objects.create(
        student=student_user,
        defense_date="2025-06-25",
        selected_ece=Request.ECE.TD,
        president=professors["president"],
        secretary=professors["secretary"],
        vocal=professors["vocal"],
        opponent=professors["opponent"],
    )
    tribunal.tutors.add(professors["tutor1"], professors["tutor2"])
    tribunal.save()

    assert tribunal.id is not None
    assert tribunal.student == student_user
    assert tribunal.president == professors["president"]
    assert tribunal.secretary == professors["secretary"]
    assert tribunal.vocal == professors["vocal"]
    assert tribunal.opponent == professors["opponent"]
    assert tribunal.state == DefenseTribunal.State.PENDING
    assert tribunal.tutors.count() == 2

    # last_notification = Notification.objects.all().last()
    # assert last_notification.title == 'Tribunal configurado'
    # assert last_notification.message == f"El tribunal del estudiante {student_user.id.name} ya está listo para ser revisado."

    yield tribunal
    tribunal.delete()


@pytest.mark.django_db
def test_retrieve_defense_tribunal(defense_tribunal):
    """Verifica que se pueda obtener un tribunal de defensa existente."""
    retrieved_tribunal = DefenseTribunal.objects.get(id=defense_tribunal.id)
    assert retrieved_tribunal == defense_tribunal


@pytest.fixture
def test_update_defense_tribunal(defense_tribunal):
    """Verifica que se pueda actualizar el estado de un tribunal."""
    defense_tribunal.state = DefenseTribunal.State.APPROVED
    defense_tribunal.save()

    updated_tribunal = DefenseTribunal.objects.get(id=defense_tribunal.id)
    assert updated_tribunal.state == DefenseTribunal.State.APPROVED

    # notifications = Notification.objects.all()

    # before_notification = notifications.reverse()[2]
    # bef_message = f"El tribunal del estudiante {defense_tribunal.student.id.name} fue declarado {defense_tribunal.get_state_display()}."
    # assert before_notification.title == 'Cambio de estado de tribunal'
    # assert before_notification.message == bef_message

    # after_notification = notifications.last()
    # after_message = "Los datos de su tribunal y de su defensa han sido decididos, recuerde consultarlos."
    # assert after_notification.title == 'Tribunal y defensa definidos'
    # assert after_notification.message == after_message


@pytest.mark.django_db
def test_destroy_defense_tribunal(student_user, professors):
    """Verifica que se pueda eliminar un tribunal de defensa."""
    tribunal = DefenseTribunal.objects.create(
        student=student_user,
        defense_date="2025-06-15",
        selected_ece=Request.ECE.TD,
        president=professors["president"],
        secretary=professors["secretary"],
        vocal=professors["vocal"],
        opponent=professors["opponent"],
    )
    tribunal.tutors.add(professors["tutor1"], professors["tutor2"])
    tribunal.save()

    tribunal_id = tribunal.id
    tribunal.delete()

    assert not DefenseTribunal.objects.filter(id=tribunal_id).exists()