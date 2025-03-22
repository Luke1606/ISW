import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { ACCESS_TOKEN_KEY } from './Constants'
import Error from '../components/common/Error'

const authApi = axios.create({
    baseURL: 'http://localhost:8000/users/token/',
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
                    throw new Error("Unauthorized")
                case 402:
                    throw new Error("Payment Required")
                case 403:
                    throw new Error("Forbidden")
                case 404:
                    throw new Error("Not Found")
                default:
                    return Promise.reject(error)
            }
        }
    }
)

export const authenticate = async (userFormData) => {
    try {
        const response = await authApi.post('', userFormData)
        const tokenPayload = jwtDecode(response.data.access)

        return { tokens: response.data, userData: tokenPayload, status: response.status }
    } catch (error) {
        console.error("Error al autenticar:", error)
        return { tokens: null, data: null, status: error.response?.status || "Error desconocido" }
    }
}

export const setToken = (TOKEN_KEY, token) => localStorage.setItem(TOKEN_KEY, token)

export const getToken = (TOKEN_KEY) => localStorage.getItem(TOKEN_KEY)

export const deleteToken = (TOKEN_KEY) => localStorage.removeItem(TOKEN_KEY)

export const getNewAccessToken = async (refreshToken) => await authApi.post('refresh/', { refresh: refreshToken })

export const isValid = (token) => token && token.split('.').length === 3

export const isAboutToExpire = (token, threshold = 300) => {
    if(!isValid(token))
        throw new Error("Token invalido")
    
    const decoded = jwtDecode(token)
    const tokenExpiration = decoded.exp
    const now = Date.now() / 1000
    return (tokenExpiration - now) < threshold
}