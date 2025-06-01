import PropTypes from 'prop-types'
import { FilePreviewer, FormButtons, TextAreaField } from '@/presentation'
import { useEvidenceForm } from '@/logic'

/**
 * @description Ventana para agregar o editar un acta de defensa.
 * @param {bool} `isEdition`- Binario que expresa si es un formulario de edición o no.
 * @param {function} `closeFunc`- Función para cerrar el formulario.
 * @param {string} `studentId` - Id del estudiante al cual está asociada el acta de defensa.
 * @param {Object} `prevValues`- Contiene toda la información del acta de defensa a mostrar.
 * @returns Estructura de los campos a mostrar con la información del acta de defensa contenida en prevValues.
 */
const EvidenceForm = ({ isEdition, closeFunc, studentId, prevValues}) => {
    const { handleAttachmentTypeChange, fileInputRef, formik } = useEvidenceForm(isEdition, closeFunc, studentId, prevValues)

    return (
        <form
            className='form-container'
            onSubmit={formik.handleSubmit}
            >
            <h1 
                className='form-title'
                >
                {isEdition? 'Modificar' : 'Registrar'} evidencia
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
                        className={`error ${!(formik.errors.name && formik.touched.name && 'hidden')}`}
                        >
                        {formik.errors.name}
                    </span>

                    <label 
                        className='form-label' 
                        htmlFor='description'
                        >
                        Descripción:
                    </label>
                    
                    <TextAreaField 
                        id='description'
                        placeholder='Describa la evidencia...'
                        formikProps={formik.getFieldProps('description')}
                        />
                
                    <span
                        className={`error ${!(formik.errors.description && formik.touched.description && 'hidden')}`}
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
                        className='form-radio-container'
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

                    <span
                        className={`error ${!(formik.errors.attachmentType && formik.touched.attachmentType && 'hidden')}`}
                        >
                        {formik.errors.attachmentType}
                    </span>
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
                            className={`error ${
                                formik.values.attachmentType === 'url'?
                                    !(formik.errors.url && formik.touched.url && 'hidden')
                                    :
                                    !(formik.errors.file && formik.touched.file && 'hidden')
                            }`}
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
        attachment_url: PropTypes.string.isRequired,
        attachment_file: PropTypes.instanceOf(File).isRequired,
    }),
}

export default EvidenceForm