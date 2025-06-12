import pytest
import httpx
from rest_framework import status
from .tests_users_models import student_user
from users.serializers import CustomUserSerializer


@pytest.fixture
def correct_authenticate_client(live_server, student_user):
    """Autentica el usuario de prueba y retorna un cliente HTTP con el token."""
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


def test_refresh_access_token(correct_authenticate_client):
    response = correct_authenticate_client.post("/users/token/refresh/")
    assert response.status_code == status.HTTP_200_OK
    print(response.json())
    # Se obtiene el nuevo token de access
    access_token = response.json().get("access")
    assert access_token is not None


def test_blacklist_access_token(correct_authenticate_client):
    response = correct_authenticate_client.post("/users/token/blacklist/")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {'message': 'Sesión cerrada con éxito'}


def test_get_session(correct_authenticate_client, student_user):
    response = correct_authenticate_client.get("/users/token/session/")
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


def test_refresh_token_invalid(correct_authenticate_client):
    correct_authenticate_client.cookies.set(
        name='refresh_token',
        value='invalid_token',
        path='/'
    )

    response = correct_authenticate_client.post("/users/token/refresh/")
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
