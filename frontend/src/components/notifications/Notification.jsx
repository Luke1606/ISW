import PropTypes from "prop-types"

const Notification = ({ title, message, action }) => {
    
    const handleClick = () => {
        // Aquí puedes manejar la lógica cuando se hace clic en una notificación
        console.log(`Notificación clickeada: ${action}`)
        // Puedes ejecutar la función onClick si es necesario
    }

    return (
        <div 
            className="notification" 
            onClick={handleClick} 
            style={{
                padding: '10px',
                margin: '5px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                cursor: 'pointer',
                backgroundColor: '#f9f9f9'
            }}>
                <h3>{ title }</h3>
                <p>{ message }</p>
        </div>
    )
}

Notification.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
}

export default Notification