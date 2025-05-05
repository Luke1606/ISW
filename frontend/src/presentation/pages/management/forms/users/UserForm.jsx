import PropTypes from "prop-types"
import * as Yup from 'yup'
import { useMemo } from 'react'
import { datatypes } from "@/data"
import { useGenericForm } from '@/logic'
import { FormButtons, SearchableSelect } from '@/presentation'

/**
 * @description Ventana para agregar o editar un usuario ya sea profesor o estudiante.
 * @param {string} `usertype`- Tipo de usuario a manejar con este componente.
 * @param {string} `modalId` - Id del modal en el que se renderiza este componente.
 * @param {function} `closeModal`- Función para cerrar el modal en el que se renderiza este componente.
 * @param {Object} `prevValues`- Contiene toda la información del usuario a mostrar.
 * @param {function} `handleSubmit`- Función a ejecutar al envío del formulario.
 * @returns Estructura de los campos a mostrar con la información del usuario contenida en `prevValues`.
 */
const UserForm = ({isStudent, modalId, closeModal, prevValues, handleSubmit}) => {
    let specificInitialValues 

    if (isStudent)
        specificInitialValues = {
            faculty: prevValues?.faculty || '',
            group: prevValues?.group || ''
        }
    else 
        specificInitialValues = {
            role: prevValues?.user?.user_role || '',
        }

    let specificSchema

    if (isStudent)
        specificSchema = {
            faculty: Yup.string()
                .when('role', (role, schema) => {
                    return role === datatypes.user.student? 
                        schema.required('La facultad es requerida')
                        :
                        schema.notRequired()
                }),
            group: Yup.number()
                .when('role', (role, schema) => {

                    return role === datatypes.user.student? 
                        schema.required('El grupo es requerido')
                        : 
                        schema.notRequired()
                })
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
            .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
            .required('El nombre de usuario es obligatorio')
            .matches(/^[a-zA-Z\s]*$/, 'El nombre no puede contener números ni caracteres especiales'),

        username: Yup.string()
            .min(3, 'El nombre de usuario debe tener al menos 4 caracteres')
            .required('El nombre de usuario es obligatorio')
            .matches(/^[a-zA-Z0-9]*$/, 'El nombre no puede contener caracteres especiales'),
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
        await handleSubmit(isStudent? datatypes.user.student : datatypes.user.professor, prevValues?.user?.id, newValues)
        closeModal(modalId)
    }

    const formik = useGenericForm(submitFunction, initialValues, validationSchema)

    /**
     * @description Distintas opciones a mostrar en el elemento `select` con id de valor `faculty-select`
     */
    const facultyOptions = [
        { value: 'FTI', label: 'Facultad de Tecnologías Interactivas' },
        { value: 'FTE', label: 'Facultad de Tecnologías Educativas' },
        { value: 'CITEC', label: 'Facultad de Ciencias y Tecnologías Computacionales' },
        { value: 'FTL', label: 'Facultad de Tecnologías Libres' },
        { value: 'FCS', label: 'Facultad de Ciberseguridad' },
        { value: 'FIO', label: 'Facultad de Información Organizacional' },
    ]

    /**
     * @description Distintas opciones a mostrar en el elemento `select` con id de valor `faculty-select`
     */
    const docentRoleOptions = [
        { value: datatypes.user.professor, label: 'Profesor' },
        { value: datatypes.user.dptoInf, label: 'Profesor miembro del Departamento de Informática' },
        { value: datatypes.user.decan, label: 'Miembro del Decanato ' },
    ]
    
    return (
        <form
            className='form-container manage-section' 
            onSubmit={formik.handleSubmit}
            >
            <h1
                className='form-title'
                >
                {prevValues? 'Modificar' : 'Registrar'} {isStudent? 'estudiante' : 'profesor'}
            </h1>
            
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
                placeholder='Introduzca el nombre de usuario'
                {...formik.getFieldProps('username')}
                />

            <span
                className='error'
                style={formik.errors.username && formik.touched.username ? {} : { visibility: 'hidden' }}
                >
                {formik.errors.username}
            </span>
        
            { isStudent? 
                <>
                    <label 
                        className='form-label' 
                        htmlFor='faculty-select'
                        > 
                        Facultad: 
                    </label>
                        
                    <SearchableSelect 
                        id='faculty-select' 
                        title='Facultad del estudiante'
                        elements={facultyOptions}
                        defaultValue={facultyOptions.find(faculty => faculty.value === prevValues?.faculty) || {}}
                        />

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
                        style={formik.errors.group && formik.touched.group ? {} : { visibility: 'hidden' }}
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

                    <SearchableSelect 
                        id='role-select' 
                        title='Cargo de docente'
                        elements={docentRoleOptions}
                        defaultValue={docentRoleOptions.find(role => role.value === prevValues?.user?.user_role) || {}}
                        />

                    <span
                        className='error'
                        style={formik.errors.role && formik.touched.role ? {} : { visibility: 'hidden' }}
                        >
                        {formik.errors.role}
                    </span>
                </>}

            <FormButtons modalId={modalId} closeModal={closeModal} isValid={formik.isValid}/>
        </form>
    )
}

UserForm.propTypes = {
    isStudent: PropTypes.bool.isRequired,
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