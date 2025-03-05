import { useActionState } from 'react'
import { useFormik } from 'formik'

const useDataForm = (submitFunction, initialValues, extraValidations = () => ({})) => {
    const [formState, formAction] = useActionState(submitFunction, { success: false })

    const validate = (values) => {
        const clientErrors = {}
        
        // Validación por defecto: ningún campo debe estar vacío
        Object.keys(values).forEach((key) => {
            if (!values[key]) {
                clientErrors[key] = 'Requerido'
            }
        })

        // Agregar validaciones adicionales
        const extraErrors = extraValidations(values)
        return { ...clientErrors, ...extraErrors }
    }

    const formik = useFormik({
        initialValues,
        validate,
        onSubmit: async (values) => {
            const result = await formAction(values)
            
            if (result && !result.success) {
                const error = result.error
                if (error.response && error.data) {
                    // Si los errores son correspondientes a campos especificos
                    const serverErrors = error.response.data

                    // Establecer errores en el formulario
                    Object.keys(serverErrors).forEach((key) => {
                        formik.setFieldError(key, serverErrors[key])
                    })
                } else {
                    formik.setFieldError('general', error.title || "Error desconocido")
                }
            }
        }
    })

    return {
        formik,
        formState,
    }
}

export default useDataForm