import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthContext"
import useDataForm from '../../hooks/useDataForm'
import Modal from "../common/Modal"

const LoginComponent = () => {
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const initialValues = {
        username: '',
        password: '',
    }

    const extraValidations = (values) => {
        const errors = {}

        if (values.username && values.username.length < 5)
            errors.username = 'El nombre de usuario es demasiado corto'
        
        if (values.password && values.password.length < 12)
            errors.password = 'La contraseña es demasiado corta'
        
        return errors
    }

    const { formik, formState } = useDataForm(login, initialValues, extraValidations)

    useEffect(() => {
        // Ejecutar la validación inicial
        formik.validateForm()
    }, [])

    useEffect(() => {
        // Abrir el modal si hay un error general o si la autenticación fue exitosa
        if (formik.errors.general || formState.success || formState.pending) {
            setIsModalOpen(true)
        }
    }, [formik.errors.general, formState])

    return (
            <>
                <form 
                    className="form-container"
                    onSubmit={formik.handleSubmit} 
                    >
                    <h1>Autenticación</h1>
                    <label 
                        className="form-label" 
                        htmlFor="username">
                            Nombre de usuario:
                    </label>

                    <input
                        className="form-input"
                        type="text"
                        id="username"
                        placeholder="Ingrese su nombre de usuario"
                        {...formik.getFieldProps('username')}
                    />
                    {formik.touched.username && 
                        formik.errors.username && 
                        <span 
                            className="error">
                                {formik.errors.username}
                        </span>}

                    <label 
                        className="form-label" 
                        htmlFor="password">
                            Contraseña:
                    </label>

                    <input
                        className="form-input"
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Ingrese su contraseña"
                        {...formik.getFieldProps('password')}
                    />
                    {formik.touched.password && 
                        formik.errors.password && 
                        <span 
                            className="error">
                                {formik.errors.password}
                        </span>}

                    <div className="button-container">
                        <button 
                            type="submit" 
                            className="accept-button" 
                            disabled={formState.pending || Object.keys(formik.errors).length > 0}
                            onClick={() => setIsModalOpen(true)}>
                                Aceptar
                        </button>

                        <button 
                            type="button"
                            className="cancel-button"
                            onClick={() => navigate('/')}>
                            Cancelar
                        </button>

                    </div>
                </form>

                {formik.errors.general && 
                    <span 
                        className="error">
                            {formik.errors.general}
                    </span>}

                <Modal 
                    isOpen={isModalOpen}
                    title={formState.pending? "Cargando..." : formState.success? "Autenticación exitosa" : "Error de autenticación" }
                    >
                    <p>
                        {formState.success? formState.message : formik.errors.general}
                    </p>
                    
                    <button 
                        className="button"
                        onClick={() => setIsModalOpen(false)}
                        >
                        Cerrar
                    </button>
                </Modal>  
            </>
        )
}

export default LoginComponent