import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { File } from 'lucide-react'
import { datatypes } from '@/data'
import { useAuth, useFormParams } from '../'

/**
 * 
 * @returns 
 */
const useSideMenuOptions = () => {
    const { user } = useAuth()
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

    const [datatype, setDatatype ] = useState(datatypes.default)
    const { openManageForm } = useFormParams(datatype)

    let options = [{
        title: "Generar un reporte",
        icon: File,
        action: () => {
            setDatatype(datatypes.report)
            openManageForm(datatypes.report)
        }
    }]

    if(user) {
        switch (user?.user_role) {
            case datatypes.user.student:
                options.push({
                    title: 'Enviar solicitud de ECE',
                    icon: File,
                    action: () => {
                        setDatatype(datatypes.request)
                        openManageForm(datatypes.request)
                    }
                },
                {
                    title: 'Tribunal y defensa',
                    icon: File,
                    action: () => {
                        setDatatype(datatypes.defense_tribunal)
                        openManageForm(
                            datatypes.defense_tribunal, 
                            {relatedUserId: user.id, view: true}
                        )
                    }
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

