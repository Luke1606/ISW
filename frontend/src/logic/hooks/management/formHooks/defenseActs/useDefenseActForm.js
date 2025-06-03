import { useMemo } from 'react'
import * as Yup from 'yup'
import { datatypes } from '@/data'
import { ManagementService, useAuth, useGenericForm } from '@/logic'
import useAuthorName from './useAuthorName'

/**
 * @description Hook asociado al componente para agregar o editar un acta de defensa.
 * @param {bool} `isEdition`- Binario que expresa si es un formulario de edición o no.
 * @param {function} `closeFunc`- Función para cerrar el formulario.
 * @param {string} `studentId` - Id del estudiante al cual está asociada el acta de defensa.
 * @param {Object} `prevValues`- Contiene toda la información del acta de defensa a mostrar.
 * @returns Estructura de los campos a mostrar con la información del acta de defensa contenida en prevValues.
 */
const useDefenseActForm = (isEdition, closeFunc, studentId, prevValues) => {
    const initialValues = {
        name: prevValues?.name || '',
        description: prevValues?.description || '',
        attachment: prevValues?.attachment || null
    }
    
    const authorName = useAuthorName(isEdition, prevValues)

    const MAX_FILE_SIZE = 50 * 1024 * 1024

    const validationSchema = useMemo(() => Yup.object().shape({
        name: Yup.string()
            .min(4, 'El nombre debe tener al menos 4 caracteres')
            .required('El nombre es obligatorio'),
        
        description: Yup.string(),
            
        attachment: Yup.mixed()
            .required('El archivo es obligatorio')
            .test(
                'is-file',
                'El adjunto debe ser un archivo',
                (value) => value instanceof File
            )
            .test(
                'fileSize',
                'El archivo debe ser menor a 100MB',
                (file) => file && file.size <= MAX_FILE_SIZE
            )
            .test(
                'fileType',
                'Formato no permitido',
                (file) => file && [
                    'image/jpg', 'image/jpeg', 'image/png', 'image/gif', 
                    'application/pdf', 'application/msword', 
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.ms-excel', 'application/vnd.ms-powerpoint', 
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                ].includes(file.type)
            )
            .required('El archivo adjunto es requerido')
    }), [MAX_FILE_SIZE])

    const { user } = useAuth()

    const submitFunction = async (values) => {
        const newValues = {
            student: prevValues?.student || studentId,
            author: prevValues?.author || user.id,
            name: values?.name || values?.name,
            description: values?.description || prevValues?.description,
            attachment: values?.attachment || prevValues?.attachment,
        }
        console.log(newValues);
        let success = false
        let message = ''

        if (isEdition) {
            const response = await ManagementService.updateData(datatypes.defense_act, prevValues.id, newValues)
            success = response?.success
            message = response?.message
        } else {
            const response = await ManagementService.createData(datatypes.defense_act, newValues)
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

    return { authorName, user, formik }
}

export default useDefenseActForm