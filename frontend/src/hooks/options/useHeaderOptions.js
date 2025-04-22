import { useContext } from 'react'
import { AuthContext } from "../../contexts/AuthContext"
import { Bell } from 'lucide-react'

const useHeaderOptions = () => {
    let options = []
    const { user } = useContext(AuthContext)

    if(user)
        options.push({
            title: "Notificaciones",
            action: "/notifications",
            icon: Bell,
        })

    return options
}

export default useHeaderOptions