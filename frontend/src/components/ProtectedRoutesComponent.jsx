import { Outlet, Navigate } from "react-router-dom"
import useAuth from '../hooks/useAuth'

const ProtectedRoutesComponent = () => {
    const isAuthorized  = useAuth()

    if (isAuthorized === null)
        return <span className="spinner"/>

    return isAuthorized ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoutesComponent