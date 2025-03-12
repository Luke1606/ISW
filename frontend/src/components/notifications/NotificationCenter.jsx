import useNotifications from '../../hooks/useNotifications'
import { useNavigate } from "react-router-dom"

const NotificationComponent = () => {
    const { notifications, markAsRead, removeNotification } = useNotifications()
    const navigate = useNavigate()

    const handleNotificationClick = (notification) => {
        navigate(notification.url)
    }

    return (
        <div>
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    style={{ cursor: 'pointer', background: notification.read ? '#f0f0f0' : '#fff' }}
                    >
                    <p>{notification.message}</p>
                    
                    <button 
                        className='notification-button'
                        onClick={(e) => {
                            e.stopPropagation()
                            markAsRead(notification.id)
                        }}
                        >
                        Marcar como leída
                    </button>
                    
                    <button 
                        className='notification-button'
                        onClick={(e) => {
                            e.stopPropagation()
                            removeNotification(notification.id)
                        }}
                        >
                        Eliminar
                    </button>
                </div>
            ))}
        </div>
    )
}

export default NotificationComponent