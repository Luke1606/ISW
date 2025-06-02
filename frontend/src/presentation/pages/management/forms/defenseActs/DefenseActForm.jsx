import PropTypes from 'prop-types'
import { FormButtons, FilePreviewer, TextAreaField } from '@/presentation'
import { useDefenseActForm } from '@/logic'

/**
 * @description Ventana para agregar o editar un acta de defensa.
 * @param {bool} `isEdition`- Binario que expresa si es un formulario de edición o no.
 * @param {function} `closeFunc`- Función para cerrar el formulario.
 * @param {string} `studentId` - Id del estudiante al cual está asociada el acta de defensa.
 * @param {Object} `prevValues`- Contiene toda la información del acta de defensa a mostrar.
 * @returns Estructura de los campos a mostrar con la información del acta de defensa contenida en prevValues.
 */
const DefenseActForm = ({ isEdition, closeFunc, studentId, prevValues }) => {
    const { authorName, user, formik } = useDefenseActForm(isEdition, studentId, closeFunc, prevValues)

    return (
        <form
            className='form-container'
            onSubmit={formik.handleSubmit}
            >
            <h1 
                className='form-title'
                >
                {isEdition? 'Modificar' : 'Registrar'} acta de defensa
            </h1>

            { isEdition && !prevValues?
            <section className='manage-section'>
                <h2 className='form-subtitle'>
                    No se encontraron los valores para la edición
                </h2>

                <button
                    className='accept-button'
                    type='button'
                    onClick={closeFunc}
                    >
                    Aceptar
                </button>
            </section>
            :
            <>
                <section 
                    className='multi-layered-form'
                    >
                    <section 
                        className='manage-section'
                        >
                        <h2 
                            className='form-subtitle'
                            >
                            Datos del acta de defensa
                        </h2>

                        <label 
                            className='form-label'
                            htmlFor='author'
                            >
                            Nombre del autor:
                        </label>
                        
                        <input
                            className='form-input'
                            id='author'
                            type='text'
                            title='Nombre del autor del acta'
                            value={isEdition? authorName : user?.name}
                            readOnly
                            />

                        <label 
                            className='form-label'
                            htmlFor='name'
                            >
                            Nombre del acta:
                        </label>
                        
                        <input
                            className='form-input'
                            id='name'
                            type='text'
                            title='Nombre asociado al acta de defensa'
                            placeholder='Ej: Evaluación del primer corte de tesis'
                            {...formik.getFieldProps('name')}
                            />
                        
                        <span
                            className={`error ${!(formik.errors.name && formik.touched.name) && 'hidden'}`}
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
                            placeholder='Describa el contenido del acta...'
                            formikProps={formik.getFieldProps('description')}
                            />
                        
                        <span
                            className={`error ${!(formik.errors.description && formik.touched.description) && 'hidden'}`}
                            >
                            {formik.errors.description}
                        </span>
                    </section> 
                    
                    <section
                        className='manage-section'
                        >
                        <label 
                            className='form-label' 
                            htmlFor='attachment'
                            >
                            Documento adjunto:
                        </label>
                        
                        <input
                            className='form-input'
                            id='attachment'
                            type='file'
                            accept='
                                image/jpg, image/jpeg, image/png, image/gif, 
                                application/pdf, application/msword, 
                                application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                                application/vnd.ms-excel, application/vnd.ms-powerpoint, 
                                application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                                application/vnd.openxmlformats-officedocument.presentationml.presentation,
                            '
                            onChange={(event) => {
                                formik.setFieldValue('attachment', event.currentTarget.files[0])}}
                            />
                        
                        <span
                            className={`error ${!(formik.errors.attachment && formik.touched.attachment) && 'hidden'}`}
                            >
                            {formik.errors.attachment}
                        </span>

                        {formik.values.attachment &&
                            <>
                                <label className='form-label'>
                                    Adjunto actual:
                                </label>
                                
                                <FilePreviewer 
                                    source={formik.values.attachment}
                                    />
                            </>}
                    </section>
                </section>

                <FormButtons closeFunc={closeFunc} isValid={formik.isValid}/>
            </>}
        </form>
    )
}

DefenseActForm.propTypes = {
    closeFunc: PropTypes.func.isRequired,
    studentId: PropTypes.string.isRequired,
    prevValues: PropTypes.shape({
        id: PropTypes.string.isRequired,
        student: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        attachment: PropTypes.instanceOf(File).isRequired,
    }),
    isEdition: PropTypes.bool.isRequired,
}

export default DefenseActForm