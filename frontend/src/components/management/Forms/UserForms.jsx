/* eslint-disable react/prop-types */
import { useMemo } from 'react'
import * as Yup from 'yup'
import useGenericForm from '../../../hooks/common/useGenericForm'
import datatypes from '../../../js-files/Datatypes'

export const UserForm = ({values, functions}) => {
    const prevValues = values.prevValues

    const initialValues = {
        name: prevValues?.user?.name || '',
        username: prevValues?.user?.username || '',
        role: prevValues?.user?.user_role || '',
        ...(prevValues?.user?.user_role === datatypes.user.student && {
            faculty: prevValues?.faculty || '',
            group: prevValues?.group || ''
        }),
    }

    const validationSchema = useMemo(() => Yup.object().shape({
        name: Yup.string()
            .min(3, 'El nombre de usuario debe tener al menos 4 caracteres')
            .required('El nombre de usuario es obligatorio')
            .matches(/^[a-zA-Z]*$/, 'El nombre no puede contener números ni caracteres especiales'),

        username: Yup.string()
            .min(4, 'El nombre de usuario debe tener al menos 4 caracteres')
            .required('El nombre de usuario es obligatorio')
            .matches(/^[a-zA-Z0-9]*$/, 'El nombre no puede contener caracteres especiales'),

        role: Yup.string().required('El rol es obligatorio'),

        faculty: Yup.string()
            .when('role', {
                is: datatypes.user.student,
                then: Yup.string().required('La facultad es requerida'),
                otherwise: Yup.string().notRequired(),
            }),

        group: Yup.number()
            .when('role', {
                is: datatypes.user.student,
                then: Yup.number().required('El grupo es requerido'),
                otherwise: Yup.number().notRequired(),
            }),            
    }), [])

    const handleRoleChange = (e) => {
        const newRole = e.target.value
        formik.setFieldValue("role", newRole)
    
        if (newRole === datatypes.user.student) {
            formik.setValues((prev) => ({
                ...prev,
                faculty: prevValues.faculty || '',
                group: prevValues.group || '',
            }))
        } else {
            formik.setValues((prev) => ({
                ...prev,
                faculty: '', // Elimina facultad si no es estudiante
                group: '', // Elimina grupo si no es estudiante
            }))
        }
    }

    // eslint-disable-next-line no-unused-vars
    const { formik, formState } = useGenericForm(functions.handleSubmit, initialValues, validationSchema)

    return (
        <form
            className='form-container manage-form' 
            onSubmit={formik.handleSubmit}
            >
            <label 
                className='form-label' 
                htmlFor='name'
                >
                Nombre completo: 
            </label>

            <input 
                className='form-input' 
                id='name' 
                type='text'
                {...formik.getFieldProps('name')}
                />
            
            <span
                className="error"
                style={formik.errors.name && formik.touched.name ? {} : { visibility: "hidden" }}
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
                {...formik.getFieldProps('username')}
                />

            <span
                className="error"
                style={formik.errors.username && formik.touched.username ? {} : { visibility: "hidden" }}
                >
                {formik.errors.username}
            </span>
        
            <label 
                className='form-label' 
                htmlFor='role-select'
                > 
                Seleccione el cargo: 
            </label>

            <select 
                className='form-select'
                id='role-select'
                title='Cargo de usuario'
                defaultValue={''}
                onChange={handleRoleChange}
                >
                <option 
                    className='option-element'
                    value=''
                    disabled
                    >
                    -- Seleccione una opción -- 
                </option>
                
                <option 
                    className='option-element'
                    value={datatypes.user.student}
                    > 
                    Estudiante 
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
                className="error"
                style={formik.errors.role && formik.touched.role ? {} : { visibility: "hidden" }}
                >
                {formik.errors.role}
            </span>

            { formik.role && formik.role === datatypes.user.student &&
                <>
                    <label 
                        className='form-label'
                        htmlFor='faculty'
                        > 
                        Facultad:
                    </label>

                    <input 
                        className='form-input' 
                        type='text' 
                        id='faculty'
                        {...formik.getFieldProps('faculty')}
                        />
                    
                    <span
                        className="error"
                        style={formik.errors.faculty && formik.touched.faculty ? {} : { visibility: "hidden" }}
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
                        id='cargo'
                        {...formik.getFieldProps('group')}
                        />

                    <span
                        className="error"
                        style={formik.errors.group && formik.touched.group ? {} : { visibility: "hidden" }}
                        >
                    {formik.errors.group}
                </span>
                </>}

                <div className="button-container">
                    <button 
                        className='accept-button'
                        type='submit'
                        >
                        Aceptar
                    </button>

                    <button 
                        className='cancel-button'
                        onClick={()=>null}
                        >
                        Cancelar
                    </button>
                </div>
        </form>
    )
}

export const ReadOnlyUserForm = ({prevValues}) => {
    if (!prevValues) return null

    return (
        <form
            className='form-container manage-form' 
            onSubmit={()=> null}
            >
            <label 
                className='form-label' 
                htmlFor='usuario'
                > 
                Nombre completo: 
            </label>
            
            <input 
                className='form-input' 
                id='usuario' 
                type='text'  
                value={prevValues.user.name} 
                readOnly
                />

            <label 
                className='form-label' 
                htmlFor='usuario'
                > 
                Nombre de usuario: 
            </label>
            
            <input 
                className='form-input' 
                id='usuario' 
                type='text'  
                value={prevValues.user.username} 
                readOnly
                />
            
            { prevValues.user.user_role === datatypes.user.student?
                <>
                    <label 
                        className='form-label' 
                        htmlFor='faculty'
                        > 
                        Facultad:
                    </label>

                    <input 
                        className='form-input' 
                        type='text' 
                        id='faculty' 
                        value={prevValues.faculty} 
                        readOnly/>

                    <label 
                        className='form-label' 
                        htmlFor='group'
                        > 
                        Grupo:
                    </label>

                    <input 
                        className='form-input' 
                        type='group' 
                        id='cargo'
                        value={prevValues.group} 
                        readOnly/>
                </>
                :
                <>
                    <label 
                        className='form-label' 
                        htmlFor='cargo'
                        > 
                        Cargo:
                    </label>

                    <input 
                        className='form-input' 
                        type='text' 
                        id='cargo' 
                        value={prevValues.role} 
                        readOnly/>
                </>}

                <button 
                    className='accept-button'
                    type='submit'
                    >
                    Aceptar
                </button>
        </form>
    )
}