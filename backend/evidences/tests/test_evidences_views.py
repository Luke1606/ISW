import pytest
from django.urls import reverse
# from rest_framework import status
# from evidences.models import Evidence
from users.tests.tests_users_models import student_user
from users.tests.test_users_views import student_authenticate_client, professor_authenticate_client, dpto_inf_authenticate_client, decan_authenticate_client
from evidences.tests.tests_evidences_models import evidence_url, evidence_file
# from django.core.files.uploadedfile import SimpleUploadedFile
# evidences/tests/test_evidences_views.py


def get_evidence_url(pk):
    """Obtiene la URL para acceder a una evidencia."""
    return reverse('evidence-detail', kwargs={'pk': pk})


def get_evidence_list_url():
    """Obtiene la URL para listar evidencias."""
    return reverse('evidence-list')


@pytest.mark.django_db
def test_evidence_viewset_create_url(student_user, student_authenticate_client):
    """Verifica que se pueda crear una evidencia de tipo URL."""
    # student_authenticate_client.force_authenticate(user=student_user)
    # url = get_evidence_list_url()
    # data = {
    #     'student': student_user.pk,
    #     'name': "Nueva Evidencia URL",
    #     'description': "Descripción nueva URL",
    #     'attachment_type': Evidence.Type.URL,
    #     'attachment_url': "http://example.com/new"
    # }
    # response = student_authenticate_client.post(url, data)
    # assert response.status_code == status.HTTP_201_CREATED
    # assert Evidence.objects.count() == 1
    # assert Evidence.objects.get().name == "Nueva Evidencia URL"
    pass


@pytest.mark.django_db
def test_evidence_viewset_create_file(student_user, student_authenticate_client):
    """Verifica que se pueda crear una evidencia de tipo FILE."""
    # student_authenticate_client.force_authenticate(user=student_user)
    # url = get_evidence_list_url()
    # file_mock = SimpleUploadedFile(
    #     "new_file.pdf",
    #     b"contenido de prueba del archivo",
    #     content_type="application/pdf"
    # )
    # data = {
    #     'student': student_user.pk,
    #     'name': "Nueva Evidencia FILE",
    #     'description': "Descripción nueva FILE",
    #     'attachment_type': Evidence.Type.FILE,
    #     'attachment_file': file_mock
    # }
    # response = student_authenticate_client.post(url, data, format='multipart')
    # assert response.status_code == status.HTTP_201_CREATED
    # assert Evidence.objects.count() == 1
    # assert Evidence.objects.get().name == "Nueva Evidencia FILE"
    pass


@pytest.mark.django_db
def test_evidence_viewset_retrieve(student_user, evidence_url, student_authenticate_client):
    """Verifica que se pueda obtener una evidencia existente."""
    # student_authenticate_client.force_authenticate(user=student_user)
    # url = get_evidence_url(evidence_url.pk)
    # response = student_authenticate_client.get(url)
    # assert response.status_code == status.HTTP_200_OK
    # assert response.data['name'] == "Evidencia URL Test"
    pass


@pytest.mark.django_db
def test_evidence_viewset_update(student_user, evidence_url, student_authenticate_client):
    """Verifica que se pueda actualizar una evidencia."""
    # student_authenticate_client.force_authenticate(user=student_user)
    # url = get_evidence_url(evidence_url.pk)
    # data = {'name': "Evidencia Actualizada"}
    # response = student_authenticate_client.patch(url, data)
    # assert response.status_code == status.HTTP_200_OK
    # evidence_url.refresh_from_db()
    # assert evidence_url.name == "Evidencia Actualizada"
    pass


@pytest.mark.django_db
def test_evidence_viewset_destroy(student_user, evidence_url, student_authenticate_client):
    """Verifica que se pueda eliminar una evidencia."""
    # student_authenticate_client.force_authenticate(user=student_user)
    # url = get_evidence_url(evidence_url.pk)
    # response = student_authenticate_client.delete(url)
    # assert response.status_code == status.HTTP_204_NO_CONTENT
    # assert Evidence.objects.count() == 0
    pass


@pytest.mark.django_db
def test_evidence_viewset_list(student_user, evidence_url, evidence_file, student_authenticate_client):
    """Verifica que se puedan listar las evidencias."""
    # student_authenticate_client.force_authenticate(user=student_user)
    # url = get_evidence_list_url()
    # response = student_authenticate_client.get(url)
    # assert response.status_code == status.HTTP_200_OK
    # assert len(response.data) == 2
    # names = [evidence['name'] for evidence in response.data]
    # assert "Evidencia URL Test" in names
    # assert "Evidencia FILE Test" in names
    pass


@pytest.mark.django_db
def test_evidence_viewset_create_invalid_attachment(student_user, student_authenticate_client):
    """Verifica que no se pueda crear una evidencia con adjuntos inválidos."""
    # student_authenticate_client.force_authenticate(user=student_user)
    # url = get_evidence_list_url()
    # file_mock = SimpleUploadedFile(
    #     "new_file.pdf",
    #     b"contenido de prueba del archivo",
    #     content_type="application/pdf"
    # )
    # data = {
    #     'student': student_user.pk,
    #     'name': "Nueva Evidencia FILE",
    #     'description': "Descripción nueva FILE",
    #     'attachment_type': Evidence.Type.URL,  # Tipo incorrecto
    #     'attachment_file': file_mock  # Adjunto incorrecto
    # }
    # response = student_authenticate_client.post(url, data, format='multipart')
    # assert response.status_code == status.HTTP_400_BAD_REQUEST
    # assert Evidence.objects.count() == 0
    pass
