import { useEffect, useState } from 'react';
import Notification from './Notification';
import { getAllNotifications } from '../../API';

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getAllNotifications()
                setNotifications(data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchNotifications()
    }, [])

    return (
        <div className="notification-center" style={{ maxWidth: '300px', margin: '20px' }}>
            <h2>Notificaciones</h2>
            {notifications.map(notification => (
                <Notification 
                    key={notification.id} 
                    header={notification.title} 
                    content={notification.message} 
                    action={notification.action} 
                />
            ))}
        </div>
    )
}

export default NotificationCenter