import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import error from '/error.png'

const ErrorComponent = ({errorTitle, errorDescription=''}) => {
    const navigate = useNavigate()
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
                onClick={() => navigate('/')}
                >
                Volver
            </button>
        </div>
    )
}

ErrorComponent.propTypes = {
    errorTitle: PropTypes.string.isRequired,
    errorDescription: PropTypes.string.isRequired,
}

export default ErrorComponent