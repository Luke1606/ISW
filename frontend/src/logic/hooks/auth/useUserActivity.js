import { useCallback, useEffect, useRef } from 'react'
import { useAuth } from '@/logic'

/**
 * @description Vigila la actividad del usuario para que al cumplirse {@link timeoutDuration} si el usuario no ha ejecutado ninguno de los eventos en {@link events} se cierre la sesión con {@link logout}.
 * 
 * @param {number} `timeoutDuration` - Tiempo definido para esperar entre cada comprobacion de inactividad del usuario.
 * @default 600000 (10 minutos)
 * @param {Array<string>} `events`- Eventos destinados a monitorizar la actividad del usuario.
 * @default ['mousemove','keydown','scroll']
 */
const useUserActivity = (timeoutDuration = 10 * 60 * 1000, events = ['mousemove', 'keydown', 'scroll']) => {
    if (!events || events.length === 0) events = ['mousemove', 'keydown', 'scroll']
    
    const timeoutRef = useRef(null)
    const { logout, isAuthorized } = useAuth()

    const resetActivityTimeout = useCallback(() => {
        clearTimeout(timeoutRef.current) // Limpia el timeout anterior

        timeoutRef.current = setTimeout(async () =>  {
                if (isAuthorized) {
                    console.warn('Se cerró la sesión por inactividad')
                    await logout()
                }
            }, timeoutDuration)
    }, [isAuthorized, logout, timeoutDuration])

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