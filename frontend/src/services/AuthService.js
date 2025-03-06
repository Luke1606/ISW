import * as authApi from "../APIs/AuthAPI"
import * as tokens from "../APIs/Constants"

class AuthService {
    async login(userFormData) {
        const response = await authApi.authenticate(userFormData)     
        if (response) {
            authApi.setToken(tokens.USER_TOKEN_KEY, JSON.stringify(response.user))
            authApi.setToken(tokens.ACCESS_TOKEN_KEY, response.data.access)
            authApi.setToken(tokens.REFRESH_TOKEN_KEY, response.data.refresh)
            return response.user
        }
    }

    async logout() {
        authApi.deleteToken(tokens.USER_TOKEN_KEY)
        authApi.deleteToken(tokens.ACCESS_TOKEN_KEY)
        authApi.deleteToken(tokens.REFRESH_TOKEN_KEY)
    }

    checkAuth = () => {
        const token = authApi.getToken(tokens.ACCESS_TOKEN_KEY)
        if (!token) {
            return false
        }
        try {
            if (authApi.isAboutToExpire(token)) 
                return this.refreshToken()
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
            if (response.status === 200) {
                tokens.setToken(tokens.ACCESS_TOKEN_KEY, response.access)
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
