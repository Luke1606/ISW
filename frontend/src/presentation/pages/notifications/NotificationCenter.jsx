import { useNavigate } from 'react-router-dom'
import { useNotifications } from '@/logic'

const NotificationCenter = () => {
    const { notifications, markAsRead, removeNotification } = useNotifications()
    const navigate = useNavigate()

    const handleNotificationClick = (notification) => {
        navigate(notification.url)
    }
    console.log(notifications);
    return (
        <div
            className='manage-list notification-list'
            >
            { notifications && notifications.length > 0?
                notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`notification-item ${notification.is_read? 'read' : 'unread'}`}
                        onClick={() => handleNotificationClick(notification)}
                        >
                        <p>{notification.message}</p>
                        
                        <div 
                            className='button-container notification-buttons'
                            >
                            { !notification.is_read &&
                                <button 
                                    className='notification-button mark-read'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        markAsRead(notification.id)
                                    }}
                                    >
                                    Marcar como leída
                                </button>}
                                
                            <button 
                                className='notification-button remove'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    removeNotification(notification.id)
                                }}
                                >
                                Eliminar
                            </button>
                        </div>
                    </div>))
                :
                    <h3 className='list-item-title'>
                        No hay elementos que mostrar.
                    </h3>}
        </div>
    )
}

export default NotificationCenter