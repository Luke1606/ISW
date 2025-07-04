import { useContext, useEffect, useState } from 'react'
import { AuthContext, AuthService, useLoading } from '@/logic'

/**
 * @description Se encarga de manejar y proveer los estados y funciones asociadas a la autenticación y permisos de usuarios. 
 * - Cada 30 segundos se encarga de verificar la autorizacion del usuario ejecutando {@link checkAuthorized}.
 * - Evita la necesidad de importar y usar manualmente useContext cada vez que se quiera consumir de {@link AuthContext}.
 * @property {boolean} {@link isAuthorized} - Estado encargado de almacenar si el usuario está autorizado o no. `true` indica autorizado y `false` indica no autorizado.
 * @returns {Object} Objeto que contiene {@link isAuthorized} y la información obtenida de {@link AuthContext} ({@link user}, {@link login} y {@link logout}).
 */
const useAuth = () => {
    const [ isAuthorized, setIsAuthorized ] = useState(null)
    const { user, login, logout, authStatusChanged } = useContext(AuthContext)
    
    const { setLoading } = useLoading()

    useEffect(() => {
        const checkAuthorized = async () => {
            try {
                setLoading(true)
                const result = await AuthService.checkAuth()
                setIsAuthorized(result)
            } catch (error) {
                console.error('Error verificando autorización:', error)
                setIsAuthorized(false)
            } finally {
                setLoading(false)
            }
        }
        checkAuthorized()
    }, [ authStatusChanged, setLoading ])

    return { isAuthorized, user, login, logout }
}

export default useAuth