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
        const token = getToken(tokens.ACCESS_TOKEN_KEY)
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
                    throw new Error('No existe una cuenta asociada. Verifique sus credenciales')
                case 403:
                    throw new Error('No tiene acceso a este recurso')
                case 404:
                    throw new Error('Recurso no encontrado')
                default:
                    return Promise.reject(error)
            }
        } else {
            console.error('Error de red o inesperado:', error.message)
            return Promise.reject(new Error('Error de red o inesperado'))
        }
        
    }
)

/**
 * @description Autentica a un usuario mediante sus credenciales y obtiene sus tokens de `access` y `refresh`.
 * @param {Object} userFormData - Datos del usuario para autenticación (`username` y `password`).
 * @returns {Object} Un objeto con la información del usuario autenticado y el estado de la solicitud. Contiene:
 * - {boolean} `success`- Indica el éxito o fallo de la solicitud.
 * - {Object} `user`- Contiene la información del usuario
 * - {string} `message`- Mensaje de respuesta de la solicitud
 * @example
 * // Ejemplo de uso:
 * const response = await authenticate({ username: 'usuario@example.com', password: '123456' })
 * if (response.success) {
 *     console.log(response.message)
 *     console.log(response.user)
 * }
 * else
 *     console.error(response.message) 
 */
const authenticate = async (userFormData) => {
    try {
        const response = await authApiInstance.post('', userFormData)
        const userData = jwtDecode(response.data.access)

        const tokenValues = response.data

        if (tokens && userData && response.status === 200) {
            const user = {
                id: userData.user_id,
                name: userData.name,
                pic: userData.pic,
                user_role: userData.role,
            }
            setToken(tokens.ACCESS_TOKEN_KEY, tokenValues.access)
            setToken(tokens.REFRESH_TOKEN_KEY, tokenValues.refresh)
            setToken(tokens.USER_TOKEN_KEY, user)

            return { 
                success: true, 
                user: user, 
                message: 'Inicio de sesión exitoso' 
            }
        }
    } catch (error) {
        return { 
            success: false, 
            user: null, 
            message: error.message || 'Error desconocido' 
        }
    }
}

/**
 * @description Cierra la sesión actual usando el `REFRESH_TOKEN_KEY` almacenado en `localStorage`.
 * @param {boolean} `isEmergency`- Indica la urgencia del cierre de sesión, si es `true` se manejará con
 * {@link navigator.sendBeacon}, en caso contrario se usará `axios` normalmente.
 * @returns {Object} Un objeto con el estado de la operación. Contiene:
 * - {boolean} `success`- Indica el éxito o fallo de la solicitud.
 * - {string} `message`- Mensaje de respuesta de la solicitud
 * @example
 * // Ejemplo de uso normal:
 * const response = await close_session()
 * if (response.success)
 *     console.log('Todo bien')
 * else
 *     console.error(response.status)
 * 
 * * // Ejemplo de uso urgente:
 * close_session(true)
 */
const close_session = async (isEmergency=false) => {
    const refreshToken = getToken(tokens.REFRESH_TOKEN_KEY)

    deleteToken(tokens.USER_TOKEN_KEY)
    deleteToken(tokens.ACCESS_TOKEN_KEY)
    deleteToken(tokens.REFRESH_TOKEN_KEY)

    let message
    let success = false

    if (refreshToken) {
        try {
            if (isEmergency) {
                const data = JSON.stringify({ refresh: refreshToken })
                navigator.sendBeacon('http://localhost:8000/users/token/blacklist/', data)
                console.log('Cierre de sesión enviado con sendBeacon.')
                success = true
                message = 'Cierre de sesión enviado antes de cerrar el navegador.'
            } else {
                const response = await authApiInstance.post('blacklist/', { refresh: refreshToken })
                
                if (response.status === 200) {
                    message = 'Cierre de sesión exitoso'
                    success = true
                }
            }
        } catch (error) {
            message = error.message || 'Error desconocido'
        }
    } else {
        message = 'No hay un token de refresh válido'
    }
    return { success, message }
} 

/** 
 * @description Almacena un token en el `localStorage`.
 * @param {string} `TOKEN_KEY` - Clave con la que se almacena el token.
 * @param {Object|string} token - Token que se guardará, convertido a formato JSON.
 * @example
 * const token = 'esto_es_un_token_de_ejemplo'
 * const token = setToken('example', token)
 */
const setToken = (TOKEN_KEY, token) => localStorage.setItem(TOKEN_KEY, JSON.stringify(token))

/** 
 * @description Obtiene un token del `localStorage`.
 * @param {string} `TOKEN_KEY` - Clave del token a recuperar.
 * @returns {Object|null} Retorna el token almacenado si existe, `null` en caso contrario.
 * @example
 * const token = getToken('example')
 */
const getToken = (TOKEN_KEY) => {
    const item = localStorage.getItem(TOKEN_KEY)

    if (!item) {
        console.warn(`Token con clave '${TOKEN_KEY}' no encontrado.`)
        return null
    }
    try {
        return JSON.parse(item)
    } catch (error) {
        console.error('Error al parsear el token:', error)
        deleteToken(TOKEN_KEY)
        return null
    }
}

/** 
 * @description Elimina un token del `localStorage`.
 * @param {string} `TOKEN_KEY` - Clave del token a eliminar.
 * @example
 * deleteToken('example')
 */
const deleteToken = (TOKEN_KEY) => localStorage.removeItem(TOKEN_KEY)

/** 
 * @description Verifica si un token es válido comprobando su estructura.
 * @param {string} `token` - Token a validar.
 * @returns {boolean} `true` si el token tiene una estructura válida, `false` en caso contrario.
 * @example
 * const isTokenValid = isValid('example_token')
 */
const isValid = (token) => {
    try {
        return token && token.split('.').length === 3 && jwtDecode(token)
    } catch (error) {
        console.error('Token inválido:', error)
        return false
    }
}

/** 
 * @description Verifica si un token está cerca de expirar.
 * @param {string} `token` - Token a evaluar.
 * @param {number} `threshold` - Tiempo en segundos antes de considerarlo 'cercano a expirar'.
 * @default 60
 * @returns {boolean} `true` si el token expira pronto, `false` si aún es válido.
 * @throws {Error} Si el token no es válido.
 * @example
 * const expiringSoon = isAboutToExpire(accessToken, 120) // Expira en menos de 2 minutos
 */
const isAboutToExpire = (token, threshold = 60) => {
    if (!isValid(token)) throw new Error('Token inválido')

    try {
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000

        if (tokenExpiration < now) {
            console.warn('El token ya está caducado.')
            return true
        }
        return (tokenExpiration - now) < threshold
    } catch (error) {
        throw new Error(`Error al verificar la expiración del token: ${error}`)
    }
}

/** 
 * @description Solicita un nuevo token de acceso utilizando el token de refresh.
 * @param {string} `refreshToken` - Token de refresh válido.
 * @returns {Promise<Object>} Retorna la respuesta de la API con el nuevo token de acceso si la solicitud es exitosa.
 * @throws {Error} En caso de error al obtener el nuevo token.
 * @example
 * const refreshToken = 'token_refresh_example'
 * 
 * const response = await getNewAccessToken(refreshToken)   
 *     if (response.success) {
 *         setToken('access', response.accessToken)
 *         console.log(response.message)
 *     } else {
 *         console.error(response.message)
 *     }
 */
const getNewAccessToken = async (refreshToken) => {
    try {
        const response = await authApiInstance.post('refresh/', { refresh: refreshToken })
        return { 
            success: true, 
            accessToken: response.data.access, 
            message: 'Token de acceso obtenido' 
        }
    } catch (error) {
        return { 
            success: false, 
            accessToken: null, 
            message: `No se pudo refrescar el token: ${error}`
        }
    }

}

/**
 * @description API con todos los métodos encargados de manejar tokens y autenticación. Contiene:
 * - {@link authenticate}
 * - {@link close_session}
 * - {@link setToken}
 * - {@link getToken}
 * - {@link deleteToken}
 * - {@link isAboutToExpire}
 * - {@link getNewAccessToken}
 */
const authApi = {
    authenticate, 
    close_session, 
    setToken, 
    getToken,
    deleteToken, 
    isAboutToExpire,
    getNewAccessToken
}
export default authApi







