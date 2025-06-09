import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { File, Send, Gavel } from 'lucide-react'
import { datatypes } from '@/data'
import { useAuth, useFormParams, ManagementService } from '@/logic'

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
    const { user } = useAuth()
    const [ options, setOptions ] = useState([])

    useEffect(() => {
        const initializeOptions = async () => {
            let newOptions = [{
                title: 'Generar un reporte',
                icon: File,
                action: () => openManageForm(datatypes.report)
            }]

            if(user) {
                switch (user?.user_role) {
                    case datatypes.user.student: {
                        const lastRequest = await (await ManagementService.getData(datatypes.request, user?.id)).data
                        
                        if (!lastRequest || lastRequest.state === 'D') {
                            newOptions.push({
                                title: 'Enviar solicitud de ECE',
                                icon: Send,
                                action: () => openManageForm(datatypes.request)
                            })
                        }
                        const defenseTribunal = await (await ManagementService.getData(datatypes.defense_tribunal, user?.id)).data

                        if (defenseTribunal && defenseTribunal.state === 'A') {
                            newOptions.push({
                                title: 'Tribunal y defensa',
                                icon: Gavel,
                                action: () => openManageForm(
                                        datatypes.defense_tribunal, 
                                        {idData: user.id, view: true}
                                    )
                            })
                        }
                    }
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
                setOptions(newOptions)
            }
        }

        initializeOptions()
    }, [ user, openManageForm ])

    return { options, isVisible}
}

export default useSideMenuOptions

