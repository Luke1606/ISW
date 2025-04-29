import { useEffect, useState } from 'react'
import { useLoading, useDebouncedFunction } from '../common'
import { ManagementService, NotificationService } from '../services'

const useForm = (datatype, idData, relatedUserId) => {
    const { loading, setLoading } = useLoading()
    const [ prevValues, setPrevValues ] = useState(null)
    
    const getPrevValues = useDebouncedFunction(async (datatype, id) => {
        if (!id) return
        setLoading(true)
        try {
            const response = await ManagementService.getData(datatype, id)
            setPrevValues(response)
        } catch (error) {
            const notification = {
                title: "Error",
                message: error.message
            }
            NotificationService.showToast(notification, 'error')
        } finally {
            setLoading(false)
        }
    })

    useEffect(() => {
        getPrevValues(datatype, idData, relatedUserId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [datatype, idData])
    
    const handleSubmit = idData? 
                            ManagementService.updateData
                            : 
                            ManagementService.createData

    return { loading, prevValues, handleSubmit }
}

export default useForm 




