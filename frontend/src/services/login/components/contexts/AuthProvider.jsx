import PropTypes from "prop-types"
import { createContext, useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import eceApi from "../../../../API"
import { USER_TOKEN_KEY, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../../../management/components/helpers/Constants"
import { setToken, deleteToken, getToken } from "../../../management/components/helpers/TokenHelpers"

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [user, setUser ] = useState(() => {
        const savedUser  = getToken(USER_TOKEN_KEY)
        return savedUser  ? JSON.parse(savedUser ) : null
    })
    const [redirect, setRedirect] = useState(null)

    const loginUser  = async (user) => {
        try {
            const response = await eceApi.post('/token/', user)
            setToken(ACCESS_TOKEN_KEY, response.data.access)
            setToken(REFRESH_TOKEN_KEY, response.data.refresh)

            const userData = await eceApi.getData(`/usuario/${getToken(ACCESS_TOKEN_KEY)}`)
            setUser (userData)
            setToken(USER_TOKEN_KEY, JSON.stringify(userData))
        } catch (error) {
            alert(error)
            alert("Usuario o contraseña incorrectos")
        }

        if(user.getUserType() === "estudiante")
            setRedirect(`/tree/evidencia/${user.id}/`)
        else 
            setRedirect(`/tree/estudiante/`)
    }

    const logoutUser  = () => {
        deleteToken(USER_TOKEN_KEY)
        setUser (null)
        setRedirect(true)
    }

    useEffect(() => {
        if (redirect) {
            setRedirect(false)
        }
    }, [redirect])

    return (
        <AuthContext.Provider value={{ user, loginUser , logoutUser  }}>
            {redirect ? <Navigate to={redirect} /> : children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export { AuthProvider, AuthContext }