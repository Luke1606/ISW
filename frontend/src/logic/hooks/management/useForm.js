import { useEffect, useState } from 'react'
import useDebouncedFunction from '../common/useDebouncedFunction'
import ManagementService from '../../services/ManagementService'
import NotificationService from '../../services/NotificationService'
import { useLoading, useModal } from '../common/useContexts'
import datatypes from '../../../data/datatypes'

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

const useFormParams = (datatype) => {
    const [ manageFormParams, setManageFormParams ] = useState({datatype: datatype})
    const { openModal, closeModal } = useModal()
    console.log(datatype);
    if (!datatype && !Object.values(datatypes).includes(datatype) && !Object.values(datatypes.user).includes(datatype)) {
        console.warn(`Se intento manejar un formulario proporcionando ${datatype} como tipo de dato, el cual no es válido`)
        return null
    }
    const formModalId = 'form-modal'
    
    const openManageForm = (datatype, params={}) => {
        const formParams = {
            datatype: datatype,
            ...params
        }
        setManageFormParams(formParams)
        openModal(formModalId)
    }

    const closeManageForm = () => {
        closeModal(formModalId)
    }

    return { manageFormParams, openManageForm, closeManageForm, formModalId}
}

export { useForm, useFormParams }




