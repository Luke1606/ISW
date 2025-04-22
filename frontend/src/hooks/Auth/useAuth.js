import { useContext, useEffect, useState } from "react"
import AuthService from "../../services/AuthService"
import { AuthContext } from "../../contexts/AuthContext"
import { useLoading } from "../common/useContexts"

const useAuth = () => {
    const [ isAuthorized, setIsAuthorized ] = useState(null)
    const { authStatusChanged, user, login, logout } = useContext(AuthContext)
    const { setLoading } = useLoading()

    useEffect(() => {
        const checkAuthorized = async () => {
            try {
                setLoading(true)
                const result = await AuthService.checkAuth()
                setIsAuthorized(result)
            } catch (error) {
                console.error("Error verificando autorización:", error)
                setIsAuthorized(false)
            } finally {
                setLoading(false)
            }
        }
        checkAuthorized()
        
        const interval = setInterval(() => {
            checkAuthorized()
        }, 30 * 1000)//30 segundos
        return () => clearInterval(interval)
    }, [authStatusChanged, setLoading])

    return { isAuthorized, user, login, logout }
}

export default useAuth