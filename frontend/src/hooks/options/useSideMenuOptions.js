import { useLocation } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react'
import { File } from 'lucide-react'
import datatypes from '../../consts/datatypes'
import { AuthContext } from '../../contexts/AuthContext'
import { useFormParams } from '../management/useForm'

const useSideMenuOptions = () => {
    const { user } = useContext(AuthContext)
    const location = useLocation()
    const currentPath = location.pathname
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
        title: "Generar un reporte",
        icon: File,
        action: () => openManageForm(datatypes.report),
    }]

    if(user) {
        switch (user?.user_role) {
            case datatypes.user.student:
                options.push({
                    title: 'Enviar solicitud de ECE',
                    icon: File,
                    action: () => openManageForm(datatypes.request),
                },
                {
                    title: 'Tribunal y defensa',
                    icon: File,
                    action: () => openManageForm(
                        datatypes.defense_tribunal, 
                        {relatedUserId: user.id, view: true}
                    ),
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

