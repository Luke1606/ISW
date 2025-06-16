import pytest
import httpx
from rest_framework import status
from django.urls import reverse
from core.management.utils.constants import Datatypes
from .tests_users_models import student_user, professor_user, decan_user, dpto_inf_user
from users.serializers import CustomUserSerializer


@pytest.fixture
def student_authenticate_client(live_server, student_user):
    """Autentica el usuario estudiante y retorna un cliente HTTP con el token."""
    client = httpx.Client(base_url=live_server.url)
    # Simulación de autenticación con un endpoint de login
    response = client.post(
        '/users/token/',
        data={"username": student_user.id.username, "password": "Password1."}
    )
    assert response.status_code == status.HTTP_200_OK
    # Se obtiene el token de access
    access_token = response.json().get("access")
    # Se obtiene el token de refresh
    refresh_token = response.cookies["refresh_token"]
    assert access_token is not None
    assert refresh_token is not None
    # Configurar el cliente autenticado
    client.headers.update({"Authorization": f"Bearer {access_token}"})
    return client


@pytest.fixture
def professor_authenticate_client(live_server, professor_user):
    """Autentica el usuario profesor y retorna un cliente HTTP con el token."""
    client = httpx.Client(base_url=live_server.url)
    # Simulación de autenticación con un endpoint de login
    response = client.post(
        '/users/token/',
        data={"username": professor_user.id.username, "password": "Password1."}
    )
    assert response.status_code == status.HTTP_200_OK
    # Se obtiene el token de access
    access_token = response.json().get("access")
    # Se obtiene el token de refresh
    refresh_token = response.cookies["refresh_token"]
    assert access_token is not None
    assert refresh_token is not None
    # Configurar el cliente autenticado
    client.headers.update({"Authorization": f"Bearer {access_token}"})
    return client


@pytest.fixture
def dpto_inf_authenticate_client(live_server, dpto_inf_user):
    """Autentica el usuario de prueba y retorna un cliente HTTP con el token."""
    client = httpx.Client(base_url=live_server.url)
    # Simulación de autenticación con un endpoint de login
    response = client.post(
        '/users/token/',
        data={"username": dpto_inf_user.id.username, "password": "Password1."}
    )
    assert response.status_code == status.HTTP_200_OK
    # Se obtiene el token de access
    access_token = response.json().get("access")
    # Se obtiene el token de refresh
    refresh_token = response.cookies["refresh_token"]
    assert access_token is not None
    assert refresh_token is not None
    # Configurar el cliente autenticado
    client.headers.update({"Authorization": f"Bearer {access_token}"})
    return client


@pytest.fixture
def decan_authenticate_client(live_server, decan_user):
    """Autentica el usuario decano y retorna un cliente HTTP con el token."""
    client = httpx.Client(base_url=live_server.url)
    # Simulación de autenticación con un endpoint de login
    response = client.post(
        '/users/token/',
        data={"username": decan_user.id.username, "password": "Password1."}
    )
    assert response.status_code == status.HTTP_200_OK
    # Se obtiene el token de access
    access_token = response.json().get("access")
    # Se obtiene el token de refresh
    refresh_token = response.cookies["refresh_token"]
    assert access_token is not None
    assert refresh_token is not None
    # Configurar el cliente autenticado
    client.headers.update({"Authorization": f"Bearer {access_token}"})
    return client


def test_refresh_access_token(student_authenticate_client):
    response = student_authenticate_client.post("/users/token/refresh/")
    assert response.status_code == status.HTTP_200_OK


    # Se obtiene el nuevo token de access
    access_token = response.json().get("access")
    assert access_token is not None


def test_blacklist_access_token(student_authenticate_client):
    response = student_authenticate_client.post("/users/token/blacklist/")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {'message': 'Sesión cerrada con éxito'}


def test_get_session(student_authenticate_client, student_user):
    response = student_authenticate_client.get("/users/token/session/")
    assert response.status_code == status.HTTP_200_OK

    user_info = response.json()
    expected_user_info = CustomUserSerializer(student_user.id).data
    assert user_info == expected_user_info


def test_invalid_token(live_server):
    """Probar credenciales incorrectas."""
    client = httpx.Client(base_url=live_server.url)

    response = client.post(
        '/users/token/',
        data={"username": "wrong_username", "password": "wrong_password."}
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_refresh_token_invalid(student_authenticate_client):
    student_authenticate_client.cookies.set(
        name='refresh_token',
        value='invalid_token',
        path='/'
    )

    response = student_authenticate_client.post("/users/token/refresh/")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail': 'Token is invalid', 'code': 'token_not_valid'}


def test_refresh_token_without_login(live_server):
    client = httpx.Client(base_url=live_server.url)
    response = client.post("/users/token/refresh/")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'error': 'No se encontró token de refresh válido. Inicie sesión nuevamente.'}


def test_blacklist_access_token_without_login(live_server):
    client = httpx.Client(base_url=live_server.url)
    response = client.post("/users/token/blacklist/")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {'error': 'No se encontró sesión activa'}


def get_user_url(isProfessor, id):
    """Obtiene la URL para acceder a un estudiante."""
    return reverse('gateway-specific', kwargs={'datatype': Datatypes.User.professor if isProfessor else Datatypes.User.student, 'pk': id})


def get_user_general_url(isProfessor):
    """Obtiene la URL para listar y eliminar estudiantes."""
    return reverse('gateway', kwargs={'datatype': Datatypes.User.professor if isProfessor else Datatypes.User.student})


# ********************************CREATE***************************************************************************
def get_user_url(isProfessor, id):
    """Obtiene la URL para acceder a un estudiante."""
    return reverse('gateway-specific', kwargs={'datatype': Datatypes.User.professor if isProfessor else Datatypes.User.student, 'pk': id})


def get_user_general_url(isProfessor):
    """Obtiene la URL para listar y eliminar estudiantes."""
    return reverse('gateway', kwargs={'datatype': Datatypes.User.professor if isProfessor else Datatypes.User.student})


# ********************************CREATE***************************************************************************
@pytest.mark.django_db
def test_create_user_invalid_data(decan_authenticate_client):
    """Verifica que no se pueda crear un usuario con datos inválidos."""
    url = get_user_general_url(False)
    url = get_user_general_url(False)
    data = {
        'username': '',  # Username vacío
        'name': 'Test Student',
        'group': 1,
        'faculty': 'FTI'
    }
    response = decan_authenticate_client.post(url, json=data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "error" in response.json()


@pytest.mark.django_db
def test_manage_user_student_unauthorized(professor_user, student_authenticate_client):
    """Verifica que un estudiante no pueda gestionar usuarios."""
    url = get_user_general_url(False)
    data = {
        'username': 'asafsf',
        'name': 'Test Student',
        'group': 1,
        'faculty': 'FTI'
    }

    create_response = student_authenticate_client.post(url, json=data)
    assert create_response.status_code == status.HTTP_403_FORBIDDEN

    update_response = student_authenticate_client.put(
        url,
        json={**data, "id": str(professor_user.id.id)}
    )
    assert update_response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    list_response = student_authenticate_client.get(url)
    assert list_response.status_code == status.HTTP_403_FORBIDDEN

    delete_response = student_authenticate_client.delete(
        url,
        params={"ids": [professor_user.id]}
    )
    assert delete_response.status_code == status.HTTP_403_FORBIDDEN

    retrieve_response = student_authenticate_client.get(url)
    assert retrieve_response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_manage_user_professor_semi_authorized(professor_user, professor_authenticate_client):
    """Verifica que un profesor tenga permisos de solo lectura"""
    url = get_user_general_url(False)
    data = {
        'username': 'asafsf',
        'name': 'Test Student',
        'group': 1,
        'faculty': 'FTI'
    }

    create_response = professor_authenticate_client.post(url, json=data)
    assert create_response.status_code == status.HTTP_403_FORBIDDEN

    update_response = professor_authenticate_client.put(
        url,
        json={**data, "id": str(professor_user.id.id)}
    )
    assert update_response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    list_response = professor_authenticate_client.get(url)
    assert list_response.status_code == status.HTTP_200_OK

    delete_response = professor_authenticate_client.delete(
        url,
        params={"ids": [professor_user.id]}
    )
    assert delete_response.status_code == status.HTTP_403_FORBIDDEN

    retrieve_response = professor_authenticate_client.get(url)
    assert retrieve_response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_get_session_unauthenticated(live_server):
    """Verifica que un usuario no autenticado no pueda acceder a la información de sesión."""
    client = httpx.Client(base_url=live_server.url)
    url = "/users/token/session/"
    response = client.get(url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
