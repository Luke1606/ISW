import { useState, useEffect } from "react"
import { useFormik } from "formik"
import useDebouncedApiCall from './useDebouncedApiCall'
import NotificationService from "../services/NotificationService"

const useGenericForm = (submitFunction, initialValues, validationSchema = {}) => {
    const [formState, setFormState] = useState({
        pending: false,
        success: false,
        message: "",
    })

    const formik = useFormik({
        initialValues,
        validationSchema,
        validateOnChange: true,
        onSubmit: useDebouncedApiCall(async (values) => {
            setFormState({ ...formState, pending: true })

            const result = await submitFunction(values)
            console.log(result);
            if (result && result.success) {
                setFormState({
                    pending: false,
                    success: true,
                    message: result.message,
                })
            } else {
                const error = result?.error
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
        })
    })

  useEffect(() => {
    // mostrar un toast si hay un error general o si la autenticación fue exitosa
    if (formik.errors.general || formState.success) {
        const notification = {
            title: formState.success? 
                "Operación exitosa"
                :
                "Error",
            message: formState.success?
                formState.message
                :
                formik.errors.general
        }
        console.log(formState)
        const type = formState.success? "success" : "error"
        NotificationService.showToast(notification, type)
    }
  }, [formik.errors.general, formState])

  return {
    formik,
    formState,
  }
}

export default useGenericForm
