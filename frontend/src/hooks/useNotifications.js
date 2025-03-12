import { useEffect, useState } from 'react'
import NotificationService from '../services/NotificationService'

const useNotifications = () => {
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        NotificationService.connect()

        const handleNewNotification = (notification) => {
            setNotifications((prev) => [...prev, notification])
        }

        NotificationService.addListener(handleNewNotification)

        return () => {
            NotificationService.removeListener(handleNewNotification)
            NotificationService.disconnect()
        }
    }, [])

    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === id ? { ...notification, read: true } : notification
            )
        )
    }

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    }

    return { notifications, markAsRead, removeNotification }
}

export default useNotifications