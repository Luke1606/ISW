import { useState, useEffect } from "react"
import { useFormik } from "formik"

const useGenericForm = (submitFunction, initialValues, validationSchema = {}) => {
    const [formState, setFormState] = useState({
        pending: false,
        success: false,
        message: "",
    })

    const [isResponseModalOpen, setResponseModalOpen] = useState(false)

    const formik = useFormik({
        initialValues,
        validationSchema,
        validateOnChange: true,
        onSubmit: async (values) => {
            setFormState({ ...formState, pending: true })

            const result = await submitFunction(values)

            if (result && result.success) {
                setFormState({
                    pending: false,
                    success: true,
                    message: result.message,
                    redirect: result.redirect
                })
            } else {
                const error = result.error;
                setFormState({ pending: false, success: false, message: "" })

                if (error && error.response && error.response.data) {
                    const serverErrors = error.response.data
                    
                    Object.keys(serverErrors).forEach((key) => {
                        formik.setFieldError(key, serverErrors[key])
                    })
                } else {
                    formik.setFieldError(
                        "general",
                        error?.title || "Error desconocido"
                    )
                }
            }
        },
    })

  useEffect(() => {
    // Abrir el modal si hay un error general o si la autenticación fue exitosa
    if (formik.errors.general || formState.success || formState.pending) {
      setResponseModalOpen(true)
    }
  }, [formik.errors.general, formState])

  return {
    formik,
    formState,
    isResponseModalOpen,
    setResponseModalOpen,
  }
}

export default useGenericForm
