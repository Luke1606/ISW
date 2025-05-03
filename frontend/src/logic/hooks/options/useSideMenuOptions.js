import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { File, Send, Gavel } from 'lucide-react'
import { datatypes } from '@/data'
import { useAuth, useFormParams } from '@/logic'

/**
 * 
 * @returns 
 */
const useSideMenuOptions = () => {
    const currentPath = useLocation().pathname
    const [ isVisible, setIsVisible ] = useState(false)
    
    useEffect(() => {
        const checkVisible = () => {
            if (currentPath.startsWith('/list')) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }
        checkVisible()
    }, [currentPath])
    
    const { openManageForm } = useFormParams()
    
    let options = [{
        title: 'Generar un reporte',
        icon: File,
        action: () => {
            openManageForm(datatypes.report)
        }
    }]
    
    const { user } = useAuth()

    if(user) {
        switch (user?.user_role) {
            case datatypes.user.student:
                options.push({
                    title: 'Enviar solicitud de ECE',
                    icon: Send,
                    action: () =>
                        openManageForm(datatypes.request)
                },
                {
                    title: 'Tribunal y defensa',
                    icon: Gavel,
                    action: () =>
                        openManageForm(datatypes.defense_tribunal, {relatedUserId: user.id, view: true})
                })
                break
            case datatypes.user.professor:
                break
            case datatypes.user.dptoInf:
                break
            case datatypes.user.decan:
                break
            default:
                break
            }
        
    }
    return { options, isVisible}
}

export default useSideMenuOptions

