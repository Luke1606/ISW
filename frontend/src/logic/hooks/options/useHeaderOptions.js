import { Bell } from 'lucide-react'
import { useAuth } from '@/logic'

const useHeaderOptions = () => {
    let options = []
    const { user } = useAuth()

    if(user)
        options.push({
            title: 'Notificaciones',
            action: '/notifications',
            icon: Bell,
        })

    return options
}

export default useHeaderOptions