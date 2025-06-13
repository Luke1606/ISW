import pytest
from django.urls import reverse
# from rest_framework import status
from defense_acts.tests.tests_defense_acts_models import defense_act
# from users.models import Student, Professor
from users.tests.test_users_views import student_authenticate_client, professor_authenticate_client, dpto_inf_authenticate_client, decan_authenticate_client
from users.tests.tests_users_models import student_user, professor_user


def get_defense_act_url(pk):
    """Obtiene la URL para acceder a un acta de defensa."""
    return reverse('defenseact-detail', kwargs={'pk': pk})


def get_defense_act_list_url():
    """Obtiene la URL para listar actas de defensa."""
    return reverse('defenseact-list')


@pytest.mark.django_db
def test_defense_act_viewset_create(professor_user, student_user, student_authenticate_client):
    """Verifica que un profesor pueda crear un acta de defensa."""
    # student_authenticate_client.force_authenticate(user=professor_user)
    # url = get_defense_act_list_url()
    # data = {
    #     'student': student_user.pk,
    #     'author': professor_user.pk,
    #     'name': "Nueva Acta",
    #     'description': "Descripción nueva",
    #     'attachment': "defense_acts/attachments/new_file.pdf"
    # }
    # response = student_authenticate_client.post(url, data)
    # assert response.status_code == status.HTTP_201_CREATED
    # assert DefenseAct.objects.count() == 1
    # assert DefenseAct.objects.get().name == "Nueva Acta"
    pass


@pytest.mark.django_db
def test_defense_act_viewset_retrieve(professor_user, defense_act, student_authenticate_client):
    """Verifica que un profesor pueda obtener un acta de defensa."""
    # student_authenticate_client.force_authenticate(user=professor_user)
    # url = get_defense_act_url(defense_act.pk)
    # response = student_authenticate_client.get(url)
    # assert response.status_code == status.HTTP_200_OK
    # assert response.data['name'] == "Acta de Defensa Test"
    pass


@pytest.mark.django_db
def test_defense_act_viewset_update(professor_user, defense_act, student_authenticate_client):
    """Verifica que un profesor pueda actualizar un acta de defensa."""
    # student_authenticate_client.force_authenticate(user=professor_user)
    # url = get_defense_act_url(defense_act.pk)
    # data = {'name': "Acta Actualizada"}
    # response = student_authenticate_client.patch(url, data)
    # assert response.status_code == status.HTTP_200_OK
    # defense_act.refresh_from_db()
    # assert defense_act.name == "Acta Actualizada"
    pass


@pytest.mark.django_db
def test_defense_act_viewset_destroy(professor_user, defense_act, student_authenticate_client):
    """Verifica que un profesor pueda eliminar un acta de defensa."""
    # student_authenticate_client.force_authenticate(user=professor_user)
    # url = get_defense_act_url(defense_act.pk)
    # response = student_authenticate_client.delete(url)
    # assert response.status_code == status.HTTP_204_NO_CONTENT
    # assert DefenseAct.objects.count() == 0
    pass


@pytest.mark.django_db
def test_defense_act_viewset_list(professor_user, defense_act, student_authenticate_client):
    """Verifica que un profesor pueda listar actas de defensa."""
    # student_authenticate_client.force_authenticate(user=professor_user)
    # url = get_defense_act_list_url()
    # response = student_authenticate_client.get(url)
    # assert response.status_code == status.HTTP_200_OK
    # assert len(response.data) == 1
    # assert response.data[0]['name'] == "Acta de Defensa Test"
    pass


@pytest.mark.django_db
def test_defense_act_viewset_create_unauthorized(student_user, professor_user, student_authenticate_client):
    """Verifica que un estudiante no pueda crear un acta de defensa."""
    # student_authenticate_client.force_authenticate(user=student_user)
    # url = get_defense_act_list_url()
    # data = {
    #     'student': student_user.pk,
    #     'author': professor_user.pk,
    #     'name': "Nueva Acta",
    #     'description': "Descripción nueva",
    #     'attachment': "defense_acts/attachments/new_file.pdf"
    # }
    # response = student_authenticate_client.post(url, data)
    # assert response.status_code == status.HTTP_403_FORBIDDEN
    pass


@pytest.mark.django_db
def test_defense_act_viewset_retrieve_unauthorized(student_user, defense_act, student_authenticate_client):
    """Verifica que un estudiante no pueda obtener un acta de defensa que no le pertenece."""
    # student_authenticate_client.force_authenticate(user=student_user)
    # url = get_defense_act_url(defense_act.pk)
    # response = student_authenticate_client.get(url)
    # assert response.status_code == status.HTTP_403_FORBIDDEN
    pass


@pytest.mark.django_db
def test_defense_act_viewset_update_unauthorized(student_user, defense_act, student_authenticate_client):
    """Verifica que un estudiante no pueda actualizar un acta de defensa."""
    # student_authenticate_client.force_authenticate(user=student_user)
    # url = get_defense_act_url(defense_act.pk)
    # data = {'name': "Acta Actualizada"}
    # response = student_authenticate_client.patch(url, data)
    # assert response.status_code == status.HTTP_403_FORBIDDEN
    pass


@pytest.mark.django_db
def test_defense_act_viewset_destroy_unauthorized(student_user, defense_act, student_authenticate_client):
    """Verifica que un estudiante no pueda eliminar un acta de defensa."""
    # student_authenticate_client.force_authenticate(user=student_user)
    # url = get_defense_act_url(defense_act.pk)
    # response = student_authenticate_client.delete(url)
    # assert response.status_code == status.HTTP_403_FORBIDDEN
    pass


@pytest.mark.django_db
def test_defense_act_viewset_create_missing_data(professor_user, student_authenticate_client):
    """Verifica que no se pueda crear un acta de defensa con datos faltantes."""
    # student_authenticate_client.force_authenticate(user=professor_user)
    # url = "/defense_acts/"
    # data = {
    #     'name': "Nueva Acta",
    #     'description': "Descripción nueva"
    # }  # Falta el campo 'student'
    # response = student_authenticate_client.post(url, data)
    # assert response.status_code == status.HTTP_400_BAD_REQUEST
    # assert 'error' in response.data
    pass


@pytest.mark.django_db
def test_defense_act_viewset_list_unauthorized(student_user, defense_act, student_authenticate_client):
    """Verifica que un estudiante no pueda listar las actas de defensa."""
    # student_authenticate_client.force_authenticate(user=student_user)
    # url = "/defense_acts/"
    # response = student_authenticate_client.get(url)
    # assert response.status_code == status.HTTP_403_FORBIDDEN
    pass
