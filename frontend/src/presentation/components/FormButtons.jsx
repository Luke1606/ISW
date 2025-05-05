import PropTypes from 'prop-types'

const FormButtons = ({modalId, closeModal, isValid}) => {
    return (
        <div className='button-container'>
            <button
                type='submit'
                className='accept-button'
                title='Aceptar'
                disabled={
                    !isValid
                }
                style={
                    !isValid?
                        { backgroundColor: 'gray' }
                        :
                        {}
                }
                >
                Aceptar
            </button>

            <button 
                className='cancel-button'
                onClick={() => closeModal(modalId)}
                >
                Cancelar
            </button>
        </div>
    )
}

FormButtons.propTypes = {
    modalId: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    isValid: PropTypes.bool,
}

export default FormButtons