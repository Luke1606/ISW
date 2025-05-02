import PropTypes from 'prop-types'
import { useMemo } from 'react'
import * as Yup from 'yup'
import { datatypes } from '@/data'
import { useGenericForm } from '@/logic'
import { FormButtons } from '@/presentation'

const EvidenceForm = ({modalId, closeModal, prevValues, handleSubmit}) => {
    const initialValues = {
        name: prevValues?.name || '',
        description: prevValues?.description || '',
        attachmentType: prevValues.attachment_type || '',
        url: prevValues?.attachment_url || '',
        file: prevValues?.attachment_file || null
    }

    const validationSchema = useMemo(() => Yup.object().shape({
        name: Yup.string()
            .min(4, 'El nombre debe tener al menos 4 caracteres')
            .required('El nombre es obligatorio')
            .matches(/^[\w\s]+$/, 'No se permiten caracteres especiales'),
        
        description: Yup.string(),
        
        attachment_type: Yup.string()
            .required('El tipo de adjunto es obligatorio')   
            .oneOf(['url', 'file']),
        
        url: Yup.string()
            .when('attachmentType', {
                is: 'url',
                then: Yup.string()
                    .required('La URL es obligaroria')
                    .url('Debe ser una URL válida'),
                otherwise: Yup.string().notRequired()
            }),
            
        file: Yup.mixed()
            .when('attachmentType', {
                is: 'file',
                then: Yup.mixed()
                    .required('El archivo es obligatorio'),
                otherwise: Yup.mixed().notRequired()
            })
    }), [])

    const submitFunction = async (values) => {
        const newValues = {
            name: values?.name,
            description: values?.description,
            attachmentType: values.attachment_type,
            url: values?.attachment_url,
            file: values?.attachment_file
        }
        await handleSubmit(datatypes.evidence, prevValues?.id, newValues)
        closeModal(modalId)
    }

    const formik = useGenericForm(submitFunction, initialValues, validationSchema)

    const handleAttachmentTypeChange = (e) => {
        const attachmentType = e.target.value
        formik.setFieldValue('attachmentType', attachmentType)
        
        if (attachmentType === 'url') {
            formik.setFieldValue('url', '')
        } else {
            formik.setFieldValue('file', null)
        }
    }

    return (
        <form
            className='form-container manage-form'
            onSubmit={formik.handleSubmit}
            >
            <label className='form-label' htmlFor='name'>
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

            <label className='form-label' htmlFor='description'>
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

            <label className='form-label'>
                Tipo de adjunto:
            </label>

            <div className='radio-group'>
                <label className='radio-label'>
                    <input
                        type='radio'
                        name='attachmentType'
                        value='url'
                        checked={formik.values.attachmentType === 'url'}
                        onChange={handleAttachmentTypeChange}
                    />
                    <span>URL Externa</span>
                </label>
                
                <label className="radio-label">
                    <input
                        type='radio'
                        name='attachmentType'
                        value='file'
                        checked={formik.values.attachmentType === 'file'}
                        onChange={handleAttachmentTypeChange}
                    />
                    <span>Archivo Local</span>
                </label>
            </div>

            {formik.values.attachmentType === 'url'? (
                <>
                    <label className='form-label' htmlFor='url'>
                        URL:
                    </label>
                    
                    <input
                        className='form-input'
                        id='url'
                        type='url'
                        placeholder='https://ejemplo.com'
                        value={formik.values.url}
                        onChange={formik.handleChange}
                    />
                    
                    <span
                        className='error'
                        style={formik.errors.url && formik.touched.url ? {} : { visibility: 'hidden' }}
                        >
                        {formik.errors.url}
                    </span>
                </>
            ) : (
                <>
                    <label className='form-label' htmlFor='file'>
                        Archivo:
                    </label>
                    
                    <input
                        className='form-input'
                        id='file'
                        type='file'
                        onChange={(e) => formik.setFieldValue('file', e.target.files[0])}
                        />
                    
                    <span
                        className='error'
                        style={formik.errors.file && formik.touched.file ? {} : { visibility: 'hidden' }}
                        >
                        {formik.errors.file}
                    </span>
                </>
            )}

            {(formik.values.url || formik.values.file) &&
                <>
                    <label className='form-label'>
                        Adjunto actual:
                    </label>
                    
                    <div className='current-attachment'>
                        {formik.values.attachmentType === 'url'?
                            <a href={formik.values.url} target='_blank' rel='noopener noreferrer' />
                        :
                            <img
                                src={URL.createObjectURL(formik.values.file)}
                                alt='Vista previa'
                                title='Vista previa'
                                className='file-preview'
                                />
                        }
                    </div>
                </>}

            <FormButtons modalId={modalId} closeModal={closeModal} isValid={formik.isValid}/>        
        </form>
    )
}

EvidenceForm.propTypes = {
    modalId: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    prevValues: PropTypes.shape({
        id: PropTypes.string.isRequired,
        student: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        attachment_type: PropTypes.string.isRequired,
        attachment_url: PropTypes.instanceOf(URL).isRequired,
        attachment_file: PropTypes.instanceOf(File).isRequired,
    }),
    handleSubmit: PropTypes.func.isRequired,
}

export default EvidenceForm