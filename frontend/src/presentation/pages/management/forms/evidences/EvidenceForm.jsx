/* eslint-disable react/prop-types */
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
        
        description: Yup.string()
            .required('La descripción es obligatoria'),
        
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
        const attachmentType = e.target.value;
        formik.setFieldValue('attachmentType', attachmentType);
        
        if (attachmentType === 'url') {
            formik.setFieldValue('url', '');
        } else {
            formik.setFieldValue('file', null);
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
                className="error"
                style={formik.errors.name && formik.touched.name ? {} : { visibility: "hidden" }}
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
                className="error"
                style={formik.errors.description && formik.touched.description ? {} : { visibility: "hidden" }}
                >
                {formik.errors.description}
            </span>

            <label className='form-label'>
                Tipo de adjunto:
            </label>

            <div className="radio-group">
                <label className="radio-label">
                    <input
                        type="radio"
                        name="isUrl"
                        value="true"
                        checked={formik.values.isUrl === true}
                        onChange={handleAttachmentTypeChange}
                    />
                    <span>URL Externa</span>
                </label>
                
                <label className="radio-label">
                    <input
                        type="radio"
                        name="isUrl"
                        value="false"
                        checked={formik.values.isUrl === false}
                        onChange={handleAttachmentTypeChange}
                    />
                    <span>Archivo Local</span>
                </label>
            </div>

            {formik.values.isUrl ? (
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
                        className="error"
                        style={formik.errors.url && formik.touched.url ? {} : { visibility: "hidden" }}
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
                        className="error"
                        style={formik.errors.file && formik.touched.file ? {} : { visibility: "hidden" }}
                        >
                        {formik.errors.file}
                    </span>
                </>
            )}

            {prevValues.adjunto && (
                <>
                    <label className='form-label'>
                        Adjunto actual:
                    </label>
                    
                    <div className="current-attachment">
                        {prevValues.isUrl ? (
                            <a href={prevValues.adjunto} target="_blank" rel="noopener noreferrer">
                                {prevValues.adjunto}
                            </a>
                        ) : (
                            <span>{prevValues.adjunto.name || "Archivo cargado"}</span>
                        )}
                    </div>
                </>
            )}

            <FormButtons modalId={modalId} closeModal={closeModal} isValid={formik.isValid}/>        
        </form>
    )
}

export default EvidenceForm