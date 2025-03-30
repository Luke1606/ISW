import useDebouncedApiCall from '../common/useDebouncedApiCall'
import ManagementService from '../../services/ManagementService'

const useForm = (datatype, idData) => {
    const getPrevValues = useDebouncedApiCall(async (datatype, id) => {
        const response = await ManagementService.getData(datatype, id)
        return response? response.data : null
    })
    const prevValues = getPrevValues(datatype, idData)

    const handleSubmit = idData? 
                            ManagementService.updateData
                            : 
                            ManagementService.createData

    return { prevValues, handleSubmit }
}



export default useForm




