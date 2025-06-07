import { useCallback, useEffect, useState } from 'react'
import { NotificationService, useAuth } from '@/logic'

const useNotifications = () => {
    const [ notifications, setNotifications ] = useState([])
    const [ pendingOperations, setPendingOperations ] = useState([])

    const { user } = useAuth()
    
    useEffect(() => {
        const getNotifications = async () => {
            const { data } = await NotificationService.get()
            const flattedData = Object.values(data).flat()
    
            if (data)            
                setNotifications(flattedData)
        }
        const handleNewNotification = (notification) =>
            setNotifications((prev) => [notification, ...prev])
        
        if (user) {
            getNotifications()        
            NotificationService.connect()
            NotificationService.addListener(handleNewNotification)
        }
        
        return () => {
            NotificationService.removeListener(handleNewNotification)
            NotificationService.disconnect()
        }
    }, [user])

    const syncPendingOperations = useCallback( async () => {
        if (pendingOperations.length > 0) {
            try {
                const markAsReadIds = []
                const deleteIds = []

                for (const operation of pendingOperations) {
                    if (operation.type === 'toggleAsRead')
                        markAsReadIds.push(operation.id)
                    else if (operation.type === 'delete')
                        deleteIds.push(operation.id)
                }
                
                if (markAsReadIds.length > 0)
                    await NotificationService.toggleAsRead(markAsReadIds)
                if (deleteIds.length > 0)
                    await NotificationService.delete(deleteIds)
                setPendingOperations([])
            } catch (error) {
                console.error('Error al sincronizar las operaciones pendientes:', error)
            }
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

    const toggleAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === id ? { ...notification, is_read: !notification.is_read } : notification
            )
        )
    
        setPendingOperations((prev) => [...prev, { type: 'toggleAsRead', id }])
    }
    
    const deleteNotification = (id) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id))
        setPendingOperations((prev) => [...prev, { type: 'delete', id }])
    }

    return { notifications, toggleAsRead, deleteNotification }
}

export default useNotifications