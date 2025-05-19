import PropTypes from 'prop-types'

/**
 * @description Ventana para mostrar detalles de un acta de defensa.
 * @param {function} `closeFunc- Función para cerrar el componente.
 * @param {Object} `values`- Contiene toda la información del tribunal.
 * @returns Estructura de los campos a mostrar con la información del tribunal contenido en `values`.
 */
const ReadOnlyDefenseTribunalForm = ({ closeFunc, values }) => {
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
                                value={values.president}
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
                                value={values.secretary}
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
                                value={values.vocal}
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
                                value={values.opponent}
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
                                value={values.date instanceof Date ? values.date.toISOString().split('T')[0] : values.date}
                                readOnly
                                />

                            <label 
                                className='form-label'
                                >
                                Tutores:
                            </label>
                        
                            {values.tutors.map((tutor, index) => (
                                <input
                                    key={index}
                                    className='form-input'
                                    type='text'
                                    value={tutor}
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
        date: PropTypes.instanceOf(Date).isRequired,
        president: PropTypes.string.isRequired,
        secretary: PropTypes.string.isRequired,
        vocal: PropTypes.string.isRequired,
        opponent: PropTypes.string.isRequired,
        tutors: PropTypes.arrayOf(PropTypes.string).isRequired,
        state: PropTypes.oneOf(['A', 'D', 'P', 'I'])
    })
}

export default ReadOnlyDefenseTribunalForm