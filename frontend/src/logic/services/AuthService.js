import * as authApi from "../../APIs/AuthAPI"
import * as tokens from "../../APIs/Constants"
import NotificationService from "./NotificationService"

class AuthService {
    constructor () {
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
        if (response.tokens && response.userData) {
            const user = {
                id: response.userData.user_id,
                name: response.userData.name,
                pic: response.userData.pic,
                user_role: response.userData.role,
            }
            authApi.setToken(tokens.ACCESS_TOKEN_KEY, response.tokens.access)
            authApi.setToken(tokens.REFRESH_TOKEN_KEY, response.tokens.refresh)
            authApi.setToken(tokens.USER_TOKEN_KEY, user)
            
            this.setUserActive(true)
            
            return user
        }
        console.log('Ocurrio un error: ', response)
        this.logout()
        throw new Error(response.status)
    }    

    async logout () {
        authApi.deleteToken(tokens.USER_TOKEN_KEY)
        authApi.deleteToken(tokens.ACCESS_TOKEN_KEY)
        authApi.deleteToken(tokens.REFRESH_TOKEN_KEY)

        const notification = {
            title: "Cierre de sesión exitoso",
            message: "",
        }
        NotificationService.showToast(notification, "warning")
    }

    getLoggedUserInfo () {
        const user = authApi.getToken(tokens.USER_TOKEN_KEY)
        return user
    }

    async checkAuth() {
        if (!this.getUserActive) this.logout()
        const token = authApi.getToken(tokens.ACCESS_TOKEN_KEY)

        if(token) {
            if (authApi.isAboutToExpire(token))
                return await this.refreshToken()
            
            else
                return true
        }else
            return false
    }

    async refreshToken () {
        const refreshToken = authApi.getToken(tokens.REFRESH_TOKEN_KEY)

        if (!refreshToken)
            return false

        try {
            const response = await authApi.getNewAccessToken(refreshToken)
            
            if (response?.status === 200) {
                authApi.setToken(tokens.ACCESS_TOKEN_KEY, response.data.access)
                return true
            } else {
                return false
            }
        } catch (error) {
            console.error("Error al recargar el token:", error)
            return false
        }
    }
}

export default new AuthService()
