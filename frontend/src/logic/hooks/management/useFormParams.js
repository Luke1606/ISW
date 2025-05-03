import { useState } from 'react'
import { datatypes } from '@/data'
import { useModal } from '../'

const useFormParams = () => {
    const [ manageFormParams, setManageFormParams ] = useState({})
    const { openModal, closeModal } = useModal()

    const formModalId = 'form-modal'
    
    const openManageForm = (datatype, params={}) => {
        if (!datatype && !Object.values(datatypes).includes(datatype) && !Object.values(datatypes.user).includes(datatype)) {
            console.warn(`Se intento manejar un formulario proporcionando ${datatype} como tipo de dato, el cual no es válido`)
            return null
        }
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