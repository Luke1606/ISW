import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { User } from 'lucide-react'
import * as Yup from 'yup'
import { FormButtons, PasswordField } from '@/presentation'
import { useGenericForm, useAuth, AuthService } from '@/logic/'

/**
 * @description Componente formulario para iniciar sesión, utiliza el hook {@link useGenericForm} para la gestión del formulario y obtiene la función {@link login} a ejecutar al envio del formulario se obtiene del hook {@link useAuth}.
 * @param {function} `closeFunc`- Función para cerrar formulario. 
 * @returns Estructura del componente formulario de autenticación.
 */
const LoginForm = ({ closeFunc }) => {
    const { login } = useAuth()

    const initialValues = {
        auth: true,
        username: '',
        password: ''
    }

    const validationSchema = useMemo(
        () =>
            Yup.object().shape({
                username: Yup.string()
                    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
                    .required('El nombre de usuario es obligatorio')
                    .matches(/^[0-9a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, 'El nombre no puede contener caracteres especiales'),
                password: Yup.string()
                    .min(10, 'La contraseña debe tener al menos 10 caracteres')
                    .matches(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
                    .matches(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
                    .matches(/[0-9]/, 'La contraseña debe contener al menos un número')
                    .matches(/[\W_]/, 'La contraseña debe contener al menos un caracter especial')
                    .required('La contraseña es obligatoria'),
            }),
        [])

    const submitFunction = async (values) => {
        const userData = {
            username: values.username, 
            password: values.password
        }
        let response = null
        if (values.auth)
            response = await login(userData)
        else
            response = await AuthService.changePassword(userData)

        closeFunc()
        return response
    }

    const formik = useGenericForm(submitFunction, initialValues, validationSchema)

    const handleOperationChange = (e) => {
        const auth = e.target.value === 'true'

        if (formik.values.auth !== auth) {
            formik.setValues({
                ...formik.values,
                auth,
                password: '',
            })
        }
    }
    return (
        <>
            <form 
                className='form-container' 
                onSubmit={formik.handleSubmit}
                >
                <div className='icon-container'>
                    <div className='icon-circle'>
                        <User className='icon' size={50}/>
                    </div>
                </div>

                <p className='form-instructions'>
                    {formik.values.auth?
                        'Ingrese su nombre de usuario y contraseña para iniciar sesión. Si es la primera vez que se autentica, seleccione "Registro inicial".'
                        : 
                        'Ingrese su nombre de usuario y proporcione una nueva contraseña para establecer su acceso y confirmar la creación de su cuenta.'}
                </p>

                <div
                    className='form-radio-container'
                    >
                    <label 
                        className='form-radio-option'
                        >
                        <input
                            className='form-input'
                            type='radio'
                            name='operation'
                            value='true'
                            checked={formik.values.auth}
                            onChange={handleOperationChange}
                            />
                        Autenticación
                    </label>
                    
                    <label 
                        className='form-radio-option'
                        >
                        <input
                            className='form-input'
                            type='radio'
                            name='operation'
                            value='false'
                            checked={!formik.values.auth}
                            onChange={handleOperationChange}
                            />
                        Registro inicial
                    </label>
                </div>

                <label 
                    className='form-label' 
                    htmlFor='username'
                    >
                    Nombre de usuario:
                </label>

                <input
                    className='form-input'
                    type='text'
                    id='username'
                    placeholder='Ingrese su nombre de usuario'
                    autoComplete='username'
                    {...formik.getFieldProps('username')}
                />

                <span
                    className={`error ${formik.errors.username && formik.touched.username && 'hidden'}`}
                    >
                    {formik.errors.username}
                </span>

                <PasswordField 
                    fieldName='password' 
                    label='Contraseña:' 
                    props={formik.getFieldProps('password')}
                    />

                <span
                    className={`error ${formik.errors.password && formik.touched.password && 'hidden'}`}
                    >
                    {formik.errors.password}
                </span>
                
                <FormButtons closeFunc={closeFunc} isValid={formik.isValid}/>
            </form>
        </>
    )
}

LoginForm.propTypes = {
    closeFunc: PropTypes.func.isRequired,
}

export default LoginForm
