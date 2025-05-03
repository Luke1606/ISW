
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { useFormik } from 'formik'
import { useLoading, NotificationService } from '@/logic'

/**
 * @description Hook para gestion de formularios utilizando {@link useFormik} y `Yup`.
 * @param {function} `submitFunction`
 * @param {Object} `initialValues`
 * @param {Obbject} `validationSchema`- Esquema de validacion definido con `Yup` para integración con `useFormik`.
 * @returns {Object} `formik`
 */
const useGenericForm = (submitFunction, initialValues, validationSchema = {}) => {
    const { setLoading } = useLoading()

    const formik = useFormik({
        initialValues,
        validationSchema,
        validateOnChange: true,
        onSubmit: useCallback(async (values) => {
            setLoading(true)

            const response = await submitFunction(values)
            
            if (response) {
                const notification = {
                    title: response.success?
                        'Operación exitosa'
                        :
                        'Error',
                    message: response.message
                }
        
                const type = response.success? 'success' : 'error'
                NotificationService.showToast(notification, type)
            }
            setLoading(false)
        }, [setLoading, submitFunction])
    })
  return formik
}

useGenericForm.propTypes = {
    submitFunction: PropTypes.func.isRequired,
    initialValues: PropTypes.object.isRequired,
    validationSchema: PropTypes.object,
}

export default useGenericForm
