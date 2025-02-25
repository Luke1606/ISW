import { useContext, useState } from "react"
import { AuthContext } from "../components/AuthProvider"
import { AcceptButton, CancelButton } from "../../general_components/Buttons"
import { useFormik } from "formik"
import LoadingSpinner from "../../general_components/Spinner"

const Login = () => {
    const { loginUser } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validate,
        onSubmit: handleSubmit
    })

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

    const handleSubmit = async (values) => {
        setLoading(true)
        try {
            await loginUser (values)
        } catch (error) {
            console.error("Error during login:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
            <div style={styles.formContainer}>
                <form onSubmit={formik.handleSubmit} className="form-container">
                    <h1>Login</h1>
                    <label style={styles.label} htmlFor="username">Nombre de usuario:</label>
                    <input style={styles.input}
                        type="text" 
                        id="username" 
                        placeholder="Ingrese su nombre de usuario" 
                        {...formik.getFieldProps("username")}/>
                    
                    {formik.touched.username && formik.errors.username && <span>{formik.errors.username}</span> }
                    
                    <label style={styles.label} htmlFor="password">Contraseña:</label>
                    <input style={styles.input} 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="Ingrese su contraseña" 
                        {...formik.getFieldProps("password")}/>
                    
                    {formik.touched.password && formik.errors.password && <span>{formik.errors.password}</span> }

                    <div style={styles.buttonContainer}>
                        <AcceptButton />
                        <CancelButton />
                    </div>
                </form>

                {loading && <LoadingSpinner>Loading...</LoadingSpinner>}
                
            </div>
            )
}
export default Login

const styles = {
    formContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Altura completa de la ventana
        background: 'linear-gradient(to bottom, rgb(235, 157, 41), darkorange)', // Fondo con gradiente
    },
    default: {
        backgroundColor: 'rgb(230, 230, 230)', // Fondo blanco del formulario
        borderRadius: '10px', // Bordes redondeados
        padding: '40px', // Espaciado interno
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Sombra para el formulario
        width: '400px', // Ancho del formulario
    },
    input : {
        width: '100%', // Ancho completo
        padding: '10px', // Espaciado interno
        margin: '10px 0', // Margen entre inputs
        borderRadius: '10px', // Bordes redondeados
        border: '1px solid #ccc', // Borde gris claro
    },
    label: {
        fontSize : '24px',
        marginBottom: '5px', // Margen inferior para las etiquetas
        display: 'block', // Mostrar etiquetas como bloques
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end', // Espacio entre botones
        marginTop: '20px', // Margen superior para los botones
    },
}
