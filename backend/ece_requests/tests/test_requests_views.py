def test_request_viewset_valid_create():
    """
    Verifica que un estudiante pueda registrar correctamente una solicitud
    """
    pass


def test_request_viewset_invalid_create():
    """
    Verifica que no se puedan enviar más solicitudes a menos que la anterior esté denegada.
    """
    pass
    # with pytest.raises(ValidationError, match="No puedes registrar otra solicitud mientras una previa esté en estado Pendiente o si está Aprobada."):


def test_request_viewset_valid_create_unauthorized():
    """
    Verifica que nadie que no sea un estudiante pueda registrar una solicitud.
    """
    pass


def test_request_viewset_update_valid_state():
    """
    Verifica que un dptoInf se le pueda cambiar el estado a una solicitud pendiente.
    """
    pass
#   response =
#   assert response.json() == {
#       detail: 'No puede darle un veredicto a una solicitud que ya lo tiene.',
#       status=status.HTTP_400_BAD_REQUEST,
# }


def test_request_viewset_update_valid_state_unauthorized():
    """
    Verifica que nadie que no sea un dptoInf pueda cambiar el estado a una solicitud pendiente.
    """
    pass
#   response =
#   assert response.json() == {
#       detail: 'No puede darle un veredicto a una solicitud que ya lo tiene.',
#       status: status.HTTP_400_BAD_REQUEST,
# }


def test_request_viewset_update_invalid_state():
    """
    Verifica que no se pueda cambiar otro campo que no sea el estado.
    """
    pass
#   with pytest.raises(ValidationError, match="Solo se permite modificar el estado de la solicitud.")


def test_request_viewset_update_valid_state_with_tribunal():
    """
    Verifica que no se pueda aprobar una solicitud si el estudiante ya tiene un tribunal asociado.
    """
    pass
    # with pytest.raises(ValidationError, match="Ya existe un tribunal asociado a este estudiante.")


def test_request_viewset_retrieve_with_data():
    """
    Verifica que se pueda obtener la información de una solicitud si hay alguna.
    """
    pass


def test_request_viewset_retrieve_without_data():
    pass
#   assert response.json() == {
#       detail: "No se encontró ninguna solicitud para este estudiante.",
#       status: status.HTTP_204_NO_CONTENT
# }


def test_request_viewset_list():
    """
    Verifica que no se puedan listar las solicitudes.
    """
    pass


def test_request_viewset_destroy():
    """
    Verifica que no se puedan eliminar las solicitudes.
    """
    pass
