import PropTypes from 'prop-types'
import { exerciseOptions } from '@/data'
import { useRequestForm } from '@/logic'
import { FormButtons, SearchableSelect } from '@/presentation'

/**
 * @description Ventana para agregar o editar un solicitud.
 * @param {bool} `isEdition`- Binario que expresa si es un formulario de edición o no.
 * @param {function} `closeFunc`- Función para cerrar el formulario.
 * @param {string} `studentId` - Id del estudiante al cual está asociada el acta de defensa.
 * @param {Object} `prevValues`- Contiene toda la información de la solicitud a mostrar.
 * @returns Estructura de los campos a mostrar con la información de la solicitud contenida en prevValues.
 */
const RequestForm = ({ isEdition, closeFunc, prevValues }) => {
    const { formik } = useRequestForm(isEdition, closeFunc, prevValues)
    
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
                            <p className='form-instructions'>
                                Tenga en cuenta que para seleccionar un veredicto debe haber revisado las evidencias del estudiante antes. 
                                Para ver las evidencias presione {'"Cancelar"'}, vuelva a seleccionar el estudiante y acceda a la sección {'"Listar evidencias"'}.
                            </p>

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
                                className={`error ${!(formik.errors.state && formik.touched.state) && 'hidden'}`}
                                >
                                {formik.errors.state}
                            </span>
                        </>
                        :
                        <>
                            <p className='form-instructions'>
                                Tenga en cuenta que para seleccionar un ejercicio de culminación de estudios 
                                debe haber almacenado las evidencias necesarias para solicitarlo, si desea
                                investigar más puede acceder al manual {'"Evidencias necesarias para cada ECE"'} en 
                                la sección manuales de la pantalla principal. 
                            </p>

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
                                className={`error ${!(formik.errors.selectedECE && formik.touched.selectedECE) && 'hidden'}`}
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