import { useContext, useState } from "react"
import { UserContext } from "../../contexts/UserContext"
import { useFormik } from "formik"
import LoadingSpinner from "../common/LoadingSpinner"

const UserComponent = () => {
    const { login } = useContext(UserContext)
    const [ error, setError ] = useState(null)
    const [ loading, setLoading ] = useState(false)

    const handleSubmit = async (values) => {
        setLoading(true)
        setError(null)
        try {
            await login(values.username, values.password)
        } catch (err) {
            setError(err.message || err)
        } finally {
            setLoading(false)
        }
    }

    const validate = (values) => {
        const errors = {}

        if (!values.username)
            errors.username = "Requerido"
        if (values.username.length < 5)
            errors.username = "El nombre de usuario es demasiado corto"

        if (!values.password)
            errors.password = "Requerido"
        if (values.password.length < 12)
            errors.password = "La contraseña es demasiado corta"

        return errors
    }

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validate,
        onSubmit: handleSubmit
    })

    return (
            <div className="container">
                <form onSubmit={formik.handleSubmit} className="form-container">
                    <h1>Login</h1>
                    <label className="form-label" htmlFor="username">Nombre de usuario:</label>
                    <input className="form-input"
                        type="text" 
                        id="username" 
                        placeholder="Ingrese su nombre de usuario" 
                        {...formik.getFieldProps("username")}/>
                    
                    {formik.touched.username && formik.errors.username && <span className="error">{formik.errors.username}</span> }
                    
                    <label className="form-label" htmlFor="password">Contraseña:</label>
                    <input className="form-input"
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="Ingrese su contraseña" 
                        {...formik.getFieldProps("password")}/>
                    
                    {formik.touched.password && formik.errors.password && <span className="error">{formik.errors.password}</span> }

                    <div className="button-container">
                        <button className="accept-button">Aceptar</button>
                        <button className="cancel-button">Cancelar</button>
                    </div>
                </form>
                {error && <span className="error">{error}</span>}
                {loading && <LoadingSpinner>Loading...</LoadingSpinner>}
                
            </div>
            )
}

export default UserComponent

