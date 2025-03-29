import { useState, useEffect } from "react"
import { useFormik } from "formik"
import useDebouncedApiCall from './useDebouncedApiCall'
import NotificationService from "../../services/NotificationService"

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

            if (result) {
                setFormState({
                    pending: false,
                    success: result.success,
                    message: result.message,
                })
            }
        })
    })

  useEffect(() => {
    // mostrar un toast si hay un error general o si la autenticación fue exitosa
    if (formState.message != "") {
        const notification = {
            title: formState.success?
                "Operación exitosa"
                :
                "Error",
            message: formState.message
        }

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
