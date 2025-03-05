import { createContext, useState } from 'react'
import PropTypes from "prop-types"
import { Navigate } from 'react-router-dom'
import UserService from '../services/UserService'
import { datatypes } from "../js-files/Datatypes"

const UserContext = createContext()

const UserProvider = ({children}) => {
    const [user, setUser ] = useState(null)
    const [redirect, setRedirect] = useState(null)

    const login = async (userFormData) => {
        try {            
            const userData = await UserService.login(userFormData)
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
        UserService.logout()
        setUser (null)
    }

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {redirect ? (
                console.log("Redirigiendo a:", redirect), <Navigate to={redirect} />
            ) : (
                children
            )}
        </UserContext.Provider>
    )
}

UserProvider.propTypes = {
    children: PropTypes.node,
}

export { UserProvider, UserContext }