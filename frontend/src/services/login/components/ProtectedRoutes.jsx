import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom"
import { getNewAccessToken, getToken, isAboutToExpire, setToken } from './helpers/TokenHelpers'
import LoadingSpinner from "../../general_components/Spinner"
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../../../Constants";



const ProtectedRoutes = () => {
    const [isAuthorized, setIsAuthorized] = useState(null)

    useEffect(() => {
        const checkAuth = () => {
            const token = getToken(ACCESS_TOKEN_KEY)
            if (!token) {
                setIsAuthorized(false)
                return
            }

            try {
                if (isAboutToExpire(token)) 
                    refreshToken()
                else 
                    setIsAuthorized(true)
            } catch (error) {
                console.error("Token decoding failed:", error)
                setIsAuthorized(false)
            }
        }

        checkAuth()
    }, [])

    const refreshToken = async () => {
        const refreshToken = getToken(REFRESH_TOKEN_KEY)
        if (!refreshToken) {
            setIsAuthorized(false)
            return
        }

        try {
            const response = await getNewAccessToken(refreshToken)
            if (response.status === 200) {
                setToken(ACCESS_TOKEN_KEY, response.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.error("Failed to refresh token:", error)
            setIsAuthorized(false)
        }
    }

    if (isAuthorized === null) {
        return <LoadingSpinner>Loading...</LoadingSpinner>
    }

    return isAuthorized ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoutes