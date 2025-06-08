import PropTypes from 'prop-types'
import error from '/error.png'

/**
 * 
 * @param {string} `errorTitle` - Título o etiqueta del error.
 * @param {string} `errorDescription` - Descripción o explicación de la causa del error.
 * @returns Estructura del componente de error genérico.
 */
const Error = ({ errorTitle, errorDescription='' }) => {
    return (
        <div className='error-container'>
            <h1 
                className='error-title'
                >
                {errorTitle}
            </h1>

            <img
                className='error-icon' 
                src={error} 
                alt='ícono de error'
                />
            
            <p 
                className='error-text'
                >
                {errorDescription}
            </p>
            
            <button 
                className='accept-button'
                onClick={() => window.location.href = '/'}
                >
                Volver
            </button>
        </div>
    )
}

Error.propTypes = {
    errorTitle: PropTypes.string.isRequired,
    errorDescription: PropTypes.string.isRequired,
}

export default Error