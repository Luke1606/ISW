import eceApi from "../js-files/API"
import { USER_TOKEN_KEY, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../js-files/Constants"
import { setToken, deleteToken } from "../js-files/TokenHelpers"

class LoginService {
    async login(userFormData) {
        const response = await eceApi.post('/token/', userFormData)            
        setToken(USER_TOKEN_KEY, JSON.stringify(response.user))
        setToken(ACCESS_TOKEN_KEY, response.data.access)
        setToken(REFRESH_TOKEN_KEY, response.data.refresh)
        return response.user
    }

    async logout() {
        deleteToken(USER_TOKEN_KEY)
        deleteToken(ACCESS_TOKEN_KEY)
        deleteToken(REFRESH_TOKEN_KEY)
    }
}

export default new LoginService()
