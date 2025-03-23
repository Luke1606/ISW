import PropTypes from "prop-types"
import { createContext, useState, useEffect } from "react"
import AuthService from "../services/AuthService"

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [authStatusChanged, setAuthStatusChanged] = useState(false)

    useEffect(() => {
        const fetchUser = () => {
            const userInfo = AuthService.getLoggedUserInfo()
            setUser(userInfo)
        }
        fetchUser()
    }, [authStatusChanged])

    const login = async (userFormData) => {
        try {
            const userData = await AuthService.login(userFormData)

            setUser(userData)
            setAuthStatusChanged((prev) => !prev)
    
            return {
                success: true,
                message: `El usuario ${userData.name} se ha autenticado correctamente.`,
            }
        } catch (error) {
            const authError = {
                title: "Error durante la autenticación",
                response: error.response || undefined,
                data: error.data || undefined,
            }
            return { success: false, error: authError }
        }
    };

    const logout = () => {
        AuthService.logout();
        setUser(null)
        setAuthStatusChanged((prev) => !prev)
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