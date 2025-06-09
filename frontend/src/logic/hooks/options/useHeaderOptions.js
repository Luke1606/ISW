import { Bell, BellDot } from 'lucide-react'
import { useNotifications, useAuth } from '@/logic'
import { useEffect, useState } from 'react'

/**
 * @description Hook personalizado
 * @returns {Object} Objeto que contiene:
 * - {Array} `options`- Arreglo de opciones a mostrar en el perfil, hasta ahora notificaciones solamente.
 * Vienen con la url destino al clickearla, el label a mostrar debajo y un ícono asociado.
 * - {boolean} `hasUnread`- Flag que representa si el usuario autenticado tiene notificaciones sin leer, para que se refleje en el ícono.
 */
const useHeaderOptions = () => {
    const options = []
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