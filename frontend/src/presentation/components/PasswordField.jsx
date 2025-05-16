import PropTypes from 'prop-types'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const PasswordField = ({ fieldName, label, props }) => {
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev)
    }

    return (
        <>
            <label 
                className='form-label' 
                htmlFor={fieldName}>
                {label}
            </label>

            <div 
                className='password-input-container'
                >
                <input
                    className='form-password'
                    type={showPassword ? 'text' : 'password'}
                    id={fieldName}
                    placeholder='Ingrese la contraseña'
                    autoComplete='current-password'
                    {...props}
                />
                <button
                    type='button'
                    className='password-toggle'
                    onClick={togglePasswordVisibility}
                    >
                    {showPassword? 
                        <EyeOff color='black' size={30} /> 
                        :
                        <Eye color='black' size={30} />}
                </button>
            </div>
        </>
    )
}

PasswordField.propTypes = {
    fieldName: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    props: PropTypes.object.isRequired,
}

export default PasswordField