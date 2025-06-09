import pytest
#from rest_framework.test import APITestCase
#from rest_framework import status
from users.models import CustomUser, Student
from core.management.utils.constants import Datatypes
from users.serializers import CustomUserSerializer, StudentSerializer, ProfessorSerializer


# Models
@pytest.mark.django_db
def test_create_user_by_role_student():
    """Verifica que se pueda crear un usuario con rol 'student' correctamente"""
    student = CustomUser.objects.create_user_by_role(
        role=Datatypes.User.student,
        name="Estudiante Prueba",
        username="student100",
        group=1,
        faculty=Student.Faculties.FTI
    )
    user = student.id
    assert user.username == "student100"
    assert user.is_student is True
    assert user.user_role == Datatypes.User.student


@pytest.mark.django_db
def test_create_user_by_role_professor():
    """Verifica que se pueda crear un usuario con rol 'professor' correctamente"""
    professor = CustomUser.objects.create_user_by_role(
        role=Datatypes.User.professor,
        username="professor100",
        name="Profesor Prueba"
    )

    user = professor.id
    assert user.username == "professor100"
    assert user.is_professor is True
    assert user.user_role == Datatypes.User.professor


@pytest.mark.django_db
def test_create_user_by_role_dpto_inf():
    """Verifica que se pueda crear un usuario con rol 'dptoInf' correctamente"""
    professor = CustomUser.objects.create_user_by_role(
        role=Datatypes.User.dptoInf,
        username="professor100",
        name="Profesor Prueba"
    )

    user = professor.id
    assert user.username == "professor100"
    assert user.is_professor is True
    assert user.user_role == Datatypes.User.dptoInf


@pytest.mark.django_db
def test_create_user_by_role_decan():
    """Verifica que se pueda crear un usuario con rol 'decan' correctamente"""
    professor = CustomUser.objects.create_user_by_role(
        role=Datatypes.User.decan,
        username="professor100",
        name="Profesor Prueba"
    )

    user = professor.id
    assert user.username == "professor100"
    assert user.is_professor is True
    assert user.user_role == Datatypes.User.decan


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
    with pytest.raises(ValueError, match='El campo "group" es obligatorio'):
        CustomUser.objects.create_user_by_role(
            role=Datatypes.User.student,
            name="Fallo",
            username="username",
            faculty=Student.Faculties.FTI
        )


@pytest.mark.django_db
def test_create_user_missing_faculty():
    """Verifica que la creación de usuario falle si falta 'faculty'"""
    with pytest.raises(ValueError, match='El campo "faculty" es obligatorio'):
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


# Serializers
@pytest.mark.django_db
def test_custom_user_serializer():
    """Verifica que el serializer de CustomUser serializa correctamente"""
    student = CustomUser.objects.create_user_by_role(
        role=Datatypes.User.student,
        username="test user",
        name="Usuario Prueba"
    )
    user = student.id
    serializer = CustomUserSerializer(user)

    assert serializer.data["username"] == "testuser"
    assert serializer.data["name"] == "Usuario Test"
    assert serializer.data["user_role"] == "student"


@pytest.mark.django_db
def test_student_serializer():
    """Verifica que el serializer de Student serializa correctamente"""
    student = CustomUser.objects.create_user_by_role(
        role=Datatypes.User.student,
        username="test student",
        name="Estudiante Prueba",
        faculty="FTI",
        group=1
    )
    serializer = StudentSerializer(student)

    assert serializer.data["username"] == "student1"
    assert serializer.data["faculty"] == "FTI"
    assert serializer.data["group"] == 1


@pytest.mark.django_db
def test_professor_serializer():
    """Verifica que el serializer de Professor serializa correctamente"""
    professor = CustomUser.objects.create_user_by_role(
        role=Datatypes.User.professor,
        username="test professor",
        name="Profesor Prueba",
    )
    serializer = ProfessorSerializer(professor)

    assert serializer.data["username"] == "professor1"
    assert serializer.data["role"] == "professor"


# Views (Pruebas de APIs)
class AuthTestCase(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user_by_role(
            role=Datatypes.User.professor,
            username="testuser",
            name="Usuario Prueba",
            password="Password1.",
        )
        self.login_url = "/users/token/"

    def test_token_obtain(self):
        """Verificar si se obtiene el token correctamente."""
        response = self.client.post(
            self.login_url,
            {"username": "testuser", "password": "Password1."}
        )
       # assert response.status_code == status.HTTP_200_OK
        assert "access" in response.data

    def test_invalid_token(self):
        """Probar credenciales incorrectas."""
        response = self.client.post(
            self.login_url,
            {"username": "wronguser", "password": "wrongpassword"}
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_cookie_token_obtain(self):
        response = self.client.post(
            self.login_url,
            {"username": "testuser", "password": "Password1."}
        )

        assert response.status_code == status.HTTP_200_OK
        assert "access" in response.data
        assert response.cookies["refresh_token"].value is not None


# class TokenRefreshTestCase(APITestCase):
#     def setUp(self):
#         self.user = CustomUser.objects.create_user_by_role(
#             role=Datatypes.User.professor,
#             username="testuser",
#             name="Usuario Prueba",
#             password="Password1.",
#         )
#         self.login_url = "/users/token/"
#         self.refresh_url = f"{self.login_url}refresh/"

#         # Obtener tokens
#         response = self.client.post(
#             self.login_url,
#             {"username": "testuser", "password": "Password1."}
#         )
#         self.access_token = response.data["access"]
#         self.refresh_token = response.cookies["refresh_token"].value

#         # Configurar cookie manualmente para las siguientes peticiones
#         self.client.cookies["refresh_token"] = self.refresh_token

#     def test_refresh_token_valid(self):
#         response = self.client.post(self.refresh_url)
#         assert response.status_code == status.HTTP_200_OK
#         assert "access" in response.data
#         assert response.cookies["refresh_token"].value is not None

#     def test_refresh_token_invalid(self):
#         self.client.cookies["refresh_token"] = "invalid_token"
#         response = self.client.post(self.refresh_url)
#         assert response.status_code == status.HTTP_401_UNAUTHORIZED
#         assert response.data == {'error': 'Error al refrescar el token, el token de refresh no es válido.'}


# class TokenBlacklistTestCase(APITestCase):
#     def setUp(self):
#         self.user = CustomUser.objects.create_user_by_role(
#             role=Datatypes.User.professor,
#             username="testuser",
#             name="Usuario Prueba",
#             password="Password1.",
#         )
#         self.login_url = "/users/token/"
#         self.blacklist_url = f"{self.login_url}blacklist/"

#         # Obtener tokens
#         response = self.client.post(
#             self.login_url,
#             {"username": "testuser", "password": "Password1."}
#         )
#         self.access_token = response.data["access"]
#         self.refresh_token = response.cookies["refresh_token"].value

#         # Configurar cookie manualmente para las siguientes peticiones
#         self.client.cookies["refresh_token"] = self.refresh_token

#     def test_logout_success(self):
#         response = self.client.post(self.blacklist_url)
#         assert response.status_code == status.HTTP_200_OK
#         assert response.data == {"message": "Cierre de sesión exitoso."}
#         assert "refresh_token" not in response.cookies

#     def test_logout_no_token(self):
#         del self.client.cookies["refresh_token"]
#         response = self.client.post(self.blacklist_url)
#         assert response.status_code == status.HTTP_400_BAD_REQUEST
#         assert response.data == {"error": "No se encontró una sesión abierta."}
