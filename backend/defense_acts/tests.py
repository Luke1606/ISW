import pytest
from core.management.utils.constants import Datatypes
from users.models import Student
from .models import DefenseAct


@pytest.mark.django_db
def test_create_defense_act():
    """Verifica que se pueda crear un acto de defensa correctamente."""
    student = Student.objects.create_user_by_role(
        role=Datatypes.User.student,
        username="student_test",
        name="Estudiante Prueba",
        group=1,
        faculty=Student.Faculties.FTI
    )
    defense_act = DefenseAct.objects.create(
        student=student,
        name="Defensa Test",
        description="Descripción específica",
        attachment="defense_acts/attachments/test_file.pdf"
    )

    assert defense_act.name == "Defensa Test"
    assert defense_act.description == "Descripción específica"
    assert defense_act.student == student


@pytest.mark.django_db
def test_retrieve_defense_act():
    """Verifica que se pueda obtener un acto de defensa existente."""
    student = Student.objects.create_user_by_role(
        role=Datatypes.User.student,
        username="student_test",
        name="Estudiante Prueba",
        group=1,
        faculty=Student.Faculties.FTI
    )
    defense_act = DefenseAct.objects.create(
        student=student,
        name="Defensa Test",
        description="Descripción específica",
        attachment="defense_acts/attachments/test_file.pdf"
    )

    retrieved_defense_act = DefenseAct.objects.get(id=defense_act.id)
    assert retrieved_defense_act == defense_act


@pytest.mark.django_db
def test_update_defense_act():
    """Verifica que se pueda actualizar un acto de defensa."""
    student = Student.objects.create_user_by_role(
        role=Datatypes.User.student,
        username="student_test",
        name="Estudiante Prueba",
        group=1,
        faculty=Student.Faculties.FTI
    )
    defense_act = DefenseAct.objects.create(
        student=student,
        name="Defensa Test",
        description="Descripción específica",
        attachment="defense_acts/attachments/test_file.pdf"
    )

    defense_act.name = "Defensa Actualizada"
    defense_act.save()

    updated_defense_act = DefenseAct.objects.get(id=defense_act.id)
    assert updated_defense_act.name == "Defensa Actualizada"


@pytest.mark.django_db
def test_destroy_defense_act():
    """Verifica que se pueda eliminar un acto de defensa."""
    student = Student.objects.create_user_by_role(
        role=Datatypes.User.student,
        username="student_test",
        name="Estudiante Prueba",
        group=1,
        faculty=Student.Faculties.FTI
    )
    defense_act = DefenseAct.objects.create(
        student=student,
        name="Defensa Test",
        description="Descripción específica",
        attachment="defense_acts/attachments/test_file.pdf"
    )

    defense_act_id = defense_act.id
    defense_act.delete()

    assert not DefenseAct.objects.filter(id=defense_act_id).exists()


@pytest.mark.django_db
def test_list_defense_act():
    """Verifica que se puedan listar múltiples actos de defensa."""
    student = Student.objects.create_user_by_role(
        role=Datatypes.User.student,
        username="student_test",
        name="Estudiante Prueba",
        group=1,
        faculty=Student.Faculties.FTI
    )
    DefenseAct.objects.create(
        student=student,
        name="Defensa 1",
        description="Descripción 1",
        attachment="defense_acts/attachments/test_file1.pdf"
    )
    DefenseAct.objects.create(
        student=student,
        name="Defensa 2",
        description="Descripción 2",
        attachment="defense_acts/attachments/test_file2.pdf"
    )

    defense_acts = DefenseAct.objects.all()
    assert defense_acts.count() == 2
