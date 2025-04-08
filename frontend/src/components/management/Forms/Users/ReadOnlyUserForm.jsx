import PropTypes from "prop-types"
import datatypes from '../../../../js-files/Datatypes'

const ReadOnlyUserForm = ({prevValues}) => {
    if (!prevValues) return null

    return (
        <form
            className='form-container manage-form' 
            onSubmit={()=> null}
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
                value={prevValues.user.name} 
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
                        value={prevValues.user.user_role} 
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

ReadOnlyUserForm.propTypes = {
    prevValues: PropTypes.shape({
        user: PropTypes.shape({
            name: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
            user_role: PropTypes.string.isRequired,
        }),
        faculty: PropTypes.bool,
        group: PropTypes.number,
    }),
}

export default ReadOnlyUserForm