import { useMemo, useRef } from 'react'
import * as Yup from 'yup'
import { datatypes } from '@/data'
import { useGenericForm, ManagementService } from '@/logic'

/**
 * @description Hook asociado al componente para agregar o editar un acta de defensa.
 * @param {bool} `isEdition`- Binario que expresa si es un formulario de edición o no.
 * @param {function} `closeFunc`- Función para cerrar el formulario.
 * @param {string} `studentId` - Id del estudiante al cual está asociada el acta de defensa.
 * @param {Object} `prevValues`- Contiene toda la información del acta de defensa a mostrar.
 * @returns Valores necesarios para el componente a renderizar.
 */
const useEvidenceForm = (isEdition, closeFunc, studentId, prevValues) => {
    const initialValues = {
        name: prevValues?.name || '',
        description: prevValues?.description || '',
        attachmentType: prevValues?.attachment_type || '',
        url: prevValues?.attachment_url || '',
        file: prevValues?.attachment_file || null
    }

    const validateUrl = (urlString) => {
        try {
            const urlObject = new URL(urlString)
            console.log('URL válida:', urlObject.href)
            return true
        } catch (error) {
            console.error('La URL ingresada no es válida', error)
            return false
        }        
    }

    const MAX_FILE_SIZE = 100 * 1024 * 1024

    const validationSchema = useMemo(() => Yup.object().shape({
        name: Yup.string()
            .min(4, 'El nombre debe tener al menos 4 caracteres')
            .required('El nombre es obligatorio')
            .matches(/^[0-9a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, 'No se permiten caracteres especiales'),
        
        description: Yup.string(),
        
        attachmentType: Yup.string()
            .required('El tipo de adjunto es obligatorio')   
            .oneOf(['url', 'file']),
        
        url: Yup.string()
            .when('attachmentType', {
                is: 'url',
                then: (schema) => {
                    return schema.required('La URL es obligatoria')
                        .test(
                            'is-valid-url',
                            'Debe ser una URL válida',
                            (value) => !!value && validateUrl(value)
                        )
                },
                otherwise: (schema) => schema.notRequired()
        }),

        file: Yup.lazy((value, context) => {
            return context.parent.attachmentType === 'file'?
                Yup.mixed().required('El archivo es obligatorio')
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
                            'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                            'video/mp4', 'video/x-matroska', 'video/x-msvideo', 'video/x-flv'
                        ].includes(file.type)
                    )
                :
                Yup.mixed().notRequired()
        })
    }), [MAX_FILE_SIZE])

    const submitFunction = async (values) => {
        const newValues = {
            student: prevValues?.student || studentId,
            name: values?.name || prevValues?.name,
            description: values?.description || prevValues?.description,
            attachment_type: values?.attachmentType || prevValues?.attachment_type,
            attachment_url: values?.url || prevValues?.attachment_url,
            attachment_file: values?.file || prevValues?.attachment_file,
        }

        let success = false
        let message = ''

        if (isEdition) {
            const response = await ManagementService.updateData(datatypes.evidence, prevValues.id, newValues)
            success = response?.success
            message = response?.message
        } else {
            const response = await ManagementService.createData(datatypes.evidence, newValues)
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

    const fileInputRef = useRef(null)

    const handleAttachmentTypeChange = (e) => {
        const attachmentType = e.target.value

        if (formik.values.attachmentType !== attachmentType) {
            formik.setValues({
                ...formik.values,
                attachmentType,
                url: '',
                file: null,
            })
            if (fileInputRef.current) 
                fileInputRef.current.value = ''
        }
    }

    return { handleAttachmentTypeChange, fileInputRef, formik }
}

export default useEvidenceForm