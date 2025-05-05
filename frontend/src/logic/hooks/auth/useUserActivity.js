import { useCallback, useEffect, useRef } from 'react'
import { AuthService, useAuth } from '@/logic'

/**
 * @description Vigila la actividad del usuario para que al cumplirse {@link timeoutDuration} si el usuario no ha ejecutado ninguno de los eventos en {@link events} se cambie con {@link AuthService.setUserActive} a false y se trate al usuario como inactivo según la configuracion de {@link AuthService}.
 * 
 * @param {number} `timeoutDuration` - Tiempo definido para esperar entre cada comprobacion de inactividad del usuario, por defecto 10 minutos
 * @default 600000
 * @param {Array<string>} `events`- Eventos destinados a monitorizar la actividad del usuario, por defecto son mousemove, keydown y scroll
 * @default ['mousemove','keydown','scroll']
 */
const useUserActivity = (timeoutDuration = 10 * 60 * 1000, events = ['mousemove', 'keydown', 'scroll']) => {
    if (!events || events.length === 0) events = ['mousemove', 'keydown', 'scroll']
    
    const timeoutRef = useRef(null)
    const { isAuthorized } = useAuth()

    const resetActivityTimeout = useCallback(() => {
        clearTimeout(timeoutRef.current) // Limpia el timeout anterior

        timeoutRef.current = setTimeout(() =>  {
                if (isAuthorized)
                    AuthService.closeSession()
            }, timeoutDuration)
    }, [isAuthorized, timeoutDuration])

    useEffect(() => {
        if (isAuthorized) {
            events.forEach(event => {
                window.addEventListener(event, resetActivityTimeout, { passive: true })
            })
        }
        return () => {
            clearTimeout(timeoutRef.current)
            events.forEach(event => {
                window.removeEventListener(event, resetActivityTimeout)
            })
        }
    }, [timeoutDuration, events, resetActivityTimeout, isAuthorized])
}

export default useUserActivity