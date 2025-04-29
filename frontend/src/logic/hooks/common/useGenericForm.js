
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import useDebouncedFunction from './useDebouncedFunction'
import NotificationService from '../../services/NotificationService'
import { useLoading } from '../../hooks/common/useContexts'

/**
 * @description Hook para gestion de formularios utilizando {@link useFormik} y `Yup`.
 * @param {function} `submitFunction`
 * @param {Object} `initialValues`
 * @param {Obbject} `validationSchema`- Esquema de validacion definido con `Yup` para integración con `useFormik`.
 * @returns {Object} `formik`
 */
const useGenericForm = (submitFunction, initialValues, validationSchema = {}) => {
    const [formState, setFormState] = useState({
        success: false,
        message: ''
    })
    const { setLoading } = useLoading()

    const formik = useFormik({
        initialValues,
        validationSchema,
        validateOnChange: true,
        onSubmit: useDebouncedFunction(async (values) => {
            setLoading(true)

            const result = await submitFunction(values)

            if (result) {
                setFormState({
                    success: result.success,
                    message: result.message,
                })
            }
            setLoading(false)
        })
    })

  useEffect(() => {
    // mostrar un toast si hay un error general o si la operación fue exitosa
    if (formState.message != '') {
        const notification = {
            title: formState.success?
                'Operación exitosa'
                :
                'Error',
            message: formState.message
        }

        const type = formState.success? 'success' : 'error'
        NotificationService.showToast(notification, type)
    }
  }, [formik.errors.general, formState])

  return formik
}

useGenericForm.propTypes = {
    submitFunction: PropTypes.func.isRequired,
    initialValues: PropTypes.object.isRequired,
    validationSchema: PropTypes.object,
}

export default useGenericForm
