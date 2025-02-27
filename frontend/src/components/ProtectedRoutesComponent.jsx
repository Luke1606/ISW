// components/ProtectedRoutes.js
import { Outlet, Navigate } from "react-router-dom";
import LoadingSpinner from "./common/LoadingSpinner"
import useAuth from '../hooks/useAuth'

const ProtectedRoutesComponent = () => {
    const { isAuthorized } = useAuth()

    if (isAuthorized === null) {
        return <LoadingSpinner>Loading...</LoadingSpinner>
    }

    return isAuthorized ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoutesComponent