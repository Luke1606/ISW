import PropTypes from 'prop-types'
import { useMemo } from 'react'
import * as Yup from 'yup'
import { datatypes } from '@/data'
import { useGenericForm, ManagementService } from '@/logic'
import { FormButtons, SearchableSelect } from '@/presentation'

/**
 * @description Ventana para agregar o editar un solicitud.
 * @param {bool} `isEdition`- Binario que expresa si es un formulario de edición o no.
 * @param {function} `closeFunc`- Función para cerrar el formulario.
 * @param {string} `studentId` - Id del estudiante al cual está asociada el acta de defensa.
 * @param {Object} `prevValues`- Contiene toda la información de la solicitud a mostrar.
 * @returns Estructura de los campos a mostrar con la información de la solicitud contenida en prevValues.
 */
const RequestForm = ({ closeFunc, prevValues, isEdition }) => {
    const initialValues = isEdition?
    {
        selectedECE: prevValues?.selected_ece || '',
    }
    :
    {
        state: prevValues?.state || '',
    }

    const validationSchema = useMemo(() => {
        return isEdition?
            Yup.object().shape({
                state: Yup.string()
                    .required('Debe seleccionar un veredicto')
            })
            :
            Yup.object().shape({
                selectedECE: Yup.string()
                    .required('Debe seleccionar un ejercicio')
            })
    }, [isEdition])
    
    const submitFunction = async (values) => {
        const newValues = isEdition?
        {
            student: prevValues?.student,
            state: values?.state,
        }
        :
        {
            student: prevValues?.student,
            selected_ece: values?.selectedECE,
        }

        let success = false
        let message = ''

        if (isEdition) {
            const response = await ManagementService.updateData(datatypes.request, prevValues.id, newValues)
            success = response?.success
            message = response?.message
        } else {
            const response = await ManagementService.createData(datatypes.request, newValues)
            success = response?.success
            message = response?.message
        }

        closeFunc()

        return {
            success,
            message,
        }
    }

    const formik = useGenericForm(submitFunction, initialValues, validationSchema)
    
    const exerciseOptions = [
        { value: 'TD', label: 'Trabajo de diploma'},
        { value: 'PF', label: 'Portafolio'},
        { value: 'AA', label: 'Defensa de Artículos Científicos'},
        { value: 'EX', label: 'Exhimición'},  
    ]
    
    return (
        <form
            className='form-container manage-section'
            onSubmit={formik.handleSubmit}
            >
            { (isEdition && !prevValues?.selected_ece)?
                <>
                    <h2
                        className='form-subtitle'
                        >
                        No se pudo obtener la información de la solicitud
                    </h2>
                    <button 
                        className='accept-button'
                        onClick={closeFunc}
                        >
                        Aceptar
                    </button>
                </>
                :
                <>
                    { isEdition?
                        <>
                            <label 
                                className='form-label'
                                htmlFor='selected-ece'
                                >
                                Ejercicio seleccionado:
                            </label>

                            <input 
                                className='form-input'
                                type='text' 
                                id='selected-ece' 
                                value={exerciseOptions.find((exercise) => exercise.value === prevValues?.selected_ece).label}
                                readOnly
                                />

                            <label 
                                className='form-label'
                                htmlFor='state'
                                >
                                Qué veredicto desea tomar en cuanto a la solicitud?
                            </label>

                            <div 
                                className='form-radio-container'
                                id='state'
                                >
                                <label 
                                    className='form-radio-option'
                                    >
                                    <input
                                        className='form-input'
                                        type='radio'
                                        name='state'
                                        value='A'
                                        checked={formik.values.state === 'A'}
                                        onChange={(e) => formik.setFieldValue('state', e.target.value)}
                                        />
                                    Aprobar
                                </label>
                                
                                <label 
                                    className='form-radio-option'
                                    >
                                    <input
                                        className='form-input'
                                        type='radio'
                                        name='state'
                                        value='D'
                                        checked={formik.values.state === 'D'}
                                        onChange={(e) => formik.setFieldValue('state', e.target.value)}
                                        />
                                    Denegar
                                </label>
                            </div>
                            
                            <span
                                className={`error ${formik.errors.state && formik.touched.state && 'hidden' }`}
                                >
                                {formik.errors.state}
                            </span>
                        </>
                        :
                        <>
                            <label 
                                className='form-label'
                                htmlFor='ece-select'
                                >
                                Seleccione el ejercicio deseado:
                            </label>
                            
                            <SearchableSelect 
                                id='president'
                                title='Profesor a ocupar el cargo de presidente'
                                elements={exerciseOptions}
                                defaultValue={exerciseOptions.find(option => option.value === prevValues?.selected_ece)}
                                onChange={(value) => formik.setFieldValue('selectedECE', value)}
                                />
                            
                            <span
                                className={`error ${formik.errors.selectedECE && formik.touched.selectedECE && 'hidden' }`}
                                >
                                {formik.errors.selectedECE}
                            </span>
                        </>}

                    <FormButtons closeFunc={closeFunc} isValid={formik.isValid}/>
                </>}
        </form>
    )
}

RequestForm.propTypes = {
    isEdition: PropTypes.bool.isRequired,
    closeFunc: PropTypes.func.isRequired,
    prevValues: PropTypes.shape({
        id: PropTypes.string,
        student: PropTypes.string.isRequired,
        selected_ece: PropTypes.string,
        state: PropTypes.oneOf(['I', 'P', 'A', 'D'])
    }).isRequired,
}

export default RequestForm