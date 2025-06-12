import pytest
from users.models import CustomUser, Student
from core.management.utils.constants import Datatypes


@pytest.fixture
def student_user(db):
    """Crea un usuario de prueba con rol 'student'."""
    student = CustomUser.objects.create_user_by_role(
        role=Datatypes.User.student,
        name="Estudiante Prueba",
        username="student100",
        password="Password1.",
        group=1,
        faculty=Student.Faculties.FTI
    )
    user = student.id
    assert user.name == "Estudiante Prueba"
    assert user.username == "student100"
    assert user.is_student is True
    assert user.is_professor is False
    assert user.user_role == Datatypes.User.student
    yield student  # Retorna el usuario para usarlo en otras pruebas
    student.delete()


@pytest.fixture
def professor_user(db):
    """Crea un usuario de prueba con rol 'professor'"""
    professor = CustomUser.objects.create_user_by_role(
        role=Datatypes.User.professor,
        username="professor100",
        name="Profesor Prueba"
    )
    user = professor.id
    assert user.username == "professor100"
    assert user.is_professor is True
    assert user.is_student is False
    assert user.user_role == Datatypes.User.professor
    yield professor  # Retorna el usuario para usarlo en otras pruebas
    professor.delete()


@pytest.fixture
def dpto_inf_user(db):
    """Crea un usuario de prueba con rol 'dptoInf'"""
    professor = CustomUser.objects.create_user_by_role(
        role=Datatypes.User.dptoInf,
        username="dptoInf100",
        name="Dpto Informatica Prueba"
    )
    user = professor.id
    assert user.username == "Dpto Informatica Prueba"
    assert user.username == "dptoInf100"
    assert user.is_professor is True
    assert user.is_student is False
    assert user.user_role == Datatypes.User.dptoInf
    yield professor  # Retorna el usuario para usarlo en otras pruebas
    professor.delete()


@pytest.fixture
def decan_user(db):
    """Crea un usuario de prueba con rol 'decan'"""
    professor = CustomUser.objects.create_user_by_role(
        role=Datatypes.User.dptoInf,
        username="decan100",
        name="Decano Prueba"
    )
    user = professor.id
    assert user.username == "Decano Prueba"
    assert user.username == "decan100"
    assert user.is_professor is True
    assert user.is_student is False
    assert user.user_role == Datatypes.User.decan
    yield professor  # Retorna el usuario para usarlo en otras pruebas
    professor.delete()


@pytest.mark.django_db
def test_create_user_missing_username():
    """Verifica que la creación de usuario falle si falta 'username'"""
    with pytest.raises(ValueError, match='El campo "username" es obligatorio'):
        CustomUser.objects.create_user_by_role(
            role=Datatypes.User.student,
            name="Fallo",
            group=1,
            faculty=Student.Faculties.FTI
        )


@pytest.mark.django_db
def test_create_user_missing_group():
    """Verifica que la creación de usuario falle si falta 'group'"""
    with pytest.raises(ValueError, match='El campo "grupo" es obligatorio para estudiantes.'):
        CustomUser.objects.create_user_by_role(
            role=Datatypes.User.student,
            name="Fallo",
            username="username",
            faculty=Student.Faculties.FTI
        )


@pytest.mark.django_db
def test_create_user_missing_faculty():
    """Verifica que la creación de usuario falle si falta 'faculty'"""
    with pytest.raises(ValueError, match='El campo "facultad" es obligatorio para estudiantes.'):
        CustomUser.objects.create_user_by_role(
            role=Datatypes.User.student,
            name="Fallo",
            username="username",
            group=1
        )


@pytest.mark.django_db
def test_change_password():
    """Verifica que el usuario pueda cambiar su contraseña"""
    professor = CustomUser.objects.create_user_by_role(
        role=Datatypes.User.professor,
        username="test user",
        name="Usuario Prueba"
    )
    user = professor.id
    user.change_password("New_secure_password1.")

    assert user.password_changed is True
    assert user.check_password("New_secure_password1.") is True


@pytest.mark.django_db
def test_get_related_students_ids():
    """Verifica que un profesor pueda obtener sus estudiantes relacionados"""
    professor = CustomUser.objects.create_user_by_role(
        role=Datatypes.User.professor,
        username="prof user",
        name="Profesor Prueba"
    )

    related_students = professor.get_related_students_ids()
    assert isinstance(related_students, list)  # Verifica que retorna una lista
