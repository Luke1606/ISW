import { Bell, BellDot } from 'lucide-react'
import { useNotifications, useAuth } from '@/logic'
import { useEffect, useState } from 'react'

const useHeaderOptions = () => {
    let options = []
    const { user } = useAuth()
    const { notifications } = useNotifications()
    const [ hasUnread, setHasUnread ] = useState(false)

    useEffect(() => {
        setHasUnread(notifications.some((notification) => notification.is_read === false))
    }, [notifications])

    if(user)
        options.push({
            title: 'Notificaciones',
            action: '/notifications',
            icon: hasUnread? BellDot : Bell,
        })

    return { options, hasUnread }
}

export default useHeaderOptions