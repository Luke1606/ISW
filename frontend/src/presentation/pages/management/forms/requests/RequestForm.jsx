import PropTypes from 'prop-types'
import { useMemo } from 'react'
import * as Yup from 'yup'
import { datatypes } from '@/data'
import { useGenericForm } from '@/logic'
import { FormButtons } from '@/presentation'

/**
 * @description Ventana para agregar o editar un solicitud.
 * @param {string} `modalId` - Id del modal en el que se renderiza este componente.
 * @param {function} `closeModal`- Función para cerrar el modal en el que se renderiza este componente.
 * @param {Object} `prevValues`- Contiene toda la información de la solicitud a mostrar.
 * @param {function} `handleSubmit`- Función a ejecutar al envío del formulario.
 * @returns Estructura de los campos a mostrar con la información de la solicitud contenida en prevValues.
 */
const RequestForm = ({ modalId, closeModal, prevValues, handleSubmit }) => {
    const initialValues = {
        selectedECE: prevValues.selected_ece || '',
    }

    const validationSchema = useMemo(() => Yup.object().shape({
        studentName: Yup.string()
            .required('El nombre del estudiante es obligatorio')
            .min(3, 'El nombre debe tener al menos 3 caracteres'),
        
        selectedECE: Yup.string()
            .required('Debe seleccionar un ejercicio'),
            
        additionalInfo: Yup.string()
            .max(500, 'La información adicional no puede exceder los 500 caracteres')
    }), [])

    const submitFunction = async (values) => {
        const newValues = {
            student: prevValues?.student,
            selectedECE: values?.selectedECE,
        }
        await handleSubmit(datatypes.request, prevValues?.student, newValues)
        closeModal(modalId)
    }
    const formik = useGenericForm(
        submitFunction,
        initialValues,
        validationSchema
    )

    const exerciseOptions = [
        { value: 'TD', label: 'Trabajo de diploma'},
        { value: 'PF', label: 'Portafolio'},
        { value: 'AA', label: 'Defensa de Artículos Científicos'},
        { value: 'EX', label: 'Exhimición'},  
    ]

    return (
        <form
            className='form-container manage-form'
            onSubmit={formik.handleSubmit}
        >
            <label 
                className='form-label'
                htmlFor='ece-select'
                >
                Seleccione el ejercicio deseado:
            </label>
            
            <select
                className='form-select'
                id='ece-select'
                {...formik.getFieldProps('selectedECE')}
            >
                <option 
                    value='' 
                    disabled
                    >
                    -- Escoja una categoría --
                </option>
                
                {exerciseOptions.map((option) => (
                    <option 
                        key={option.value} 
                        value={option.value}
                        className='option-element'
                        >
                        {option.label}
                    </option>
                ))}
            </select>
            
            <span
                className='error'
                style={formik.errors.selectedECE && formik.touched.selectedECE ? {} : { visibility: 'hidden' }}
                >
                {formik.errors.selectedECE}
            </span>

            <FormButtons modalId={modalId} closeModal={closeModal} isValid={formik.isValid}/>
        </form>
    )
}

RequestForm.propTypes = {
    modalId: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    prevValues: PropTypes.shape({
        id: PropTypes.string.isRequired,
        student: PropTypes.string.isRequired,
        selected_ece: PropTypes.string.isRequired,
    }),
    handleSubmit: PropTypes.func.isRequired,
}

export default RequestForm