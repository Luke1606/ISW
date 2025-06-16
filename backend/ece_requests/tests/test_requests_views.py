import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied
from core.management.utils.constants import Datatypes
from .tests_requests_models import test_update_request_state, request_instance
from users.models import Professor, Student
from users.tests.tests_users_models import student_user, professor_user, dpto_inf_user, decan_user
from users.tests.test_users_views import student_authenticate_client, professor_authenticate_client, dpto_inf_authenticate_client, decan_authenticate_client
from defenses_tribunals.models import DefenseTribunal
from defenses_tribunals.tests.tests_defenses_tribunals_models import defense_tribunal, professors
from ece_requests.models import Request


def get_request_url(id):
    """Obtiene la URL para acceder a una solicitud."""
    return reverse('gateway-specific', kwargs={'datatype': Datatypes.request, 'pk': id})


def get_request_general_url():
    """Obtiene la URL para listar y eliminar solicitudes."""
    return reverse('gateway', kwargs={'datatype': Datatypes.request})


@pytest.mark.django_db
def test_request_viewset_valid_create(student_authenticate_client, student_user):
    """
    Verifica que un estudiante pueda registrar correctamente una solicitud
    """
    url = get_request_general_url()
    data = {
        'student': str(student_user.id.id),
        'selected_ece': Request.ECE.TD
    }
    response = student_authenticate_client.post(url, json=data)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()['selected_ece'] == Request.ECE.TD


@pytest.mark.django_db
def test_request_viewset_invalid_create(student_authenticate_client, request_instance, student_user):
    """
    Verifica que no se puedan enviar más solicitudes a menos que la anterior esté denegada.
    """
    url = get_request_general_url()
    data = {
        'student': str(student_user.id.id),
        'selected_ece': Request.ECE.TD
    }
    response = student_authenticate_client.post(url, json=data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == ["No puedes registrar otra solicitud mientras una previa esté en estado Pendiente o si está Aprobada."]


@pytest.mark.django_db
def test_request_viewset_valid_create_unauthorized(professor_authenticate_client, student_user):
    """
    Verifica que nadie que no sea un estudiante pueda registrar una solicitud.
    """
    url = get_request_general_url()
    data = {
        'student': str(student_user.id.id),
        'selected_ece': Request.ECE.TD
    }
    response = professor_authenticate_client.post(url, json=data)
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_request_viewset_update_valid_state(dpto_inf_authenticate_client, request_instance, test_update_request_state):
    """
    Verifica que un dptoInf se le pueda cambiar el estado a una solicitud pendiente.
    """
    url = get_request_url(request_instance.id)
    data = {
        'state': Request.State.APPROVED
    }
    response = dpto_inf_authenticate_client.put(url, json=data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == ['No puede darle un veredicto a una solicitud que ya lo tiene.']


@pytest.mark.django_db
def test_request_viewset_update_valid_state_unauthorized(professor_authenticate_client, request_instance):
    """
    Verifica que nadie que no sea un dptoInf pueda cambiar el estado a una solicitud pendiente.
    """
    url = get_request_url(request_instance.id)
    data = {
        'state': Request.State.APPROVED
    }
    response = professor_authenticate_client.put(url, json=data)
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_request_viewset_update_invalid_field(request_instance, dpto_inf_authenticate_client):
    """
    Verifica que no se pueda cambiar otro campo que no sea el estado.
    """
    url = get_request_url(request_instance.id)
    data = {
        'selected_ece': Request.ECE.AA
    }
    response = dpto_inf_authenticate_client.put(url, json=data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == ["Solo se permite modificar el estado de la solicitud."]


@pytest.mark.django_db
def test_request_viewset_update_valid_state_with_tribunal(request_instance, defense_tribunal, dpto_inf_authenticate_client):
    """
    Verifica que no se pueda aprobar una solicitud si el estudiante ya tiene un tribunal asociado.
    """
    url = get_request_url(request_instance.id)
    data = {
        'state': Request.State.APPROVED
    }
    response = dpto_inf_authenticate_client.put(url, json=data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == ["Ya existe un tribunal asociado a este estudiante."]


# ********************************DESTROY***************************************************************************
@pytest.mark.django_db
def test_request_viewset_destroy_professor(decan_authenticate_client, request_instance):
    """Verifica que un ningún usuario pueda eliminar solicitudes."""
    url = get_request_general_url()
    response = decan_authenticate_client.delete(url, params={'ids': [str(request_instance.id)]})
    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED


# ********************************LIST***************************************************************************
@pytest.mark.django_db
def test_request_viewset_list(decan_authenticate_client):
    """Verifica que ningún usuario pueda listar solicitudes."""
    url = get_request_general_url()
    response = decan_authenticate_client.get(url)
    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
