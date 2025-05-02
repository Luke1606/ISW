import {authApi} from '@/APIs'
import {tokens} from '@/data'
import {NotificationService} from './'

class AuthService {
    constructor () {
        /**
         * @description Indica si el usuario sigue activo o se considera inactivo. 
         * En el 2do caso la sesión debe cerrarse automáticamente.
         */
        this.isUserActive = true
    }

    setUserActive(state) {
        this.isUserActive = state
    }

    getUserActive () {
        return this.isUserActive
    }
    
    async login (userFormData) {
        const response = await authApi.authenticate(userFormData)
        if (response.success) {
            this.setUserActive(true)
            return response.user
        } else {
            console.error('Ocurrio un error: ', response.message)
            await authApi.logout()
            throw new Error(response.status)
        }
    }    

    async logout () {
        const response = await authApi.close_session()

        let notification

        if (response.success) {
            console.log(response.message)

            notification = {
                title: response.message,
                message: '',
            }
            NotificationService.showToast(notification, 'warning')
        } else {
            console.error('Cierre de sesión fallido', response.message)

            notification = {
                title: 'Cierre de sesión fallido',
                message: response.message,
            } 
            NotificationService.showToast(notification, 'error')
        }
    }

    getSessionInfo () {
        const user = authApi.getToken(tokens.USER_TOKEN_KEY)
        return user
    }

    async checkAuth() {
        if (!this.getUserActive()) await authApi.close_session()
        const token = authApi.getToken(tokens.ACCESS_TOKEN_KEY)

        if(token) {
            try {
                if (authApi.isAboutToExpire(token))
                    return await this.refreshToken()
                else
                    return true    
            } catch (error) {
                console.error(error.message)
                return false
            }
        }else
            return false
    }

    async refreshToken () {
        const refreshToken = authApi.getToken(tokens.REFRESH_TOKEN_KEY)

        if (!refreshToken) return false

        const response = await authApi.getNewAccessToken(refreshToken)
        
        if (response.success)
            authApi.setToken(tokens.ACCESS_TOKEN_KEY, response.accessToken)
        
        console.log(response.message)
        return response.success
    }
}

export default new AuthService()
