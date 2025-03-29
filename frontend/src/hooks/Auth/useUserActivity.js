import { useEffect } from 'react'
import AuthService from "../../services/AuthService"

const useUserActivity = () => {
    useEffect(() => {
        AuthService.setUserActive(true)
        
        let timeout
        
        const resetActivityTimeout = () => {
            AuthService.setUserActive(true)
            clearTimeout(timeout)
            timeout = setTimeout(
                () => AuthService.setUserActive(false)
                , 60000 * 10)
        }

        window.addEventListener('mousemove', resetActivityTimeout)
        window.addEventListener('keydown', resetActivityTimeout)
        window.addEventListener('scroll', resetActivityTimeout)

        return () => {
            AuthService.setUserActive(false)
            window.removeEventListener('mousemove', resetActivityTimeout)
            window.removeEventListener('keydown', resetActivityTimeout)
            window.removeEventListener('scroll', resetActivityTimeout)
        }
    }, [])
}

export default useUserActivity