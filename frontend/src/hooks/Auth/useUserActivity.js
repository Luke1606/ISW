import { useEffect } from 'react'
import AuthService from '../../services/AuthService'
import _ from 'lodash'

const useUserActivity = (timeoutDuration = 10 * 60 * 1000, events = ['mousemove', 'keydown', 'scroll']) => {
    useEffect(() => {
        AuthService.setUserActive(true)
        
        let timeout
        
        const resetActivityTimeout = _.debounce(() => {
            AuthService.setUserActive(true)
            
            clearTimeout(timeout)
            timeout = setTimeout(
                () => AuthService.setUserActive(false)
                , timeoutDuration)
        }, 300)

        events.forEach(event => {
            window.addEventListener(event, resetActivityTimeout, { passive: true })
        })

        return () => {
            clearTimeout(timeout)
            AuthService.setUserActive(false)
            events.forEach(event => {
                window.removeEventListener(event, resetActivityTimeout)
            })
        }
    }, [timeoutDuration, events])
}

export default useUserActivity