import { useContext, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { User } from "lucide-react"
import * as Yup from "yup"
import { AuthContext } from "../../contexts/AuthContext"
import useGenericForm from '../../hooks/useGenericForm'
import Modal from "../common/Modal"

const LoginComponent = () => {
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()

    const initialValues = {
        username: '',
        password: '',
    }

    const validationSchema = useMemo(() => Yup.object().shape({
        username: Yup.string()
            .min(4, "El nombre de usuario debe tener al menos 4 caracteres")
            .required("El nombre de usuario es obligatorio"),
        password: Yup.string()
            .min(12, "La contraseña debe tener al menos 12 caracteres")
            .matches(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
            .matches(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
            .matches(/[0-9]/, "La contraseña debe contener al menos un número")
            .matches(/[\W_]/, "La contraseña debe contener al menos un caracter especial")
            .required("La contraseña es obligatoria")
    }), [])

    const {
        formik,
        formState, 
        isResponseModalOpen, 
        setResponseModalOpen 
    } = useGenericForm(login, initialValues, validationSchema)

    return (
            <>
                <form 
                    className="form-container"
                    onSubmit={formik.handleSubmit} 
                    >
                    <div className="icon-container">
                        <div className="icon-circle">
                            <User className="icon" />
                        </div>
                    </div>
                    
                    <h1>Autenticación</h1>
                    
                    <label 
                        className="form-label" 
                        htmlFor="username"
                        >
                        Nombre de usuario:
                    </label>

                    <input
                        className="form-input"
                        type="text"
                        id="username"
                        placeholder="Ingrese su nombre de usuario"
                        {...formik.getFieldProps('username')}
                    />
                    
                    <span 
                        className="error"
                        style={formik.errors.username? {} : {visibility:"hidden"}}
                        >
                        {formik.errors.username}
                    </span>

                    <label 
                        className="form-label" 
                        htmlFor="password"
                        id="label-password"
                        >
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
                      
                    <span 
                        className="error"
                        style={formik.errors.password? {} : {visibility:"hidden"}}
                        >
                        {formik.errors.password}
                    </span>

                    <div className="button-container">
                        <button 
                            type="submit" 
                            className="accept-button" 
                            disabled={
                                formState.pending || Object.keys(formik.errors).length > 0
                            }
                            style={
                                formState.pending || Object.keys(formik.errors).length > 0?
                                    {backgroundColor: "gray"} 
                                    :
                                    {}
                            }
                            onClick={() => setResponseModalOpen(true)}>
                                Aceptar
                        </button>

                        <button 
                            type="button"
                            className="cancel-button"
                            onClick={() => navigate('/')}
                            >
                            Cancelar
                        </button>
                    </div>
                </form>

                {formik.errors.general && 
                    <span 
                        className="error"
                        >
                        {formik.errors.general}
                    </span>}

                <Modal 
                    isOpen={isResponseModalOpen}
                    title={
                        formState.pending?
                            "Cargando..." : formState.success?
                                "Autenticación exitosa" : "Error de autenticación"}
                    >
                    <p>
                        {formState.success? formState.message : formik.errors.general}
                    </p>
                    
                    {!formState.pending &&
                        <button 
                            className="button"
                            onClick={() => setResponseModalOpen(false)}
                            >
                            Cerrar
                        </button>}
                </Modal>  
            </>
        )
}

export default LoginComponent