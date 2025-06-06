import { useNotifications } from '@/logic'
import { Trash2 } from 'lucide-react'

const NotificationCenter = () => {
    const { notifications, toggleAsRead, deleteNotification } = useNotifications()

    return (
        <div
            className='manage-list notification-list'
            >
            { notifications && notifications.length > 0?
                notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`notification-item ${notification.is_read? 'read' : 'unread'}`}
                        onClick={(e) => {
                                e.stopPropagation()
                                toggleAsRead(notification.id)
                        }}
                        >
                        <div className='notification-text'>
                            <h2 
                                className='list-item-header notification-header'
                                >
                                {notification.title}
                            </h2>
                            <p 
                                className='notification-message'
                                >
                                {notification.message}
                            </p>
                        </div>
                                
                        <button 
                            className='notification-button delete-button'
                            onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                            }}
                            >
                            <Trash2 color='white' size={35}/>
                        </button>
                    </div>))
                :
                    <h3 className='list-item-title'>
                        No hay elementos que mostrar.
                    </h3>}
        </div>
    )
}

export default NotificationCenter