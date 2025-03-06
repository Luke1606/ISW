import { useEffect, useState } from "react"
import AuthService from "../services/AuthService"

const useAuth = () => {
    const [isAuthorized, setIsAuthorized] = useState(null)

    useEffect(() => {
        setIsAuthorized(AuthService.checkAuth())
    }, [])

    return isAuthorized
}

export default useAuth