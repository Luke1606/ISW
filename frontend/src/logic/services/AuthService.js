import { authApi } from '@/APIs'
import { NotificationService } from './'

class AuthService {
    async login (userFormData) {
        const response = await authApi.authenticate(userFormData)
        if (!response.success) {
            console.error('Ocurrio un error: ', response.message)
            await this.closeSession()
        }
        return response.message
    }    

    async logout () {
        const response = await this.closeSession()

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

    async closeSession () {
        return await authApi.closeSession()
    }

    async getSessionInfo () {
        return await authApi.getSessionInfo()
    }

    async checkAuth() {
        try {
            if (authApi.isAboutToExpire())
                return await this.refreshToken()
            else
                return true    
        } catch (error) {
            console.error(error.message)
            return false
        }
    }

    async refreshToken () {
        const response = await authApi.setNewAccessToken()
        console.log(response.message)
        return response.success
    }
}

export default new AuthService()
