import { useEffect, useState } from "react"
import AuthService from "../services/AuthService"

const useAuth = () => {
    const [isAuthorized, setIsAuthorized] = useState(null)

    useEffect(() => {
        const checkAuthorized = async () => {
            try {
                const result = await AuthService.checkAuth()
                setIsAuthorized(result)
            } catch (error) {
                console.error("Error checking authorization:", error)
                setIsAuthorized(false)
            }
        }
        checkAuthorized()
    }, [])

    return isAuthorized
}

export default useAuth