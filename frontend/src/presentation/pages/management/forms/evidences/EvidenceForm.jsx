/* eslint-disable react/prop-types */
import { useMemo } from 'react'
import * as Yup from 'yup'
import { useGenericForm } from '@/logic'

const EvidenceForm = ({ values = {}, functions = {} }) => {
    const prevValues = values.prevValues || {};

    const initialValues = {
        name: prevValues?.name || '',
        description: prevValues?.description || '',
        isUrl: values.isUrl || false,
        url: prevValues?.url || '',
        file: null
    };

    const validationSchema = useMemo(() => Yup.object().shape({
        name: Yup.string()
            .min(4, 'El nombre debe tener al menos 4 caracteres')
            .required('El nombre es obligatorio')
            .matches(/^[\w\s]+$/, 'No se permiten caracteres especiales'),
        
        description: Yup.string()
            .required('La descripción es obligatoria'),
        
        url: Yup.string()
            .when('isUrl', {
                is: true,
                then: Yup.string().url('Debe ser una URL válida').required('La URL es requerida'),
                otherwise: Yup.string().notRequired()
            }),
            
        file: Yup.mixed()
            .when('isUrl', {
                is: false,
                then: Yup.mixed().required('El archivo es requerido'),
                otherwise: Yup.mixed().notRequired()
            })
    }), []);

    const { formik, formState } = useGenericForm(
        functions.handleSubmit || (() => {}),
        initialValues,
        validationSchema
    );

    const handleAttachmentTypeChange = (e) => {
        const isUrl = e.target.value === 'true';
        formik.setFieldValue('isUrl', isUrl);
        
        if (!isUrl) {
            formik.setFieldValue('url', '');
        } else {
            formik.setFieldValue('file', null);
        }
    };

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

            <div className="button-container">
                <button
                    className='accept-button'
                    type='submit'
                    disabled={formState.pending || !formik.isValid}
                >
                    {formState.pending ? 'Guardando...' : 'Aceptar'}
                </button>

                <button
                    className='cancel-button'
                    type='button'
                    onClick={functions.goBack || (() => {})}
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
};

export default EvidenceForm