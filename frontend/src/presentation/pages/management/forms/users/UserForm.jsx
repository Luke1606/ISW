import PropTypes from "prop-types"
import * as Yup from 'yup'
import { useMemo } from 'react'
import { datatypes } from "@/data"
import { useGenericForm, ManagementService } from '@/logic'
import { FormButtons, SearchableSelect } from '@/presentation'

/**
 * @description Ventana para agregar o editar un usuario ya sea profesor o estudiante.
 * @param {bool} `isStudent`- Binario que expresa si es un formulario de estudiante o de profesor.
 * @param {bool} `isEdition`- Función a ejecutar al envío del formulario.
 * @param {function} `closeFunc`- Función para cerrar el componente.
 * @param {Object} `prevValues`- Contiene toda la información del usuario a mostrar.
 * @returns Estructura de los campos a mostrar con la información del usuario contenida en `prevValues`.
 */
const UserForm = ({ isStudent, isEdition, closeFunc, prevValues }) => {
    let specificInitialValues 

    if (isStudent)
        specificInitialValues = {
            faculty: prevValues?.faculty || '',
            group: prevValues?.group || ''
        }
    else 
        specificInitialValues = {
            role: prevValues?.id?.user_role || '',
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
        name: prevValues?.id?.name || '',
        username: prevValues?.id?.username || '',
    }

    const validationSchema = useMemo(() => Yup.object().shape({
        name: Yup.string()
            .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
            .required('El nombre de usuario es obligatorio')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, 'El nombre no puede contener números ni caracteres especiales'),

        username: Yup.string()
            .min(3, 'El nombre de usuario debe tener al menos 4 caracteres')
            .required('El nombre de usuario es obligatorio')
            .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*$/, 'El nombre no puede contener caracteres especiales'),
        ...specificSchema   
    }), [specificSchema])

    const submitFunction = async (values) => {
        const user = isEdition?
            {
                id: prevValues?.id,
                name: values?.name,
                username: values?.username,
            }
            :
            {
                name: values?.name,
                username: values?.username,
            }

        const newValues = isStudent?
            {
                ...user,
                faculty: values?.faculty,
                group: values?.group,
            }
            :
            {
                ...user,
                role: values.role
            }
        
        let success = false
        let message

        const datatype = isStudent? datatypes.user.student : datatypes.user.professor
        if (isEdition) {
            const response = await ManagementService.updateData(datatype, prevValues.id.id, newValues)
            success = response?.success
            message = response?.message
        } else {
            const response = await ManagementService.createData(datatype, newValues)
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
                {isEdition? 'Modificar' : 'Registrar'} {isStudent? 'estudiante' : 'profesor'}
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
                        defaultValue={facultyOptions.find(faculty => faculty.value === formik.values.faculty)}
                        onChange={(value) => formik.setFieldValue('faculty', value)}
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
                        defaultValue={docentRoleOptions.find(role => role.value === formik.values.role)}
                        onChange={(value) => formik.setFieldValue('role', value)}
                        />

                    <span
                        className='error'
                        style={formik.errors.role && formik.touched.role ? {} : { visibility: 'hidden' }}
                        >
                        {formik.errors.role}
                    </span>
                </>}

            <FormButtons closeFunc={closeFunc} isValid={formik.isValid}/>
        </form>
    )
}

UserForm.propTypes = {
    isStudent: PropTypes.bool.isRequired,
    isEdition: PropTypes.bool.isRequired,
    closeFunc: PropTypes.func.isRequired,
    prevValues: PropTypes.shape({
        id: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
            user_role: PropTypes.string.isRequired,
        }),
        faculty: PropTypes.string,
        group: PropTypes.number,
    }),
}

export default UserForm