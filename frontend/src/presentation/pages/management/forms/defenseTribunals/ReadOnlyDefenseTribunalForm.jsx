import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { ManagementService, NotificationService } from '@/logic'
import { datatypes } from '@/data'

/**
 * @description Ventana para mostrar detalles de un acta de defensa.
 * @param {function} `closeFunc- Función para cerrar el componente.
 * @param {Object} `values`- Contiene toda la información del tribunal.
 * @returns Estructura de los campos a mostrar con la información del tribunal contenido en `values`.
 */
const ReadOnlyDefenseTribunalForm = ({ closeFunc, values }) => {
    const [ professors, setProfessors ] = useState([])
    
    useEffect(() => {
        const fetchProfessors = async () => {
            let message = ''
            let success = false
            try {
                const response = await ManagementService.getAllData(datatypes.user.professor)

                if (response.success) {
                    const profs = Object.values(response?.data?.data)
                        .flat().map(
                            professor => {
                                console.log(professor);
                                if ([
                                    values?.president,
                                    values?.secretary, 
                                    values?.vocal, 
                                    values?.opponent].includes(professor.id) ||
                                    values?.tutors.includes(professor.id)
                                ) {
                                    return {
                                        value: professor.id,
                                        label: professor.name
                                    }
                                }
                            }
                        )
                    
                    success = true
                    if (profs) 
                        setProfessors(profs)
                } else {
                    message = response?.message
                }
            } catch (error) {
                message = error.message
            } finally {
                if (!success) {
                    const notification = {
                        title: 'Error',
                        message: message
                    }
                    NotificationService.showToast(notification, 'error')
                }
            }
        }

        fetchProfessors()
    }, [values])
    
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
        president: PropTypes.string.isRequired,
        secretary: PropTypes.string.isRequired,
        vocal: PropTypes.string.isRequired,
        opponent: PropTypes.string.isRequired,
        tutors: PropTypes.arrayOf(PropTypes.string).isRequired,
        state: PropTypes.oneOf(['A', 'D', 'P', 'I'])
    })
}

export default ReadOnlyDefenseTribunalForm