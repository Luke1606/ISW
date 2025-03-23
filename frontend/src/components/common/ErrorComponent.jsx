import PropTypes from "prop-types"
import { useNavigate } from "react-router-dom"

const ErrorComponent = ({errorTitle, errorDescription=""}) => {
    const navigate = useNavigate()
    return (
        <div className="error-container">
            <h1>{errorTitle}</h1>
            <p>{errorDescription}</p>
            <button onClick={() => navigate('/')}>Volver</button>
        </div>
    )
}

ErrorComponent.propTypes = {
    errorTitle: PropTypes.string.isRequired,
    errorDescription: PropTypes.string.isRequired,
}

export default ErrorComponent