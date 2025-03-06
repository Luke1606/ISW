import PropTypes from "prop-types"
import { createContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import AuthService from "../services/AuthService"
import datatypes from "../js-files/Datatypes"

const AuthContext = createContext()

const AuthProvider = ({children}) => {
    const [user, setUser ] = useState(null)
    const [redirect, setRedirect] = useState(null)

    const login = async (userFormData) => {
        try {            
            const userData = await AuthService.login(userFormData)
            setUser (userData)

            if(user.getUserType() === datatypes.student)
                setRedirect(`/list/${datatypes.evidence}/${user.id}/`) 
            else{
                setRedirect(`/list/${datatypes.student}/`)
            }
            return { success: true, message: "El usuario " + userData.name + " se ha autenticado correctamente." }
        } catch (error) {
            const authError = {
                title: "Error durante la autenticación",
                response: error.response || undefined,
                data: error.data || undefined,
            }
            return { success: false, error: authError}
        }
    }

    const logout = () => {
        AuthService.logout()
        setUser (null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {redirect ? (
                console.log("Redirigiendo a:", redirect), <Navigate to={redirect} />
            ) : (
                children
            )}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node,
}

export { AuthProvider, AuthContext }