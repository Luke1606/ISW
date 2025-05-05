import PropTypes from 'prop-types'
import { createContext, useState, useEffect } from 'react'
import { AuthService } from '@/logic'

/**
 * @description Contexto diseñado para manejo centralizado de autenticación de usuarios.
 */
const AuthContext = createContext()

/**
 * @description Provider diseñado para manejo del {@link AuthContext}
 * @param {React.ReactNode} children
 * @returns Provider que permite a los componentes hijos acceder a los estados {@link user} con {@link setUser} y a {@link authStatusChanged} con {@link setAuthStatusChanged}, así como a las funciones {@link login} y {@link logout}.
 */
const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(null)
    const [ authStatusChanged, setAuthStatusChanged ] = useState(true)

    useEffect(() => {
        /**
         * @description Obtiene la información del usuario siempre que su estatus cambia ({@link authStatusChanged} es `true`).
         */
        const fetchUser = async () => {
            const userInfo = await AuthService.getSessionInfo()

            if (userInfo){
                setUser(userInfo)
            }
            setAuthStatusChanged(false)
        }
        if (authStatusChanged)
            fetchUser()
    }, [authStatusChanged])

    /**
     * @description Intenta autenticar al usuario de información userFormData a través de {@link AuthService.login}
     * @param {Object} `userFormData` - Usuario y contraseña asociados al usuario que se pretende autenticar
     * @returns {Object} Objeto con la información asociada al resultado de la operación.
     * - {boolean} `success` - Propiedad que define si la operación fue exitosa o fallida. El valor `true` indica éxito y `false` indica fallo.
     * - {string} `message` - Dependiendo de la propiedad `success` será su valor. Puede ser un mensaje de que el usuario se autenticó correctamente (`success`===`true`) o una pista de cual fue la causa del error (`success`===`false`).
     */
    const login = async (userFormData) => {
        const message = await AuthService.login(userFormData)
        setAuthStatusChanged(true)
        
        return {
            success: true,
            message: message,
        }
    }

    /**
     * @description Intenta cerrar la sesión activa a través de {@link AuthService.logout}
     */
    const logout = async () => {
        await AuthService.logout()
        setUser(null)
        setAuthStatusChanged(true)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, authStatusChanged }}>
            {children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node,
}

export { AuthProvider, AuthContext }