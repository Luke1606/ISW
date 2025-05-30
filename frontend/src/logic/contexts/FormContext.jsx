import PropTypes from 'prop-types'
import { createContext, useState, useEffect, useRef } from 'react'
import { useModal } from '../'
import { datatypes } from '@/data'

const FormContext = createContext()

const FormProvider = ({ children }) => {
    const [ manageFormParams, setManageFormParams ] = useState({ datatype: null, relatedUserId: null })
    
    const opening = useRef(false)
    const formModalId = 'form-modal'
    
    const { openModal, closeModal, isOpen } = useModal()
    
    const openManageForm = (datatype, params={}) => {
        if (!datatype || !Object.values(datatypes).includes(datatype) && !Object.values(datatypes.user).includes(datatype)) {
            console.warn(`Se intento manejar un formulario proporcionando ${datatype} como tipo de dato, el cual no es válido`)
            return null
        }
        const formParams = {
            datatype: datatype,
            ...params
        }
        opening.current = true
        setManageFormParams(formParams)
    }

    useEffect(() => {
        if (opening.current && manageFormParams.datatype) {
            openModal(formModalId)
            opening.current = false
        }
    }, [openModal, manageFormParams])
    
    const closeManageForm = () => {
        closeModal(formModalId)
    }

    const isManageFormOpen = () => isOpen(formModalId)

    return (
        <FormContext.Provider value={{ manageFormParams, openManageForm, closeManageForm, isManageFormOpen }}>
            {children}
        </FormContext.Provider>
    )
}

FormProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export { FormContext, FormProvider}