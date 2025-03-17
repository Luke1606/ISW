import PropTypes from "prop-types"
import { createContext, useState, startTransition } from "react"
import AuthService from "../services/AuthService"
import datatypes from "../js-files/Datatypes"

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const login = async (userFormData) => {
        try {
            const userData = await AuthService.login(userFormData)

            let redirect

            startTransition(() => {
                setUser(userData)
                if (userData?.role === datatypes.user.student)
                    redirect = `/list/${datatypes.evidence}/${userData.id}/`
                else if (userData?.role === datatypes.user.professor)
                    redirect = `/list/${datatypes.user.student}/${userData.id}`
                else
                    redirect = `/list/${datatypes.user.student}/`
            })

            return {
                success: true,
                message: `El usuario ${userData.name} se ha autenticado correctamente.`,
                redirect: redirect
            }
        } catch (error) {
            const authError = {
                title: "Error durante la autenticación",
                response: error.response || undefined,
                data: error.data || undefined,
            }
            return { success: false, error: authError }
        }
    }

    const logout = () => {
        AuthService.logout()
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node,
}

export { AuthProvider, AuthContext }