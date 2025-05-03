import { useCallback, useEffect, useState } from 'react'
import { NotificationService } from '@/logic'

const useNotifications = () => {
    const [notifications, setNotifications] = useState([])
    const [pendingOperations, setPendingOperations] = useState([])

    const getNotifications = useCallback( async () => {
        const response = await NotificationService.get()

        if (response) {
            const sortedNotifications = response.sort((a, b) => {
                return new Date(b.created_at) - new Date(a.created_at) // Ordenar de más reciente a más antiguo
            })
            
            setNotifications(sortedNotifications)
        }
    }, [])

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

    const syncPendingOperations = useCallback( async () => {
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
    }, [pendingOperations])

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