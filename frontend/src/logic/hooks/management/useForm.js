import { useCallback, useEffect, useState } from 'react'
import { useLoading } from '../'
import { ManagementService, NotificationService } from '../../'

const useForm = (datatype, idData, relatedUserId) => {
    const { loading, setLoading } = useLoading()
    const [ prevValues, setPrevValues ] = useState(null)
    
    const getPrevValues = useCallback(async (datatype, id) => {
        if (!id) return null
        setLoading(true)
        try {
            const response = await ManagementService.getData(datatype, id)
            setPrevValues(response)
        } catch (error) {
            const notification = {
                title: 'Error',
                message: error.message
            }
            NotificationService.showToast(notification, 'error')
        } finally {
            setLoading(false)
        }
    }, [setLoading])

    useEffect(() => {
        getPrevValues(datatype, idData, relatedUserId)
    }, [datatype, idData, relatedUserId, getPrevValues])
    
    const handleSubmit = idData? 
                            ManagementService.updateData
                            : 
                            ManagementService.createData

    return { loading, prevValues, handleSubmit }
}

export default useForm 




