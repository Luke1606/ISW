import { useEffect, useState } from 'react'
import useDebouncedApiCall from '../common/useDebouncedApiCall'
import ManagementService from '../../services/ManagementService'
import NotificationService from '../../services/NotificationService'

const useForm = (datatype, idData) => {
    const [ loading, setLoading ] = useState(false)
    const [ prevValues, setPrevValues ] = useState(null)

    const getPrevValues = useDebouncedApiCall(async (datatype, id) => {
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
        if (idData)
            getPrevValues(datatype, idData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [datatype, idData])
    
    const handleSubmit = idData? 
                            ManagementService.updateData
                            : 
                            ManagementService.createData

    return { loading, prevValues, handleSubmit }
}

export default useForm




