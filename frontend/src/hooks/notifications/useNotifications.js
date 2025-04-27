import { useEffect, useState } from 'react'
import useDebouncedFunction from '../common/useDebouncedFunction'
import NotificationService from '../../services/NotificationService'

const useNotifications = () => {
    const [notifications, setNotifications] = useState([])
    const [pendingOperations, setPendingOperations] = useState([])

    const getNotifications = useDebouncedFunction( async () => {
        const response = await NotificationService.get()

        if (response) {
            const sortedNotifications = response.sort((a, b) => {
                return new Date(b.created_at) - new Date(a.created_at) // Ordenar de más reciente a más antiguo
            })
            
            setNotifications(sortedNotifications)
        }
    })

    useEffect(() => {
        const handleNewNotification = (notification) =>
            setNotifications((prev) => [notification, ...prev])

        getNotifications()        
        NotificationService.connect()
        NotificationService.addListener(handleNewNotification)
        
        return () => {
            NotificationService.removeListener(handleNewNotification)
            NotificationService.disconnect()
        }
    }, [getNotifications])

    const syncPendingOperations = useDebouncedFunction( async () => {
        try {
            for (const operation of pendingOperations) {
                if (operation.type === 'markAsRead') {
                    await NotificationService.markAsRead(operation.id)
                } else if (operation.type === 'remove') {
                    await NotificationService.delete(operation.id)
                }
            }
            setPendingOperations([])
        } catch (error) {
            console.error('Error al sincronizar las operaciones pendientes:', error)
        }
    })

    useEffect(() => {
        const interval = setInterval(() => {
            syncPendingOperations()
        }, 10 * 6000) // 10 minutos
        return () => {
            clearInterval(interval)
            syncPendingOperations()
        }
    }, [pendingOperations, syncPendingOperations])

    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === id ? { ...notification, is_read: true } : notification
            )
        )
    
        setPendingOperations((prev) => [...prev, { type: 'read', id }])
    }
    
    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id))
        setPendingOperations((prev) => [...prev, { type: 'delete', id }])
    }

    return { notifications, markAsRead, removeNotification }
}

export default useNotifications