import PropTypes from 'prop-types'
import { useMemo } from 'react'
import * as Yup from 'yup'
import { datatypes } from '@/data'
import { ManagementService, useGenericForm } from '@/logic'
import { FormButtons, FilePreviewer } from '@/presentation'

/**
 * @description Ventana para agregar o editar un acta de defensa.
 * @param {bool} `isEdition`- Binario que expresa si es un formulario de edición o no.
 * @param {function} `closeFunc`- Función para cerrar el formulario.
 * @param {string} `studentId` - Id del estudiante al cual está asociada el acta de defensa.
 * @param {Object} `prevValues`- Contiene toda la información del acta de defensa a mostrar.
 * @returns Estructura de los campos a mostrar con la información del acta de defensa contenida en prevValues.
 */
const DefenseActForm = ({ isEdition, closeFunc, studentId, prevValues }) => {
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
        
        description: Yup.string(),
            
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
                        'application/vnd.ms-excel', 'application/vnd.ms-powerpoint', 
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    ].includes(file.type)
            )
            .required('El archivo adjunto es requerido')
    }), [MAX_FILE_SIZE])

    const submitFunction = async (values) => {
        const newValues = {
            student: prevValues?.student || studentId,
            name: values?.name,
            description: values?.description,
            attachment: values?.attachment,
        }
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
                            className={`error ${formik.errors.name && formik.touched.name && 'hidden'}`}
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
                            className={`error ${formik.errors.description && formik.touched.description && 'hidden'}`}
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
                            className={`error ${formik.errors.attachment && formik.touched.attachment && 'hidden'}`}
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
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        attachment: PropTypes.instanceOf(File).isRequired,
    }),
    isEdition: PropTypes.bool.isRequired,
}

export default DefenseActForm