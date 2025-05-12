import { useCallback, useEffect, useState } from 'react'
import { ManagementService, NotificationService, useLoading } from '@/logic'

const useForm = (datatype, idData, relatedUserId) => {
    const { loading, setLoading } = useLoading()
    const [ prevValues, setPrevValues ] = useState(null)
    const [isEdition, setIsEdition] = useState(Boolean(idData))

    useEffect(() => {
        setIsEdition(Boolean(idData))
    }, [idData])

    const getPrevValues = useCallback(async (datatype, id, relatedUserId) => {
        if (!id) return null
        setLoading(true)
        let message = ''
        let success = false

        try {
            const response = await ManagementService.getData(datatype, id, relatedUserId)
            
            if (response.success) {
                success = true
                setPrevValues(response.data)
            } else {
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
    }, [setLoading])

    useEffect(() => {
        getPrevValues(datatype, idData, relatedUserId)
    }, [datatype, idData, relatedUserId, getPrevValues])
    
    return { loading, prevValues, isEdition }
}

export default useForm 




