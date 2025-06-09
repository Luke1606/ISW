import PropTypes from 'prop-types'
import { createContext, useState, useEffect, useRef } from 'react'
import { useModal } from '../'
import { datatypes } from '@/data'

/**
 * @description Contexto diseñado para manejo centralizado de formularios.
 */
const FormContext = createContext()

/**
 * @description Provider diseñado para manejo del {@link FormContext}
 * @param {React.ReactNode} children
 * @returns Provider que permite a los componentes hijos acceder a los estados {@link manageFormParams} 
 * y para abrir los formularios con las funciones {@link openManageForm}, {@link closeManageForm} y con 
 * {@link isManageFormOpen}.
 */
const FormProvider = ({ children }) => {
    const [ manageFormParams, setManageFormParams ] = useState({
        datatype: null, 
        relatedUserId: null 
    })
    
    const openingRef = useRef(false)
    const formModalId = 'form-modal'
    
    const { openModal, closeModal, isOpen } = useModal()
    
    const openManageForm = (datatype, params={}) => {
        if (!datatype || (![
            ...Object.values(datatypes), 
            datatypes.user.professor, 
            datatypes.user.student
        ].includes(datatype))) {
            console.warn(
                `Se intentó manejar un formulario proporcionando ${datatype} como tipo de dato, 
                el cual no es válido`
            )
            return null
        }
        const formParams = {
            datatype: datatype,
            ...params
        }
        openingRef.current = true
        setManageFormParams(formParams)
    }

    useEffect(() => {
        if (openingRef.current && manageFormParams.datatype) {
            openModal(formModalId)
            openingRef.current = false
        }
    }, [ openModal, manageFormParams ])
    
    const closeManageForm = () => {
        closeModal(formModalId)
    }

    const isManageFormOpen = () => isOpen(formModalId)

    return (
        <FormContext.Provider 
            value={{ 
                openManageForm, 
                closeManageForm, 
                isManageFormOpen, 
                manageFormParams 
            }}
            >
            {children}
        </FormContext.Provider>
    )
}

FormProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export { FormContext, FormProvider}