import { useEffect, useState } from 'react'
import { ManagementService, NotificationService, useAuth, useLoading } from '@/logic'
import { datatypes } from '@/data'

const useForm = (datatype, idData, relatedUserId) => {
    const { setLoading } = useLoading()
    const [ prevValues, setPrevValues ] = useState(null)
    const [ isEdition, setIsEdition ] = useState(Boolean(idData))
    const { user } = useAuth()

    useEffect(() => {
        if (datatype === datatypes.request)
            setIsEdition(user.user_role !== datatypes.user.student)
        else 
            setIsEdition(Boolean(idData))
    }, [idData, datatype, user])
    
    useEffect(() => {
        const initializePrevValues = async (datatype, id, relatedUserId) => {
            if (datatype !== datatypes.request && !id) return null
            else if (datatype === datatypes.request && !id) {
                setPrevValues({ student: user.id })
                return
            }
            
            setLoading(true)
            
            let message = ''
            let success = false
    
            try {
                const response = await ManagementService.getData(datatype, id, relatedUserId)
                
                if (response.success) {
                    setPrevValues(response.data)
                    success = true
                } else {
                    setPrevValues({})
                    message = response.message                
                }
            } catch (error) {
                message = error.message
            } finally {
                if (!success) {
                    const notification = {
                        title: 'Error',
                        message: message
                    }
                    NotificationService.showToast(notification, 'error')
                }
                setLoading(false)
            }
        }

        initializePrevValues(datatype, idData, relatedUserId)
    }, [datatype, idData, relatedUserId, setLoading, user.id])
    
    return { prevValues, isEdition }
}

export default useForm 




