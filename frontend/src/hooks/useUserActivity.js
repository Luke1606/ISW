import { useEffect } from 'react'
import NotificationService from '../services/NotificationService'

const useUserActivity = () => {
    useEffect(() => {
        NotificationService.setUserActive(true)
        
        let timeout
        
        const handleUserInactive = () => {
            NotificationService.setUserActive(false)
        }

        const resetActivityTimeout = () => {
            NotificationService.setUserActive(true)
            clearTimeout(timeout)
            timeout = setTimeout(handleUserInactive, 30000)
        }

        window.addEventListener('mousemove', resetActivityTimeout)
        window.addEventListener('keydown', resetActivityTimeout)
        window.addEventListener('scroll', resetActivityTimeout)

        return () => {
            NotificationService.setUserActive(false)
            window.removeEventListener('mousemove', resetActivityTimeout)
            window.removeEventListener('keydown', resetActivityTimeout)
            window.removeEventListener('scroll', resetActivityTimeout)
        }
    }, [])
}

export default useUserActivity