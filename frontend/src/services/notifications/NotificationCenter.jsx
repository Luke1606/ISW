// NotificationCenter.js
import { useEffect, useState } from 'react';
import Notification from './Notification';
import { getAllNotifications } from '../../API';

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getAllNotifications();
                setNotifications(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchNotifications();
    }, []);

    const handleNotificationClick = (onClick) => {
        // Aquí puedes manejar la lógica cuando se hace clic en una notificación
        console.log(`Notificación clickeada: ${onClick}`);
        // Puedes ejecutar la función onClick si es necesario
    };

    return (
        <div className="notification-center" style={{ maxWidth: '300px', margin: '20px' }}>
            <h2>Notificaciones</h2>
            {notifications.map(notification => (
                <Notification 
                    key={notification.id} 
                    header={notification.header} 
                    content={notification.description} 
                    onClick={() => handleNotificationClick(notification.on_click)} 
                />
            ))}
        </div>
    );
};

export default NotificationCenter;