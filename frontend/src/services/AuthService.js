import * as authApi from "../APIs/AuthAPI"
import * as tokens from "../APIs/Constants"

class AuthService {
    async login (userFormData) {
        const response = await authApi.authenticate(userFormData)
        if (response.tokens && response.userData) {
            const user = {
                id: response.userData.user_id,
                name: response.userData.name,
                pic: response.userData.pic,
                role: response.userData.role,
            }
            authApi.setToken(tokens.USER_TOKEN_KEY, user)
            authApi.setToken(tokens.ACCESS_TOKEN_KEY, response.tokens.access)
            authApi.setToken(tokens.REFRESH_TOKEN_KEY, response.tokens.refresh)

            return user
        }
        console.log('Ocurrio un error: ', response)
    }    

    async logout () {
        authApi.deleteToken(tokens.USER_TOKEN_KEY)
        authApi.deleteToken(tokens.ACCESS_TOKEN_KEY)
        authApi.deleteToken(tokens.REFRESH_TOKEN_KEY)
    }

    async checkAuth () {
        const token = authApi.getToken(tokens.ACCESS_TOKEN_KEY)
        
        try {
            if (authApi.isAboutToExpire(token)) 
                return await this.refreshToken()
            else
                return false
        } catch (error) {
            console.error("Token decoding failed:", error)
            return false
        }
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
            console.error("Failed to refresh token:", error)
            return false
        }
    }
}

export default new AuthService()
