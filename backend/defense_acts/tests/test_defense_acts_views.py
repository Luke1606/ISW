import pytest
from django.urls import reverse
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from core.management.utils.constants import Datatypes
from defense_acts.models import DefenseAct
from defense_acts.tests.tests_defense_acts_models import defense_act
from users.tests.test_users_views import student_authenticate_client, professor_authenticate_client, dpto_inf_authenticate_client, decan_authenticate_client
from users.tests.tests_users_models import student_user, professor_user, dpto_inf_user, decan_user


def get_defense_act_url(pk):
    """Obtiene la URL para acceder a un acta de defensa."""
    return reverse('gateway-specific', kwargs={'datatype': Datatypes.defense_act, 'pk': pk})


def get_defense_act_general_url():
    """Obtiene la URL para listar o eliminar actas de defensa."""
    return reverse('gateway', kwargs={'datatype': Datatypes.defense_act})


# ********************************CREATE***************************************************************************
@pytest.mark.django_db
def test_defense_act_viewset_create_professor(professor_authenticate_client, student_user, professor_user):
    """Verifica que un profesor pueda crear un acta de defensa."""
    url = get_defense_act_general_url()

    file_mock = SimpleUploadedFile(
        "test_file.pdf",
        b"contenido de prueba del archivo",
        content_type="application/pdf"
    )

    data = {
        'student': str(student_user.id.id),
        'author': str(professor_user.id.id),
        'name': "Nueva Acta",
        'description': "Descripción nueva",
    }
    response = professor_authenticate_client.post(
        url, data=data,
        files={'attachment': file_mock},
    )
    assert response.status_code == status.HTTP_201_CREATED
    assert DefenseAct.objects.count() == 1

    created_defense_act = DefenseAct.objects.get()
    assert created_defense_act.name == "Nueva Acta"
    assert created_defense_act.description == "Descripción nueva"
    assert created_defense_act.attachment.name is not None


@pytest.mark.django_db
def test_defense_act_viewset_create_unauthorized_dpto_inf(dpto_inf_authenticate_client, student_user, dpto_inf_user):
    """Verifica que un miembro del dpto inf no pueda crear un acta de defensa."""
    url = get_defense_act_general_url()

    file_mock = SimpleUploadedFile(
        "test_file.pdf",
        b"contenido de prueba del archivo",
        content_type="application/pdf"
    )

    data = {
        'student': str(student_user.id.id),
        'author': str(dpto_inf_user.id.id),
        'name': "Nueva Acta",
        'description': "Descripción nueva",
    }

    response = dpto_inf_authenticate_client.post(
        url, data=data,
        files={'attachment': file_mock},
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_defense_act_viewset_create_unauthorized_decan(decan_authenticate_client, student_user, decan_user):
    """Verifica que un decano no pueda crear un acta de defensa."""
    url = get_defense_act_general_url()

    file_mock = SimpleUploadedFile(
        "test_file.pdf",
        b"contenido de prueba del archivo",
        content_type="application/pdf"
    )

    data = {
        'student': str(student_user.id.id),
        'author': str(decan_user.id.id),
        'name': "Nueva Acta",
        'description': "Descripción nueva",
    }

    response = decan_authenticate_client.post(
        url, data=data,
        files={'attachment': file_mock},
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_defense_act_viewset_create_unauthorized_student(student_authenticate_client, student_user):
    """Verifica que un estudiante no pueda crear un acta de defensa."""
    url = get_defense_act_general_url()

    file_mock = SimpleUploadedFile(
        "test_file.pdf",
        b"contenido de prueba del archivo",
        content_type="application/pdf"
    )

    data = {
        'student': str(student_user.id.id),
        'author': str(student_user.id.id),
        'name': "Nueva Acta",
        'description': "Descripción nueva",
    }

    response = student_authenticate_client.post(
        url, data=data,
        files={'attachment': file_mock},
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN


# ********************************RETRIEVE***************************************************************************
@pytest.mark.django_db
def test_defense_act_viewset_retrieve_professor(professor_authenticate_client, defense_act):
    """Verifica que un profesor pueda obtener un acta de defensa."""
    url = get_defense_act_url(defense_act.id)
    response = professor_authenticate_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()['name'] == defense_act.name


@pytest.mark.django_db
def test_defense_act_viewset_retrieve_dpto_inf(dpto_inf_authenticate_client, defense_act):
    """Verifica que un miembro del dpto inf pueda obtener un acta de defensa."""
    url = get_defense_act_url(defense_act.id)
    response = dpto_inf_authenticate_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()['name'] == defense_act.name


@pytest.mark.django_db
def test_defense_act_viewset_retrieve_decan(decan_authenticate_client, defense_act):
    """Verifica que un decano pueda obtener un acta de defensa."""
    url = get_defense_act_url(defense_act.id)
    response = decan_authenticate_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()['name'] == defense_act.name


@pytest.mark.django_db
def test_defense_act_viewset_retrieve_unauthorized_student(student_authenticate_client, defense_act):
    """Verifica que un estudiante no pueda obtener un acta de defensa."""
    url = get_defense_act_url(defense_act.id)
    response = student_authenticate_client.get(url)
    assert response.status_code == status.HTTP_403_FORBIDDEN


# ********************************UPDATE***************************************************************************
@pytest.mark.django_db
def test_defense_act_viewset_update_professor(professor_authenticate_client, defense_act):
    """Verifica que un profesor pueda actualizar un acta de defensa."""
    url = get_defense_act_url(defense_act.id)

    file_mock = SimpleUploadedFile(
        "test_file.pdf",
        b"contenido de prueba del archivo",
        content_type="application/pdf"
    )

    data = {
        'student': str(defense_act.student.id.id),
        'author': str(defense_act.author.id.id),
        'name': "Acta Actualizada",
        'description': "Descripción actualizada",
    }

    response = professor_authenticate_client.put(
        url, data=data,
        files={'attachment': file_mock},
    )
    assert response.status_code == status.HTTP_200_OK
    defense_act.refresh_from_db()
    assert defense_act.name == "Acta Actualizada"


@pytest.mark.django_db
def test_defense_act_viewset_update_unauthorized_dpto_inf(dpto_inf_authenticate_client, defense_act):
    """Verifica que un miembro del dpto inf no pueda actualizar un acta de defensa."""
    url = get_defense_act_url(defense_act.id)

    file_mock = SimpleUploadedFile(
        "test_file.pdf",
        b"contenido de prueba del archivo",
        content_type="application/pdf"
    )

    data = {
        'student': str(defense_act.student.id.id),
        'author': str(defense_act.author.id.id),
        'name': "Acta Actualizada",
        'description': "Descripción actualizada",
    }

    response = dpto_inf_authenticate_client.put(
        url, data=data,
        files={'attachment': file_mock},
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_defense_act_viewset_unauthorized_decan(decan_authenticate_client, defense_act):
    """Verifica que un decano no pueda actualizar un acta de defensa."""
    url = get_defense_act_url(defense_act.id)

    file_mock = SimpleUploadedFile(
        "test_file.pdf",
        b"contenido de prueba del archivo",
        content_type="application/pdf"
    )

    data = {
        'student': str(defense_act.student.id.id),
        'author': str(defense_act.author.id.id),
        'name': "Acta Actualizada",
        'description': "Descripción actualizada",
    }

    response = decan_authenticate_client.put(
        url, data=data,
        files={'attachment': file_mock},
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_defense_act_viewset_update_unauthorized_student(student_authenticate_client, defense_act):
    """Verifica que un estudiante no pueda actualizar un acta de defensa."""
    url = get_defense_act_url(defense_act.id)

    file_mock = SimpleUploadedFile(
        "test_file.pdf",
        b"contenido de prueba del archivo",
        content_type="application/pdf"
    )

    data = {
        'student': str(defense_act.student.id.id),
        'author': str(defense_act.author.id.id),
        'name': "Acta Actualizada",
        'description': "Descripción actualizada",
    }

    response = student_authenticate_client.put(
        url, data=data,
        files={'attachment': file_mock},
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN


# ********************************DESTROY***************************************************************************
@pytest.mark.django_db
def test_defense_act_viewset_destroy_professor(professor_authenticate_client, defense_act):
    """Verifica que un profesor pueda eliminar un acta de defensa."""
    url = get_defense_act_general_url()
    response = professor_authenticate_client.delete(url, params={'ids': [str(defense_act.id)]})
    assert response.status_code == status.HTTP_200_OK
    assert DefenseAct.objects.count() == 0


@pytest.mark.django_db
def test_defense_act_viewset_destroy_unauthorized_dpto_inf(dpto_inf_authenticate_client, defense_act):
    """Verifica que un miembro del dpto inf no pueda eliminar un acta de defensa."""
    url = get_defense_act_general_url()
    response = dpto_inf_authenticate_client.delete(url, params={'ids': [str(defense_act.id)]})
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_defense_act_viewset_destroy_unauthorized_decan(decan_authenticate_client, defense_act):
    """Verifica que un decano no pueda eliminar un acta de defensa."""
    url = get_defense_act_general_url()
    response = decan_authenticate_client.delete(url, params={'ids': [str(defense_act.id)]})
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_defense_act_viewset_destroy_unauthorized_student(student_authenticate_client, defense_act):
    """Verifica que un estudiante no pueda eliminar un acta de defensa."""
    url = get_defense_act_general_url()
    response = student_authenticate_client.delete(url, params={'ids': [str(defense_act.id)]})
    assert response.status_code == status.HTTP_403_FORBIDDEN


# ********************************LIST***************************************************************************
@pytest.mark.django_db
def test_defense_act_viewset_list_professor(professor_authenticate_client, defense_act):
    """Verifica que un profesor pueda listar actas de defensa."""
    url = get_defense_act_general_url()
    response = professor_authenticate_client.get(url)
    assert response.status_code == status.HTTP_200_OK

    response_data = response.json()
    assert response_data['total_pages'] == 1
    print(response_data)
    data_list = response_data['data']['0']
    assert len(data_list) == 1
    assert data_list[0]['name'] == defense_act.name


@pytest.mark.django_db
def test_defense_act_viewset_list_dpto_inf(dpto_inf_authenticate_client, defense_act):
    """Verifica que un miembro del dpto inf pueda listar actas de defensa."""
    url = get_defense_act_general_url()
    response = dpto_inf_authenticate_client.get(url)
    assert response.status_code == status.HTTP_200_OK

    response_data = response.json()
    assert response_data['total_pages'] == 1
    print(response_data)
    data_list = response_data['data']['0']
    assert len(data_list) == 1
    assert data_list[0]['name'] == defense_act.name


@pytest.mark.django_db
def test_defense_act_viewset_list_decan(decan_authenticate_client, defense_act):
    """Verifica que un decano pueda listar actas de defensa."""
    url = get_defense_act_general_url()
    response = decan_authenticate_client.get(url)
    assert response.status_code == status.HTTP_200_OK

    response_data = response.json()
    assert response_data['total_pages'] == 1
    print(response_data)
    data_list = response_data['data']['0']
    assert len(data_list) == 1
    assert data_list[0]['name'] == defense_act.name


@pytest.mark.django_db
def test_defense_act_viewset_list_unauthorized_student(student_authenticate_client):
    """Verifica que un estudiante no pueda listar actas de defensa."""
    url = get_defense_act_general_url()
    response = student_authenticate_client.get(url)
    assert response.status_code == status.HTTP_403_FORBIDDEN
