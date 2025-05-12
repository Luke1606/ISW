import PropTypes from 'prop-types'
import { useMemo } from 'react'
import * as Yup from 'yup'
import { datatypes } from '@/data'
import { useGenericForm, ManagementService } from '@/logic'
import { FormButtons } from '@/presentation'

/**
 * @description Ventana para agregar o editar un solicitud.
 * @param {bool} `isEdition`- Binario que expresa si es un formulario de edición o no.
 * @param {function} `closeFunc`- Función para cerrar el formulario.
 * @param {string} `studentId` - Id del estudiante al cual está asociada el acta de defensa.
 * @param {Object} `prevValues`- Contiene toda la información de la solicitud a mostrar.
 * @returns Estructura de los campos a mostrar con la información de la solicitud contenida en prevValues.
 */
const RequestForm = ({ closeFunc, prevValues, isEdition }) => {
    const initialValues = {
        selectedECE: prevValues?.selected_ece || '',
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
        let success = false
        let message = ''

        if (isEdition) {
            const response = await ManagementService.updateData(datatypes.request, prevValues.id, newValues)
            success = response?.success
            message = response?.message
        } else {
            const response = await ManagementService.createData(datatypes.request, newValues)
            success = response?.success
            message = response?.message
        }

        closeFunc()

        return {
            success,
            message,
        }
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
            className='form-container manage-section'
            onSubmit={formik.handleSubmit}
        >
            <label 
                className='form-label'
                htmlFor='ece-select'
                >
                Seleccione el ejercicio deseado:
            </label>
            
            <select
                className='form-input'
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

            <FormButtons closeFunc={closeFunc} isValid={formik.isValid}/>
        </form>
    )
}

RequestForm.propTypes = {
    isEdition: PropTypes.bool.isRequired,
    closeFunc: PropTypes.func.isRequired,
    prevValues: PropTypes.shape({
        id: PropTypes.string.isRequired,
        student: PropTypes.string.isRequired,
        selected_ece: PropTypes.string.isRequired,
    }),
}

export default RequestForm