import { Outlet, Navigate } from "react-router-dom"
import useAuth from "../hooks/Auth/useAuth"

const ProtectedRoutesComponent = () => {
    const { isAuthorized }  = useAuth()
    
    if (isAuthorized === null)
        return null

    return isAuthorized ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedRoutesComponent