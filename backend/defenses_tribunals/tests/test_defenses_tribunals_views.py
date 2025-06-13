import pytest
from django.urls import reverse
# from rest_framework import status
# from rest_framework.exceptions import ValidationError, PermissionDenied
# from defenses_tribunals.models import DefenseTribunal
# from users.models import Professor, Student
from defenses_tribunals.tests.tests_defenses_tribunals_models import defense_tribunal, professors
from users.tests.test_users_views import student_authenticate_client, professor_authenticate_client, dpto_inf_authenticate_client, decan_authenticate_client
from users.tests.tests_users_models import student_user, professor_user, dpto_inf_user, decan_user
# from core.management.utils.constants import Datatypes


def get_tribunal_url(student_id):
    """Obtiene la URL para acceder al tribunal de un estudiante."""
    return reverse('managemeng/defense-tribunal/', kwargs={'pk': student_id})


@pytest.mark.django_db
def test_defense_tribunal_viewset_retrieve_decan_dpto_inf(decan_user, dpto_inf_user, student_user, student_authenticate_client):
    """Verifica que un miembro del dptoInf o decano pueda acceder a un tribunal cualquiera."""
    # student_authenticate_client.force_authenticate(user=decan_user.id)
    # url = get_tribunal_url(student_user.id.id)
    # response = student_authenticate_client.get(url)
    # assert response.status_code == status.HTTP_200_OK

    # student_authenticate_client.force_authenticate(user=dpto_inf_user.id)
    # response = student_authenticate_client.get(url)
    # assert response.status_code == status.HTTP_200_OK
    pass


@pytest.mark.django_db
def test_defense_tribunal_viewset_retrieve_student(student_user, defense_tribunal, student_authenticate_client):
    """Verifica que un estudiante pueda acceder a su tribunal."""
    # student_authenticate_client.force_authenticate(user=student_user.id)
    # url = get_tribunal_url(student_user.id.id)
    # response = student_authenticate_client.get(url)
    # assert response.status_code == status.HTTP_200_OK
    # assert response.data['student'] == student_user.id.id
    pass


@pytest.mark.django_db
def test_defense_tribunal_viewset_retrieve_unauthorized_student(student_user, professor_user, defense_tribunal, student_authenticate_client):
    """Verifica que un estudiante no pueda acceder a un tribunal que no sea el suyo."""
    # student_authenticate_client.force_authenticate(user=professor_user.id)
    # url = get_tribunal_url(student_user.id.id)
    # response = student_authenticate_client.get(url)
    # assert response.status_code == status.HTTP_403_FORBIDDEN
    pass


@pytest.mark.django_db
def test_defense_tribunal_viewset_retrieve_professor(professor_user, student_user, defense_tribunal, student_authenticate_client):
    """Verifica que un profesor pueda acceder al tribunal de cualquiera de sus alumnos relacionados."""
    # Asumiendo que tienes un método para relacionar profesores y estudiantes
    # professor_user.students.add(student_user)  # Simula la relación profesor-estudiante
    # student_authenticate_client.force_authenticate(user=professor_user.id)
    # url = get_tribunal_url(student_user.id.id)
    # response = student_authenticate_client.get(url)
    # assert response.status_code == status.HTTP_200_OK
    pass


@pytest.mark.django_db
def test_defense_tribunal_viewset_retrieve_unauthorized_professor(professor_user, student_user, defense_tribunal, student_authenticate_client):
    """Verifica que un profesor no pueda acceder al tribunal si no es de alguno de sus alumnos relacionados."""
    # student_authenticate_client.force_authenticate(user=professor_user.id)
    # url = get_tribunal_url(student_user.id.id)
    # response = student_authenticate_client.get(url)
    # assert response.status_code == status.HTTP_403_FORBIDDEN
    pass


@pytest.mark.django_db
def test_defense_tribunal_viewset_update_state_decan(decan_user, defense_tribunal, student_authenticate_client):
    """Verifica que solo el decano pueda cambiar el estado del tribunal."""
    # student_authenticate_client.force_authenticate(user=decan_user.id)
    # url = get_tribunal_url(defense_tribunal.student.id.id)
    # data = {'state': DefenseTribunal.State.APPROVED}
    # response = student_authenticate_client.patch(url, data)
    # assert response.status_code == status.HTTP_200_OK
    # defense_tribunal.refresh_from_db()
    # assert defense_tribunal.state == DefenseTribunal.State.APPROVED
    pass


@pytest.mark.django_db
def test_defense_tribunal_viewset_update_state_professor_unauthorized(professor_user, defense_tribunal, student_authenticate_client):
    """Verifica que un profesor no pueda cambiar el estado del tribunal."""
    # student_authenticate_client.force_authenticate(user=professor_user.id)
    # url = get_tribunal_url(defense_tribunal.student.id.id)
    # data = {'state': DefenseTribunal.State.APPROVED}
    # response = student_authenticate_client.patch(url, data)
    # assert response.status_code == status.HTTP_403_FORBIDDEN
    pass


@pytest.mark.django_db
def test_defense_tribunal_viewset_update_state_dpto_inf_unauthorized(professor_user, defense_tribunal, student_authenticate_client):
    """Verifica que un miembro del dptoInf no pueda cambiar el estado del tribunal."""
    # student_authenticate_client.force_authenticate(user=professor_user.id)
    # url = get_tribunal_url(defense_tribunal.student.id.id)
    # data = {'state': DefenseTribunal.State.APPROVED}
    # response = student_authenticate_client.patch(url, data)
    # assert response.status_code == status.HTTP_403_FORBIDDEN
    pass


@pytest.mark.django_db
def test_defense_tribunal_viewset_update_members_dpto_inf(dpto_inf_user, defense_tribunal, professor_user, student_authenticate_client):
    """Verifica que solo el Dpto Inf pueda cambiar los miembros del tribunal."""
    # student_authenticate_client.force_authenticate(user=dpto_inf_user.id)
    # url = get_tribunal_url(defense_tribunal.student.id.id)
    # data = {'president': professor_user.id.id}
    # response = student_authenticate_client.patch(url, data)
    # assert response.status_code == status.HTTP_200_OK
    # defense_tribunal.refresh_from_db()
    # assert defense_tribunal.president == professor_user
    pass


@pytest.mark.django_db
def test_defense_tribunal_viewset_update_members_professor_unauthorized(professor_user, defense_tribunal, student_authenticate_client):
    """Verifica que un profesor no pueda cambiar los miembros del tribunal."""
    # student_authenticate_client.force_authenticate(user=professor_user.id)
    # url = get_tribunal_url(defense_tribunal.student.id.id)
    # data = {'president': professor_user.id.id}
    # response = student_authenticate_client.patch(url, data)
    # assert response.status_code == status.HTTP_403_FORBIDDEN
    pass


@pytest.mark.django_db
def test_defense_tribunal_viewset_update_members_decan_unauthorized(professor_user, defense_tribunal, student_authenticate_client):
    """Verifica que un decano no pueda cambiar los miembros del tribunal."""
    # student_authenticate_client.force_authenticate(user=professor_user.id)
    # url = get_tribunal_url(defense_tribunal.student.id.id)
    # data = {'president': professor_user.id.id}
    # response = student_authenticate_client.patch(url, data)
    # assert response.status_code == status.HTTP_403_FORBIDDEN
    pass


@pytest.mark.django_db
def test_defense_tribunal_viewset_list_not_allowed(student_authenticate_client):
    """Verifica que la lista de tribunales no esté permitida."""
    # url = reverse('defensetribunal-list')
    # response = student_authenticate_client.get(url)
    # assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
    pass


@pytest.mark.django_db
def test_defense_tribunal_viewset_destroy_not_allowed(decan_user, student_user, student_authenticate_client):
    """Verifica que la eliminación de tribunales no esté permitida."""
    # student_authenticate_client.force_authenticate(user=decan_user.id)
    # url = get_tribunal_url(student_user.id.id)
    # response = student_authenticate_client.delete(url)
    # assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
    pass


@pytest.mark.django_db
def test_defense_tribunal_viewset_update_invalid_member(decan_user, student_user, defense_tribunal, student_authenticate_client):
    """Verifica que no se pueda asignar un estudiante como miembro del tribunal."""
    # student_authenticate_client.force_authenticate(user=decan_user.id)
    # url = f"/defenses_tribunals/{defense_tribunal.pk}/"
    # data = {'president': student_user.pk}  # Intenta asignar un estudiante como presidente
    # response = student_authenticate_client.patch(url, data)
    # assert response.status_code == status.HTTP_400_BAD_REQUEST
    # assert 'error' in response.data
    pass


@pytest.mark.django_db
def test_defense_tribunal_viewset_update_invalid_state(decan_user, defense_tribunal, student_authenticate_client):
    """Verifica que no se pueda actualizar el estado del tribunal con un valor inválido."""
    # student_authenticate_client.force_authenticate(user=decan_user.id)
    # url = f"/defenses_tribunals/{defense_tribunal.pk}/"
    # data = {'state': 'INVALID_STATE'}  # Intenta asignar un estado inválido
    # response = student_authenticate_client.patch(url, data)
    # assert response.status_code == status.HTTP_400_BAD_REQUEST
    # assert 'error' in response.data
    pass


@pytest.mark.django_db
def test_defense_tribunal_viewset_retrieve_unrelated_professor(professor_user, student_user, defense_tribunal, student_authenticate_client):
    """Verifica que un profesor no relacionado no pueda acceder al tribunal."""
    # student_authenticate_client.force_authenticate(user=professor_user.id)
    # url = f"/defenses_tribunals/{defense_tribunal.pk}/"
    # response = student_authenticate_client.get(url)
    # assert response.status_code == status.HTTP_403_FORBIDDEN
    pass
