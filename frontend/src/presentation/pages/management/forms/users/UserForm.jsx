import PropTypes from "prop-types"
import { useUserForm } from '@/logic'
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
    const { facultyOptions, docentRoleOptions, formik } = useUserForm(isStudent, isEdition, closeFunc, prevValues)
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
                className={`error ${!(formik.errors.name && formik.touched.name) && 'hidden'}`}
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
                className={`error ${!(formik.errors.username && formik.touched.username) && 'hidden'}`}
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
                        className={`error ${!(formik.errors.faculty && formik.touched.faculty) && 'hidden'}`}
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
                        className={`error ${!(formik.errors.group && formik.touched.group) && 'hidden'}`}
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
                        className={`error ${!(formik.errors.role && formik.touched.role) && 'hidden'}`}
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