import { createContext, useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import LoginService from '../services/UserService'
import datatypes from "../js-files/Datatypes"

const UserContext = createContext()

const UserProvider = () => {
    const [user, setUser ] = useState(null)
    const [redirect, setRedirect] = useState(null)

    const login = async (username, password) => {
        try {            
            const userData = await LoginService.login(username, password)
            setUser (userData)

            if(user.getUserType() === datatypes.student)
                setRedirect(`/tree/${datatypes.evidence}/${user.id}/`) 
            else
            setRedirect(`/tree/${datatypes.student}/`)
        } catch (error) {
            throw new Error("Error durante la autenticación: " + error.message)
        }
    }

    const logout = () => {
        LoginService.logout()
        setUser (null)
    }

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {redirect ? <Navigate to={redirect} /> : <Outlet /> }
        </UserContext.Provider>
    )
}

export { UserProvider as LoginProvider, UserContext as LoginContext }