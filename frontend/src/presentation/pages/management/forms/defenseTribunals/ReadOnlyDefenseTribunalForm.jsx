import PropTypes from 'prop-types'
import { exerciseOptions } from '@/data'
import { useReadOnlyDefenseActForm } from '@/logic'

/**
 * @description Ventana para mostrar detalles de un acta de defensa.
 * @param {function} `closeFunc- Función para cerrar el componente.
 * @param {Object} `values`- Contiene toda la información del tribunal.
 * @returns Estructura de los campos a mostrar con la información del tribunal contenido en `values`.
 */
const ReadOnlyDefenseTribunalForm = ({ closeFunc, values }) => {
    const professors = useReadOnlyDefenseActForm(values)

    return (
        <section
            className='form-container'
            >
            {!values || values?.state !== 'A'?
                <h2 
                    className='form-subtitle'
                    >
                    No hay datos disponibles sobre este tribunal
                </h2>
                :
                <>
                    <h1 
                        className='form-title'
                        >
                        Ver detalles de tribunal
                    </h1>

                    <section
                        className='multi-layered-form'
                        >   
                        <section 
                        className='manage-section'
                        >
                        <h2 
                            className='form-subtitle'
                            >
                            Miembros del tribunal
                        </h2>

                        <label 
                            className='form-label'
                            htmlFor='president'
                            >
                            Presidente del tribunal:
                        </label>

                        <input
                            className='form-input'
                            id='president'
                            type='text'
                            value={professors.find(option => option?.value === values?.president)?.label || ''}
                            readOnly
                            />

                        <label 
                            className='form-label'
                            htmlFor='secretary'
                            >
                            Secretario del tribunal:
                        </label>
                        <input
                            className='form-input'
                            id='secretary'
                            type='text'
                            value={professors.find(option => option?.value === values?.secretary)?.label || ''}
                            readOnly
                        />

                        <label 
                            className='form-label'
                            htmlFor='vocal'
                            >
                            Vocal del tribunal:
                        </label>

                        <input
                            className='form-input'
                            id='vocal'
                            type='text'
                            value={professors.find(option => option?.value === values?.vocal)?.label || ''}
                            readOnly
                            />

                        <label 
                            className='form-label'
                            htmlFor='opponent'
                            >
                            Oponente del tribunal:
                        </label>

                        <input
                            className='form-input'
                            id='opponent'
                            type='text'
                            value={professors.find(option => option?.value === values?.opponent)?.label || ''}
                            readOnly
                            />
                    </section>
                
                    <section 
                        className='manage-section'
                        >
                        <h2 
                            className='form-subtitle'
                            >
                            Otros datos
                        </h2>

                        <label 
                            className='form-label'
                            htmlFor='selected-ece'
                            >
                            ECE seleccionado:
                        </label>

                        <input
                            className='form-input'
                            id='selected-ece'
                            type='text'
                            value={exerciseOptions.find((exercise) => exercise.value === values?.selected_ece).label}
                            readOnly
                            />
                        
                        <label 
                            className='form-label'
                            htmlFor='defense-date'
                            >
                            Fecha de defensa:
                        </label>

                        <input
                            className='form-input'
                            id='defense-date'
                            type='date'
                            value={values?.defense_date instanceof Date?
                                values?.defense_date.toISOString().split('T')[0]
                                :
                                values?.defense_date}
                            readOnly
                            />

                        <label 
                            className='form-label'
                            >
                            {values?.tutors? 'Tutores:' : 'No tiene tutores'}
                        </label>
                    
                        {values?.tutors && values?.tutors.map((tutor, index) => (
                            <input
                                key={index}
                                className='form-input'
                                type='text'
                                value={professors.find(option => option?.value === tutor)?.label || ''}
                                readOnly
                                />
                        ))}
                        </section>
                    </section>
                </>}

            <button
                className='accept-button'
                onClick={closeFunc}
                >
                Aceptar
            </button>
        </section>
    )
}

ReadOnlyDefenseTribunalForm.propTypes = {
    modalId: PropTypes.string.isRequired,
    closeFunc: PropTypes.func.isRequired,
    values: PropTypes.shape({
        defense_date: PropTypes.instanceOf(Date).isRequired,
        selected_ece: PropTypes.string.isRequired,
        president: PropTypes.string.isRequired,
        secretary: PropTypes.string.isRequired,
        vocal: PropTypes.string.isRequired,
        opponent: PropTypes.string.isRequired,
        tutors: PropTypes.arrayOf(PropTypes.string).isRequired,
        state: PropTypes.oneOf(['A', 'D', 'P', 'I'])
    })
}

export default ReadOnlyDefenseTribunalForm