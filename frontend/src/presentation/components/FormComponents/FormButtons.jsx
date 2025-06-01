import PropTypes from 'prop-types'

const FormButtons = ({ closeFunc, isValid }) => {
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
                onClick={closeFunc}
                >
                Cancelar
            </button>
        </div>
    )
}

FormButtons.propTypes = {
    closeFunc: PropTypes.func.isRequired,
    isValid: PropTypes.bool,
}

export default FormButtons