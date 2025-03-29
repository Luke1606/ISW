import { useContext, useEffect, useState } from "react"
import AuthService from "../../services/AuthService"
import { AuthContext } from "../../contexts/AuthContext"

const useAuth = () => {
    const [isAuthorized, setIsAuthorized] = useState(null)
    const { authStatusChanged } = useContext(AuthContext)

    useEffect(() => {
        const checkAuthorized = async () => {
            try {
                const result = await AuthService.checkAuth()
                setIsAuthorized(result)
            } catch (error) {
                console.error("Error verificando autorización:", error)
                setIsAuthorized(false)
            }
        }
        checkAuthorized()
        
        const interval = setInterval(async () => {
            checkAuthorized()
        }, 30000)
        return () => clearInterval(interval)
    }, [authStatusChanged])

    return isAuthorized
}

export default useAuth