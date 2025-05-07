import PropTypes from 'prop-types'
import { useMemo } from 'react'
import * as Yup from 'yup'
import { datatypes } from '@/data'
import { useGenericForm } from '@/logic'
import { FormButtons, FilePreviewer } from '@/presentation'

/**
 * @description Ventana para agregar o editar un acta de defensa.
 * @param {string} `modalId` - Id del modal en el que se renderiza este componente.
 * @param {function} `closeModal`- Función para cerrar el modal en el que se renderiza este componente.
 * @param {Object} `prevValues`- Contiene toda la información del acta de defensa a mostrar.
 * @param {function} `handleSubmit`- Función a ejecutar al envío del formulario.
 * @returns Estructura de los campos a mostrar con la información del acta de defensa contenida en prevValues.
 */
const DefenseActForm = ({modalId, closeModal, prevValues, handleSubmit}) => {
    const initialValues = {
        name: prevValues?.name || '',
        description: prevValues?.description || '',
        attachment: prevValues?.attachment || null
    }

    const MAX_FILE_SIZE = 50 * 1024 * 1024

    const validationSchema = useMemo(() => Yup.object().shape({
        name: Yup.string()
            .min(4, 'El nombre debe tener al menos 4 caracteres')
            .required('El nombre es obligatorio'),
        
        description: Yup.string()
            .required('La descripción es obligatoria'),
            
        attachment: Yup.mixed().required('El archivo es obligatorio')
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
            .required('El archivo adjunto es requerido')
    }), [MAX_FILE_SIZE])

    const submitFunction = async (values) => {
        const newValues = {
            name: values?.name,
            faculty: values?.faculty,
            attachment: values?.attachment,
        }
        await handleSubmit(datatypes.defense_act, prevValues?.id, newValues)
        closeModal(modalId)
    }

    const formik = useGenericForm(submitFunction, initialValues, validationSchema)

    return (
        <form
            className='form-container'
            onSubmit={formik.handleSubmit}
            >
            <h1 
                className='form-title'
                >
                {prevValues? 'Modificar' : 'Registrar'} acta de defensa
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
                        Datos del acta de defensa
                    </h2>

                    <label 
                        className='form-label'
                        htmlFor='nombre'
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
                        title='Resumen o descripción del acta'
                        placeholder='Describa el contenido del acta'
                        {...formik.getFieldProps('description')}
                        />
                    
                    <span
                        className='error'
                        style={formik.errors.description && formik.touched.description ? {} : { visibility: 'hidden' }}
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
                        onChange={(event) => {
                            formik.setFieldValue('attachment', event.currentTarget.files[0])}}
                        />
                    
                    <span
                        className='error'
                        style={formik.errors.attachment && formik.touched.attachment ? {} : { visibility: 'hidden' }}
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

            <FormButtons modalId={modalId} closeModal={closeModal} isValid={formik.isValid}/>
        </form>
    )
}

DefenseActForm.propTypes = {
    modalId: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    prevValues: PropTypes.shape({
        id: PropTypes.string.isRequired,
        student: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        attachment: PropTypes.instanceOf(File).isRequired,
    }),
    handleSubmit: PropTypes.func.isRequired,
}

export default DefenseActForm