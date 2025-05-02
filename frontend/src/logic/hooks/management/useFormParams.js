import { useState } from 'react'
import { datatypes } from '@/data'
import { useModal } from '../'

const useFormParams = (datatype) => {
    const [ manageFormParams, setManageFormParams ] = useState({datatype: datatype})
    const { openModal, closeModal } = useModal()

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

export default useFormParams