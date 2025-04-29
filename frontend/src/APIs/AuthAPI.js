/**
 * @fileoverview API destinada a todo lo relacionado con autenticación y manejo de tokens.
 */
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { tokens } from '@/data'

const authApiInstance = axios.create({
    baseURL: 'http://localhost:8000/users/token/',
})

authApiInstance.interceptors.request.use(
    async (config) => {
        let token = getToken(tokens.ACCESS_TOKEN_KEY)
         if (token && isAboutToExpire(token)) {
             const refreshToken = getToken("REFRESH_TOKEN_KEY")
             if (refreshToken) {
                 const newAccessToken = await getNewAccessToken(refreshToken)
                 setToken(tokens.ACCESS_TOKEN_KEY, newAccessToken.data.access)
                 token = newAccessToken.data.access
             }
         }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

authApiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            switch (error.response?.status) {
                case 401:
                    throw new Error("No existe una cuenta asociada. Verifique sus credenciales")
                case 403:
                    throw new Error("No tiene acceso a este recurso")
                case 404:
                    throw new Error("Recurso no encontrado")
                default:
                    return Promise.reject(error)
            }
        } else {
            console.error("Error de red o inesperado:", error.message)
            return Promise.reject(new Error("Error de red o inesperado"))
        }
        
    }
)

const authenticate = async (userFormData) => {
    try {
        const response = await authApiInstance.post('', userFormData)
        const tokenPayload = jwtDecode(response.data.access)

        return { tokens: response.data, userData: tokenPayload, status: response.status }
    } catch (error) {
        return { tokens: null, data: null, status: error.message || "Error desconocido" }
    }
}

const setToken = (TOKEN_KEY, token) => localStorage.setItem(TOKEN_KEY, JSON.stringify(token))

const getToken = (TOKEN_KEY) => {
    const item = localStorage.getItem(TOKEN_KEY)

    if (!item) {
        console.warn(`Token con clave "${TOKEN_KEY}" no encontrado.`)
        return null
    }
    try {
        return JSON.parse(item)
    } catch (error) {
        console.error("Error al parsear el token:", error)
        return null
    }
}

const deleteToken = (TOKEN_KEY) => localStorage.removeItem(TOKEN_KEY)

const getNewAccessToken = async (refreshToken) => {
    try {
        const response = await authApiInstance.post('refresh/', { refresh: refreshToken })
        return response
    } catch (error) {
        throw new Error(`No se pudo refrescar el token: ${error}`)
    }
}

const isValid = (token) => {
    try {
        return token && token.split('.').length === 3 && jwtDecode(token)
    } catch (error) {
        console.error("Token inválido:", error)
        return false
    }
}

const isAboutToExpire = (token, threshold = 60) => {
    if (!isValid(token)) throw new Error("Token inválido")

    try {
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000

        if (tokenExpiration < now) {
            console.warn("El token ya está caducado.")
            return true
        }
        return (tokenExpiration - now) < threshold
    } catch (error) {
        throw new Error(`Error al verificar la expiración del token: ${error}`)
    }
}

/**
 * @description API con todos los métodos encargados de manejar tokens y autenticación
 */
const authApi = {authenticate, setToken, getToken, deleteToken, getNewAccessToken, isAboutToExpire}
export default authApi