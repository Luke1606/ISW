import pytest
from django.urls import reverse
from rest_framework import status
from core.management.utils.constants import Datatypes
from users.tests.tests_users_models import student_user, professor_user, dpto_inf_user, decan_user
from users.tests.test_users_views import student_authenticate_client, professor_authenticate_client, dpto_inf_authenticate_client, decan_authenticate_client
from defenses_tribunals.models import DefenseTribunal
from defenses_tribunals.tests.tests_defenses_tribunals_models import defense_tribunal, professors, test_update_defense_tribunal
from ece_requests.models import Request


def get_defense_tribunal_url(id):
    """Obtiene la URL para acceder a un tribunala de defensa."""
    return reverse('gateway-specific', kwargs={'datatype': Datatypes.defense_tribunal, 'pk': id})


def get_defense_tribunal_general_url():
    """Obtiene la URL para listar y eliminar tribunalas de defensa."""
    return reverse('gateway', kwargs={'datatype': Datatypes.defense_tribunal})


# ********************************CREATE***************************************************************************
@pytest.mark.django_db
def test_defense_tribunal_viewset_create(decan_authenticate_client, student_user, professors):
    """Verifica que ningún usuario pueda crear un tribunal y defensa."""
    url = get_defense_tribunal_general_url()
    data = {
        'student': str(student_user.id.id),
        'defense_date': "2025-06-25",
        'selected_ece': Request.ECE.TD,
        'president': str(professors["president"].id.id),
        'secretary': str(professors["secretary"].id.id),
        'vocal': str(professors["vocal"].id.id),
        'opponent': str(professors["opponent"].id.id),
        'tutors': [str(professors["tutor1"].id.id), str(professors["tutor2"].id.id)]
    }
    response = decan_authenticate_client.post(url, json=data)
    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED


# ********************************RETRIEVE***************************************************************************
@pytest.mark.django_db
def test_defense_tribunal_viewset_retrieve_professor(professor_authenticate_client, defense_tribunal, test_update_defense_tribunal):
    """Verifica que un profesor pueda obtener un tribunal y defensa."""
    url = get_defense_tribunal_url(str(defense_tribunal.student.id.id))
    response = professor_authenticate_client.get(url)
    print(response.json())
    assert response.status_code == status.HTTP_200_OK
    assert response.json()['selected_ece'] == defense_tribunal.selected_ece


@pytest.mark.django_db
def test_defense_tribunal_viewset_retrieve_dpto_inf(dpto_inf_authenticate_client, defense_tribunal, test_update_defense_tribunal):
    """Verifica que un miembro del dpto inf pueda obtener un tribunal y defensa."""
    url = get_defense_tribunal_url(str(defense_tribunal.student.id.id))
    response = dpto_inf_authenticate_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()['selected_ece'] == defense_tribunal.selected_ece


@pytest.mark.django_db
def test_defense_tribunal_viewset_retrieve_decan(decan_authenticate_client, defense_tribunal, test_update_defense_tribunal):
    """Verifica que un decano pueda obtener un tribunal y defensa."""
    url = get_defense_tribunal_url(str(defense_tribunal.student.id.id))
    response = decan_authenticate_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()['selected_ece'] == defense_tribunal.selected_ece


@pytest.mark.django_db
def test_defense_tribunal_viewset_retrieve_student(student_authenticate_client, defense_tribunal, test_update_defense_tribunal):
    """Verifica que un estudiante pueda obtener un tribunal y defensa."""
    url = get_defense_tribunal_url(str(defense_tribunal.student.id.id))
    response = student_authenticate_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()['selected_ece'] == defense_tribunal.selected_ece


# ********************************UPDATE***************************************************************************
@pytest.mark.django_db
def test_defense_tribunal_viewset_update_members_dpto_inf(dpto_inf_authenticate_client, defense_tribunal):
    """Verifica que un miembro del dpto inf pueda actualizar los miembros de un tribunal y defensa."""
    url = get_defense_tribunal_url(str(defense_tribunal.id))
    secretary = defense_tribunal.secretary
    president = defense_tribunal.president
    data = {
        'student': str(defense_tribunal.student.id.id),
        'defense_date': "2025-06-29",
        'selected_ece': Request.ECE.TD,
        'president': str(defense_tribunal.secretary.id.id),  # Se intercambian el presidente y el secretario
        'secretary': str(defense_tribunal.president.id.id),
        'vocal': str(defense_tribunal.vocal.id.id),
        'opponent': str(defense_tribunal.opponent.id.id),
        'tutors': [str(tutor.id.id) for tutor in defense_tribunal.tutors.all()]
    }
    response = dpto_inf_authenticate_client.put(url, json=data)
    print(response.json())
    assert response.status_code == status.HTTP_200_OK
    defense_tribunal.refresh_from_db()
    assert str(defense_tribunal.defense_date) == "2025-06-29"
    assert defense_tribunal.president == secretary  # Se intercambian el presidente y el secretario
    assert defense_tribunal.secretary == president


@pytest.mark.django_db
def test_defense_tribunal_viewset_update_members_unauthorized_decan(decan_authenticate_client, defense_tribunal):
    """Verifica que un decano no pueda actualizar los miembros un tribunal y defensa."""
    url = get_defense_tribunal_url(str(defense_tribunal.id))
    data = {
        'student': str(defense_tribunal.student.id.id),
        'president': str(defense_tribunal.secretary.id.id),
        'secretary': str(defense_tribunal.president.id.id),
    }
    response = decan_authenticate_client.put(url, json=data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_defense_tribunal_viewset_update_state_decan(decan_authenticate_client, defense_tribunal):
    """Verifica que un decano pueda actualizar el estado de un tribunal y defensa."""
    url = get_defense_tribunal_url(str(defense_tribunal.id))
    data = {
        'student': str(defense_tribunal.student.id.id),
        'state': DefenseTribunal.State.APPROVED  # Se cambia el estado
    }
    response = decan_authenticate_client.put(url, json=data)
    print(response.json())
    assert response.status_code == status.HTTP_200_OK
    defense_tribunal.refresh_from_db()
    assert defense_tribunal.state == DefenseTribunal.State.APPROVED


@pytest.mark.django_db
def test_defense_tribunal_viewset_update_state_unauthorized_dpto_inf(dpto_inf_authenticate_client, defense_tribunal):
    """Verifica que un miembro del dpto inf no pueda actualizar el estado de un tribunal y defensa."""
    url = get_defense_tribunal_url(str(defense_tribunal.id))
    data = {
        'student': str(defense_tribunal.student.id.id),
        'defense_date': "2025-06-29",
        'selected_ece': Request.ECE.TD,
        'president': str(defense_tribunal.president.id.id),
        'secretary': str(defense_tribunal.secretary.id.id),
        'vocal': str(defense_tribunal.vocal.id.id),
        'opponent': str(defense_tribunal.opponent.id.id),
        'tutors': [str(tutor.id.id) for tutor in defense_tribunal.tutors.all()],
        'state': DefenseTribunal.State.APPROVED  # Se cambia el estado
    }
    response = dpto_inf_authenticate_client.put(url, json=data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_defense_tribunal_viewset_update_unauthorized_professor(professor_authenticate_client, defense_tribunal):
    """Verifica que un profesor no pueda actualizar un tribunal y defensa."""
    url = get_defense_tribunal_url(str(defense_tribunal.id))
    data = {
        'student': str(defense_tribunal.student.id.id),
        'defense_date': "2025-06-29",
        'selected_ece': Request.ECE.TD,
        'president': str(defense_tribunal.president.id.id),
        'secretary': str(defense_tribunal.secretary.id.id),
        'vocal': str(defense_tribunal.vocal.id.id),
        'opponent': str(defense_tribunal.opponent.id.id),
        'tutors': [str(tutor.id.id) for tutor in defense_tribunal.tutors.all()]
    }
    response = professor_authenticate_client.put(url, json=data)
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_defense_tribunal_viewset_update_unauthorized_student(student_authenticate_client, defense_tribunal):
    """Verifica que un estudiante no pueda actualizar un tribunal y defensa."""
    url = get_defense_tribunal_url(str(defense_tribunal.id))
    data = {
        'student': str(defense_tribunal.student.id.id),
        'defense_date': "2025-06-29",
        'selected_ece': Request.ECE.TD,
        'president': str(defense_tribunal.president.id.id),
        'secretary': str(defense_tribunal.secretary.id.id),
        'vocal': str(defense_tribunal.vocal.id.id),
        'opponent': str(defense_tribunal.opponent.id.id),
        'tutors': [str(tutor.id.id) for tutor in defense_tribunal.tutors.all()]
    }
    response = student_authenticate_client.put(url, json=data)
    assert response.status_code == status.HTTP_403_FORBIDDEN


# ********************************DESTROY***************************************************************************
@pytest.mark.django_db
def test_defense_tribunal_viewset_destroy_professor(decan_authenticate_client, defense_tribunal):
    """Verifica que un ningún usuario pueda eliminar tribunales y defensas."""
    url = get_defense_tribunal_general_url()
    response = decan_authenticate_client.delete(url, params={'ids': [str(defense_tribunal.id)]})
    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED


# ********************************LIST***************************************************************************
@pytest.mark.django_db
def test_defense_tribunal_viewset_list(decan_authenticate_client, defense_tribunal):
    """Verifica que ningún usuario pueda listar tribunales y defensas."""
    url = get_defense_tribunal_general_url()
    response = decan_authenticate_client.get(url)
    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
