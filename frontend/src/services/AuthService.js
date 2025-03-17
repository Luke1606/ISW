import * as authApi from "../APIs/AuthAPI"
import * as tokens from "../APIs/Constants"

class AuthService {
    async login(userFormData) {
        const response = await authApi.authenticate(userFormData)
        if (response.tokens && response.userData) {
            const user = {
                id: response.userData.user_id,
                name: response.userData.name,
                pic: response.userData.pic,
                role: response.userData.role,
            }
            console.log(user)
            authApi.setToken(tokens.USER_TOKEN_KEY, user)
            authApi.setToken(tokens.ACCESS_TOKEN_KEY, response.tokens.access)
            authApi.setToken(tokens.REFRESH_TOKEN_KEY, response.tokens.refresh)

            return user
        }
        console.log('se mamo')
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
