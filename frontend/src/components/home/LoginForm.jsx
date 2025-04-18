import PropTypes from 'prop-types'
import { useContext, useMemo } from "react"
import { User } from "lucide-react"
import * as Yup from "yup"
import { AuthContext } from "../../contexts/AuthContext"
import useGenericForm from "../../hooks/common/useGenericForm"

const LoginForm = ({modalId, closeModal}) => {
    const { login } = useContext(AuthContext)

    const initialValues = {
        username: "",
        password: "",
    }

    const validationSchema = useMemo(
        () =>
            Yup.object().shape({
                username: Yup.string()
                    .min(3, 'El nombre de usuario debe tener al menos 4 caracteres')
                    .required('El nombre de usuario es obligatorio')
                    .matches(/^[a-zA-Z0-9]*$/, 'El nombre no puede contener caracteres especiales'),
                password: Yup.string()
                    .min(10, "La contraseña debe tener al menos 10 caracteres")
                    .matches(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
                    .matches(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
                    .matches(/[0-9]/, "La contraseña debe contener al menos un número")
                    .matches(/[\W_]/, "La contraseña debe contener al menos un caracter especial")
                    .required("La contraseña es obligatoria"),
            }),
        [])

    const submitFunction = async (values) => {
        await login(values)
        closeModal(modalId)
    }

    const formik = useGenericForm(submitFunction, initialValues, validationSchema)

    return (
        <>
            <form className="form-container" onSubmit={formik.handleSubmit}>
                <div className="icon-container">
                    <div className="icon-circle">
                        <User className="icon" size={50}/>
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
                    autoComplete="username"
                    {...formik.getFieldProps("username")}
                />

                <span
                    className="error"
                    style={formik.errors.username && formik.touched.username ? {} : { visibility: "hidden" }}
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
                    autoComplete="current-password"
                    {...formik.getFieldProps("password")}
                />

                <span
                    className="error"
                    style={formik.errors.password && formik.touched.password ? {} : { visibility: "hidden" }}
                    >
                    {formik.errors.password}
                </span>
                
                <div className="button-container">
                    <button
                        type="submit"
                        className="accept-button"
                        title="Aceptar"
                        disabled={
                            !formik.isValid
                        }
                        style={
                            !formik.isValid?
                                { backgroundColor: 'gray' }
                                :
                                {}
                        }
                        >
                        Aceptar
                    </button>

                    <button
                        type="button"
                        className="cancel-button"
                        title="Cancelar"
                        onClick={() => closeModal(modalId)}
                        >
                        Cancelar
                    </button>
                </div>
            </form>
        </>
    )
}

LoginForm.propTypes = {
    modalId: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
}

export default LoginForm
