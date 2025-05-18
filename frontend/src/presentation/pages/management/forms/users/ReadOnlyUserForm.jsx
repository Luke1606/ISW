import PropTypes from 'prop-types'
import { datatypes } from '@/data'

/**
 * @description Ventana para mostrar detalles de un usuario ya sea estudiante o profesor.
 * @param {function} `closeFunc- Función para cerrar el componente.
 * @param {Object} `values`- Contiene toda la información del usuario a mostrar.
 * @returns Estructura de los campos a mostrar con la información del usuario contenida en `values`.
 */
const ReadOnlyUserForm = ({ closeFunc, values }) => {
    if (!values) return null

    const isStudent = values.id.user_role === datatypes.user.student

    return (
        <section
            className='form-container manage-section' 
            >
            <h1
                className='form-title'
                >
                Ver detalles de {isStudent? 'estudiante' : 'profesor'}
            </h1>

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
                value={values.id.name} 
                readOnly
                />

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
                value={values.id.username} 
                readOnly
                />

            { isStudent?
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
                        value={values.faculty} 
                        readOnly/>

                    <label 
                        className='form-label' 
                        htmlFor='group'
                        > 
                        Grupo:
                    </label>

                    <input 
                        className='form-input' 
                        type='text' 
                        id='group'
                        value={values.group} 
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
                        value={values.id.user_role} 
                        readOnly/>
                </>}

                <button 
                    className='accept-button'
                    onClick={closeFunc}
                    >
                    Aceptar
                </button>
        </section>
    )
}

ReadOnlyUserForm.propTypes = {
    closeFunc: PropTypes.func.isRequired,
    values: PropTypes.shape({
        id: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
            user_role: PropTypes.string.isRequired,
        }),
        faculty: PropTypes.string,
        group: PropTypes.number,
    }).isRequired,
}

export default ReadOnlyUserForm