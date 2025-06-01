import { useMemo } from 'react'
import * as Yup from 'yup'
import { datatypes } from '@/data'
import { useGenericForm, ManagementService } from '@/logic'

/**
 * @description Ventana para agregar o editar un solicitud.
 * @param {bool} `isEdition`- Binario que expresa si es un formulario de edición o no.
 * @param {function} `closeFunc`- Función para cerrar el formulario.
 * @param {string} `studentId` - Id del estudiante al cual está asociada el acta de defensa.
 * @param {Object} `prevValues`- Contiene toda la información de la solicitud a mostrar.
 * @returns Estructura de los campos a mostrar con la información de la solicitud contenida en prevValues.
 */
const useRequestForm = (isEdition, closeFunc, prevValues) => {
    const initialValues = isEdition?
    {
        selectedECE: prevValues?.selected_ece || '',
    }
    :
    {
        state: prevValues?.state || '',
    }

    const validationSchema = useMemo(() => {
        return isEdition?
            Yup.object().shape({
                state: Yup.string()
                    .required('Debe seleccionar un veredicto')
            })
            :
            Yup.object().shape({
                selectedECE: Yup.string()
                    .required('Debe seleccionar un ejercicio')
            })
    }, [isEdition])

    const submitFunction = async (values) => {
        const newValues = isEdition?
        {
            student: prevValues?.student,
            state: values?.state,
        }
        :
        {
            student: prevValues?.student,
            selected_ece: values?.selectedECE,
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

    const formik = useGenericForm(submitFunction, initialValues, validationSchema)
    
    return { formik }
}

export default useRequestForm