import PropTypes from "prop-types"
import * as Yup from 'yup'
import { useMemo } from 'react'
import useGenericForm from '../../../../../logic/hooks/common/useGenericForm'
import datatypes from '../../../../../data/datatypes'

/**
 * @description Ventana para agregar o editar un usuario ya sea profesor o estudiante.
 * @param {string} `usertype`- Tipo de usuario a manejar con este componente.
 * @param {string} `modalId` - Id del modal en el que se renderiza este componente.
 * @param {function} `closeModal`- Función para cerrar el modal en el que se renderiza este componente.
 * @param {Object} `prevValues`- Contiene toda la información del usuario a mostrar.
 * @param {function} `handleSubmit`- Función a ejecutar al envío del formulario.
 * @returns Estructura de los campos a mostrar con la información del usuario contenida en `prevValues`.
 */
const UserForm = ({usertype, modalId, closeModal, prevValues, handleSubmit}) => {
    let specificInitialValues 

    if (usertype === datatypes.user.student)
        specificInitialValues = {
            faculty: prevValues?.faculty || '',
            group: prevValues?.group || ''
        }
    else 
        specificInitialValues = {
            role: prevValues?.user?.user_role || '',
        }

    let specificSchema

    if (usertype === datatypes.user.student)
        specificSchema = {
            faculty: Yup.string()
                .when('role', (role, schema) => 
                    role === datatypes.user.student ? 
                        schema.required('La facultad es requerida')
                        :
                        schema.notRequired()
                ),
            group: Yup.number()
                .when('role', (role, schema) => 
                    role === datatypes.user.student ? 
                        schema.required('El grupo es requerido')
                        : 
                        schema.notRequired()
                )
        }
    else
        specificSchema = {
            role: Yup.string().required('El rol es obligatorio'),
        }

    const initialValues = {
        ...specificInitialValues,
        name: prevValues?.user?.name || '',
        username: prevValues?.user?.username || '',
    }

    const validationSchema = useMemo(() => Yup.object().shape({
        name: Yup.string()
            .min(10, 'El nombre de usuario debe tener al menos 4 caracteres')
            .required('El nombre de usuario es obligatorio')
            .matches(/^[a-zA-Z\s]*$/, 'El nombre no puede contener números ni caracteres especiales'),

        username: Yup.string()
            .min(3, 'El nombre de usuario debe tener al menos 4 caracteres')
            .required('El nombre de usuario es obligatorio')
            .matches(/^[a-zA-Z0-9]*$/, 'El nombre no puede contener caracteres especiales ni espacios'),
        ...specificSchema   
    }), [specificSchema])

    const submitFunction = async (values) => {
        const newValues = {
            user: {
                name: values?.name,
                username: values?.username,
            },
            faculty: values?.faculty,
            group: values?.group,
        }
        await handleSubmit(usertype, prevValues?.user?.id, newValues)
        closeModal(modalId)
    }

    const formik = useGenericForm(submitFunction, initialValues, validationSchema)

    return (
        <form
            className='form-container manage-form' 
            onSubmit={formik.handleSubmit}
            >
            <label 
                className='form-label' 
                htmlFor='name'
                >
                Nombre: 
            </label>

            <input 
                className='form-input' 
                id='name'
                type='text'
                title='Nombre completo del usuario'
                placeholder='Introduzca el nombre y los apellidos'
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
                htmlFor='username'
                > 
                Nombre de usuario: 
            </label>
            
            <input 
                className='form-input' 
                id='username' 
                type='text'  
                title='Nombre de usuario a usar en la autenticación'
                placeholder='Introduzca el nombre de usuario por el que se autenticará'
                {...formik.getFieldProps('username')}
                />

            <span
                className='error'
                style={formik.errors.username && formik.touched.username ? {} : { visibility: 'hidden' }}
                >
                {formik.errors.username}
            </span>
        
            { usertype === datatypes.user.student? 
                <>
                    <label 
                        className='form-label' 
                        htmlFor='faculty-select'
                        > 
                        Facultad: 
                    </label>

                    <select 
                        className='form-select'
                        id='faculty-select'
                        title='Facultad del estudiante'
                        defaultValue={prevValues?.faculty || ''}
                        >
                        <option 
                            className='option-element'
                            value=''
                            disabled
                            >
                            -- Seleccione una facultad -- 
                        </option>
                        
                        <option 
                            className='option-element' 
                            value={'FTI'}
                            > 
                            Facultad de Tecnologías Interactivas 
                        </option>
                        
                        <option 
                            className='option-element' 
                            value={'FTE'}
                            > 
                            Facultad de Tecnologías Educativas
                        </option>

                        <option 
                            className='option-element' 
                            value={'CITEC'}
                            > 
                            Facultad de Ciencias y Tecnologías Computacionales
                        </option>

                        <option 
                            className='option-element' 
                            value={'FTL'}
                            > 
                            Facultad de Tecnologías Libres
                        </option>

                        <option 
                            className='option-element' 
                            value={'FCS'}
                            > 
                            Facultad de Ciberseguridad 
                        </option>

                        <option 
                            className='option-element' 
                            value={'FIO'}
                            > 
                            Facultad de Información Organizacional
                        </option>
                    </select>

                    <span
                        className='error'
                        style={formik.errors.faculty && formik.touched.faculty ? {} : { visibility: 'hidden' }}
                        >
                        {formik.errors.faculty}
                    </span>

                    <label 
                        className='form-label' 
                        htmlFor='group'
                        > 
                        Grupo:
                    </label>

                    <input 
                        className='form-input' 
                        type='number' 
                        id='group'
                        title='Grupo del estudiante'
                        placeholder='Introduzca el grupo del estudiante'
                        {...formik.getFieldProps('group')}
                        />

                    <span
                        className='error'
                        style={formik.errors.group && formik.touched.group ? {} : { visibility: "hidden" }}
                        >
                        {formik.errors.group}
                    </span>
                </>
                :
                <>
                    <label 
                        className='form-label' 
                        htmlFor='role-select'
                        > 
                        Seleccione el cargo: 
                    </label>

                    <select 
                        className='form-select'
                        id='role-select'
                        title='Cargo de docente'
                        defaultValue={prevValues?.user?.user_role || ''}
                        >
                        <option 
                            className='option-element'
                            value=''
                            disabled
                            >
                            -- Seleccione un cargo -- 
                        </option>
                        
                        <option 
                            className='option-element' 
                            value={datatypes.user.professor}
                            > 
                            Profesor 
                        </option>
                        
                        <option 
                            className='option-element' 
                            value={datatypes.user.dptoInf}
                            > 
                            Profesor miembro del Departamento de Informática 
                        </option>
                        
                        <option 
                            className='option-element' 
                            value={datatypes.user.decan}
                            > 
                            Miembro del Decanato 
                        </option>
                    </select>

                    <span
                        className='error'
                        style={formik.errors.role && formik.touched.role ? {} : { visibility: 'hidden' }}
                        >
                        {formik.errors.role}
                    </span>
                </>}

            <div className='button-container'>
                <button
                    type='submit'
                    className='accept-button'
                    title='Aceptar'
                    disabled={
                        !formik.isValid
                    }
                    style={
                        !formik.isValid?
                            { backgroundColor: 'gray' }
                            :
                            {}
                    }
                    >
                    Aceptar
                </button>

                <button 
                    className='cancel-button'
                    onClick={() => closeModal(modalId)}
                    >
                    Cancelar
                </button>
            </div>
        </form>
    )
}

UserForm.propTypes = {
    usertype: PropTypes.oneOf(Object.values(datatypes.user)),
    modalId: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    prevValues: PropTypes.shape({
        user: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
            user_role: PropTypes.string.isRequired,
        }),
        faculty: PropTypes.string,
        group: PropTypes.number,
    }),
    handleSubmit: PropTypes.func.isRequired,
}

export default UserForm