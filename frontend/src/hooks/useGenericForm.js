import { useActionState, useState, useEffect } from 'react'
import { useFormik } from 'formik'

const useGenericForm = (submitFunction, initialValues, validationSchema = {}) => {
    const [formState, formAction] = useActionState(submitFunction, { success: false })
    const [isResponseModalOpen, setResponseModalOpen] = useState(false)


    const formik = useFormik({
        initialValues,
        validationSchema,
        validateOnChange: true,
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

    useEffect(() => {
        // Ejecutar la validación inicial
        formik.validateForm()
    }, [])

    useEffect(() => {
        // Abrir el modal si hay un error general o si la autenticación fue exitosa
        if (formik.errors.general || formState.success || formState.pending) {
            setResponseModalOpen(true)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formik.errors.general, formState])

    return {
        formik,
        formState,
        isResponseModalOpen, 
        setResponseModalOpen
    }
}

export default useGenericForm