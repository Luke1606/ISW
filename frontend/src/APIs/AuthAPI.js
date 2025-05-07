/**
 * @fileoverview API destinada a todo lo relacionado con autenticación y manejo de tokens.
 */
import { jwtDecode } from 'jwt-decode'
import { createApiInstance, accessToken, setAccessToken } from './'

const authApiInstance = createApiInstance('http://localhost:8000/users/token/', {withCredentials: true,})

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
    let message
    let success = false
    try {
        const response = await authApiInstance.post('', userFormData)
        
        if (response.status === 200) {
            setAccessToken(response.data.access)
            message = 'Inicio de sesión exitoso'
            success = true
        }
    } catch (error) {
        message = error.response?.data?.message || error?.message
    }
    return { 
        success, 
        message: message || 'Error desconocido' 
    }
}

/**
 * @description Cierra la sesión actual usando el `REFRESH_TOKEN_KEY` almacenado en `localStorage`.
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
 */
const closeSession = async () => {
    let message
    let success = false

    try {
        const response = await authApiInstance.post('blacklist/')
        
        if (response.status === 200) {
            setAccessToken(null)
            message = 'Cierre de sesión exitoso'
            success = true
        }
    } catch (error) {
        message = error.response?.data?.message || error.message
    }
    return { 
        success, 
        message: message || 'Error desconocido' 
    }
} 

/**
 * @description Obtiene la información del usuario autenticado a través del `access_token`.
 * @returns {Promise<Object|null>} Un objeto con la información del usuario si la solicitud es exitosa, `null` en caso contrario.
 * @example
 * const userInfo = await getSessionInfo()
 * if (userInfo) {
 *     console.log(userInfo.name); // Nombre del usuario autenticado
 * } else {
 *     console.error('No se pudo obtener la información del usuario.')
 * }
 */
const getSessionInfo = async () => {
    try {
        if (!accessToken) {
            const renovationResponse = await setNewAccessToken()
            if (!renovationResponse.success) return null
        }
        const response = await authApiInstance.get('session-info/')

        if (response.status === 200 && response.data)
            return response.data
    } catch (error) {
        console.error('Error obteniendo la información del usuario:', error.message)
    }
    return null
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
const isAboutToExpire = (threshold = 60) => {
    if (!accessToken) throw new Error('No hay token de acceso disponible')

    try {
        const decoded = jwtDecode(accessToken)
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
 * const response = await setNewAccessToken()   
 *     if (response.success) {
 *         console.log(response.message)
 *     } else {
 *         console.error(response.message)
 *     }
 */
const setNewAccessToken = async () => {
    try {
        const response = await authApiInstance.post('refresh/')
        const token = response.data.access

        if (response.status === 200 && token)
            setAccessToken(token)

        return { 
            success: true, 
            message: 'Token de acceso obtenido' 
        }
    } catch (error) {
        return { 
            success: false, 
            message: `No se pudo refrescar el token: ${error}`
        }
    }

}

/**
 * @description API con todos los métodos encargados de manejar tokens y autenticación. Contiene:
 * - {@link authenticate}
 * - {@link closeSession}
 * - {@link deleteToken}
 * - {@link isAboutToExpire}
 * - {@link setNewAccessToken}
 */
const authApi = {
    authenticate, 
    closeSession, 
    getSessionInfo,
    isAboutToExpire,
    setNewAccessToken
}
export default authApi