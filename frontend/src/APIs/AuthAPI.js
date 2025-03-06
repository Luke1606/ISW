import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { ACCESS_TOKEN_KEY } from './Constants'

const authApi = axios.create({
    baseURL: 'http://localhost:8000/authentication/',
})

authApi.interceptors.request.use(
    (config) => {
        const token = getToken(ACCESS_TOKEN_KEY)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

authApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    console.log("Unauthorized")
                    break
                case 402:
                    console.log("Payment Required")
                    break
                case 403:
                    console.log("Forbidden")
                    break
                case 404:
                    console.log("Not Found")
                    break
                default:
                    return Promise.reject(error)
            }
        }
    }
)

export const authenticate = async (userFormData) => {
    const user = {
        username: userFormData.username, 
        password: userFormData.password
    }
    const response = await authApi.post('token/',user)
    
    return response.data
}

export const setToken = (TOKEN_KEY, token) => localStorage.setItem(TOKEN_KEY, token)

export const getToken = (TOKEN_KEY) => localStorage.getItem(TOKEN_KEY)

export const deleteToken = (TOKEN_KEY) => localStorage.removeItem(TOKEN_KEY)

export const getNewAccessToken = async (refreshToken) => await authApi.post('/token/refresh/', { refresh: refreshToken })

export const isAboutToExpire = (token, threshold = 300) => {
    const decoded = jwtDecode(token)
    const tokenExpiration = decoded.exp
    const now = Date.now() / 1000
    return (tokenExpiration - now) < threshold
}