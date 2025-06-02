import { useEffect, useMemo, useState } from 'react'
import * as Yup from 'yup'
import { datatypes } from '@/data'
import { useGenericForm, ManagementService } from '@/logic'
import useFetchProfessors from './useFetchProfessors'

/**
 * @description Ventana para configurar o aprobar un tribunal.
 * @param {bool} `isDefenseTribunal`- Binario que expresa si es un formulario de configurar o aprobar tribunal.
 * @param {function} `closeFunc`- Función para cerrar el formulario.
 * @param {Object} `prevValues`- Contiene toda la información del acta de defensa a mostrar.
 * @returns Estructura de los campos a mostrar con la información del acta de defensa contenida en prevValues.
 */
const useDefenseTribunalForm = (isDefenseTribunal, closeFunc, prevValues) => {
    const initialValues = isDefenseTribunal?
        {
            defenseDate: prevValues?.defense_date instanceof Date?
                prevValues?.defense_date?.toISOString().split('T')[0] 
                :
                prevValues?.defense_date || '',
            president: prevValues?.president || '',
            secretary: prevValues?.secretary || '',
            vocal: prevValues?.vocal || '',
            opponent: prevValues?.opponent || '',
            tutorCant: prevValues?.tutors?.length || 1,
            tutors: prevValues?.tutors || Array(prevValues?.tutors?.length || 1).fill('')
        }
        :
        { state: prevValues?.state || '' }
    
    const [ selectedProfessors, setSelectedProfessors ] = useState([])
    const professors = useFetchProfessors()

    const validationSchema = useMemo(() => {
        return isDefenseTribunal?
            Yup.object().shape({
                defenseDate: Yup.string()
                    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha incorrecto') // Valida formato YYYY-MM-DD
                    .test('valid-date', 'La fecha debe ser después de hoy', value => {
                        if (!value) return false
                        const selectedDate = new Date(value)
                        const today = new Date()
                        today.setHours(0, 0, 0, 0) // Elimina la hora para comparar solo la fecha
                        return selectedDate >= today
                    }),
        
                president: Yup.string()
                    .required('El presidente es requerido'),
            
                secretary: Yup.string()
                    .required('El secretario es requerido'),
                
                vocal: Yup.string()
                    .required('El vocal es requerido'),

                opponent: Yup.string()
                    .required('El vocal es requerido'),

                tutorCant: Yup.number()
                    .required('La cantidad de tutor(es) es obligatoria')
                    .min(1, 'El estudiante debe tener como mínimo un(1) tutor')
                    .max(4, 'El estudiante debe tener como máximo cuatro(4) tutores'),
                
                tutors: Yup.array()
                    .of(Yup.string().required('Debe seleccionar un tutor'))
                    .min(Yup.ref('tutorCant'), 'Debe seleccionar todos los tutores especificados')
                    .max(Yup.ref('tutorCant'), 'No debe seleccionar más tutores de los especificados')
            })
            :
            Yup.object().shape({
                state: Yup.string()
                    .required('Debe seleccionar "Aprobar" o "Desaprobar".')
                    .oneOf(['A', 'D'])
            })
    }, [isDefenseTribunal])

    const submitFunction = async (values) => {
        const newValues = {
            id: prevValues?.id,
            student: prevValues?.student,
            selected_ece: prevValues?.selected_ece,
            president: values?.president || prevValues?.president,
            secretary: values?.secretary || prevValues?.secretary,
            vocal: values?.vocal || prevValues?.vocal,
            opponent: values?.opponent || prevValues?.opponent,
            tutors: values?.tutors || prevValues?.tutors,
            defense_date: values?.defenseDate || prevValues?.defense_date,
            state: values?.state || prevValues?.state,
        }

        let success = false
        let message = ''
        
        const response = await ManagementService.updateData(datatypes.defense_tribunal, prevValues.id, newValues)
        
        success = response?.success
        message = response?.message

        closeFunc()

        return {
            success,
            message,
        }
    }

    const formik = useGenericForm(submitFunction, initialValues, validationSchema)
    
    useEffect(() => {
        const updatedSelections = Object.entries(formik.values)
            .filter(([key]) => ['president', 'secretary', 'vocal', 'opponent', 'tutors'].includes(key))
            .flatMap(([key, value]) => key === 'tutors' && Array.isArray(value) ? value : [value])
            .filter(value => value !== '')

        setSelectedProfessors(updatedSelections)
    }, [formik.values])

    return { professors, selectedProfessors, formik}
}

export default useDefenseTribunalForm