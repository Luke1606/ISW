import { jwtDecode } from 'jwt-decode'

let accessToken = null

const setAccessToken = (token) => {    
    accessToken = isTokenValid(token)? token : null
}

/** 
 * @description Verifica si el token proporcionado es válido comprobando su estructura.
 *  @param {string} `token` - Token a validar.
 * @returns {boolean} `true` si el token tiene una estructura válida, `false` en caso contrario.
 */
const isTokenValid = (token) => {
    try {
        return token && token.split('.').length === 3 && jwtDecode(token)
    } catch (error) {
        console.error('Token inválido:', error)
        return false
    }
}


export  { accessToken, setAccessToken }