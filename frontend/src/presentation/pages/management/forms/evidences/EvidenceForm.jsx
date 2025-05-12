import PropTypes from 'prop-types'
import { useMemo, useRef } from 'react'
import * as Yup from 'yup'
import { datatypes } from '@/data'
import { useGenericForm, ManagementService } from '@/logic'
import { FilePreviewer, FormButtons } from '@/presentation'

/**
 * @description Ventana para agregar o editar un acta de defensa.
 * @param {bool} `isEdition`- Binario que expresa si es un formulario de edición o no.
 * @param {function} `closeFunc`- Función para cerrar el formulario.
 * @param {string} `studentId` - Id del estudiante al cual está asociada el acta de defensa.
 * @param {Object} `prevValues`- Contiene toda la información del acta de defensa a mostrar.
 * @returns Estructura de los campos a mostrar con la información del acta de defensa contenida en prevValues.
 */
const EvidenceForm = ({ isEdition, closeFunc, studentId, prevValues}) => {
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
            .matches(/^[\w\s]+$/, 'No se permiten caracteres especiales'),
        
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
            name: values?.name,
            description: values?.description,
            attachmentType: values?.attachmentType,
            url: values?.url,
            file: values?.file
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

    return (
        <form
            className='form-container'
            onSubmit={formik.handleSubmit}
            >
            <h1 
                className='form-title'
                >
                {prevValues? 'Modificar' : 'Registrar'} evidencia
            </h1>
            
            <section 
                className='multi-layered-form'
                >
                <section 
                    className='manage-section'
                    >
                    <h2 
                        className='form-subtitle'
                        >
                        Datos de la evidencia
                    </h2>

                    <label 
                        className='form-label' 
                        htmlFor='name'
                        >
                        Nombre de la evidencia:
                    </label>

                    <input
                        className='form-input'
                        id='name'
                        type='text'
                        placeholder='Ej: Informe final 2023'
                        {...formik.getFieldProps('name')}
                        />
                    
                    <span
                        className='error'
                        style={formik.errors.name && formik.touched.name ? {} : { visibility: 'hidden' }}
                        >
                        {formik.errors.name}
                    </span>

                    <label 
                        className='form-label' 
                        htmlFor='description'
                        >
                        Descripción:
                    </label>
                    
                    <textarea
                        className='form-input'
                        id='description'
                        rows='4'
                        placeholder='Describa la evidencia...'
                        {...formik.getFieldProps('description')}
                        />
                
                    <span
                        className='error'
                        style={formik.errors.description && formik.touched.description ? {} : { visibility: 'hidden' }}
                        >
                        {formik.errors.description}
                    </span>

                    <label 
                        className='form-label'
                        htmlFor='attachment-type'
                        >
                        Tipo de adjunto:
                    </label>

                    <div 
                        className='form-radio-group'
                        id='attachment-type'
                        >
                        <label 
                            className='form-radio-option'
                            >
                            <input
                                className='form-input'
                                type='radio'
                                name='attachmentType'
                                value='url'
                                checked={formik.values.attachmentType === 'url'}
                                onChange={handleAttachmentTypeChange}
                                />
                            URL Externa
                        </label>
                        
                        <label 
                            className='form-radio-option'
                            >
                            <input
                                className='form-input'
                                type='radio'
                                name='attachmentType'
                                value='file'
                                checked={formik.values.attachmentType === 'file'}
                                onChange={handleAttachmentTypeChange}
                                />
                            Archivo Local
                        </label>
                    </div>
                </section>

                {formik.values.attachmentType &&
                    <section
                        className='manage-section'
                        >
                        <h2 
                            className='form-subtitle'
                            >
                            Adjunto
                        </h2>

                        <div  
                            style={formik.values.attachmentType === 'url'? {} : { display: 'none' }}
                            >
                            <label 
                                className='form-label' 
                                htmlFor='url'
                                >
                                URL:
                            </label>
                            
                            <input
                                className='form-input'
                                id='url'
                                type='url'
                                placeholder='https://ejemplo.com'
                                {...formik.getFieldProps('url')}
                                />
                        </div>

                        <div
                            style={formik.values.attachmentType === 'file'? {} : { display: 'none' }}
                            >
                            <label 
                                className='form-label' 
                                htmlFor='file'
                                >
                                Archivo:
                            </label>
                            
                            <input
                                className='form-input'
                                id='file'
                                type='file'
                                accept='
                                    image/jpg, image/jpeg, image/png, image/gif, 
                                    application/pdf,application/msword,
                                    application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                                    application/vnd.ms-excel, application/vnd.ms-powerpoint, 
                                    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                                    application/vnd.openxmlformats-officedocument.presentationml.presentation,
                                    video/mp4, video/x-matroska, video/x-msvideo, video/x-flv
                                '
                                ref={fileInputRef}
                                onChange={(event) => formik.setFieldValue('file', event.currentTarget.files[0])}
                                onBlur={formik.handleBlur}
                                />
                        </div>
                    
                        <span
                            className='error'
                            style={formik.values.attachmentType === 'url'?
                                formik.errors.url && formik.touched.url? {} : { visibility: 'hidden' }
                                :
                                formik.errors.file && formik.touched.file? {} : { visibility: 'hidden' }
                            }
                            >
                            {formik.values.attachmentType === 'url'?
                                formik.errors.url
                                :
                                formik.errors.file}
                        </span>

                        {(formik.values.url || formik.values.file) &&
                            <>
                                <label className='form-label'>
                                    Adjunto actual:
                                </label>
                                
                                {formik.values.attachmentType === 'url'?
                                    <a 
                                        className='form-label'
                                        href={formik.values.url} 
                                        target='_blank' 
                                        rel='noopener noreferrer'>
                                        {formik.values.url}
                                    </a>
                                    :
                                    <FilePreviewer 
                                        source={formik.values.file}
                                        />}
                            </>}
                    </section>}
            </section>

            <FormButtons closeFunc={closeFunc} isValid={formik.isValid}/>        
        </form>
    )
}

EvidenceForm.propTypes = {
    isEdition: PropTypes.bool.isRequired,
    closeFunc: PropTypes.func.isRequired,
    studentId: PropTypes.string.isRequired,
    prevValues: PropTypes.shape({
        id: PropTypes.string.isRequired,
        student: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        attachment_type: PropTypes.string.isRequired,
        attachment_url: PropTypes.instanceOf(URL).isRequired,
        attachment_file: PropTypes.instanceOf(File).isRequired,
    }),
}

export default EvidenceForm