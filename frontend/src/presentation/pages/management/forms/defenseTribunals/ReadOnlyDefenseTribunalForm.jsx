import PropTypes from 'prop-types'

const ReadOnlyDefenseTribunalForm = ({modalId, closeModal, values}) => {
    return (
        <section
            className='form-container manage-form'
            >
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

            <button
                className='accept-button'
                onClick={() => closeModal(modalId)}
                >
                Aceptar
            </button>
        </section>
    )
}

ReadOnlyDefenseTribunalForm.propTypes = {
    modalId: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    values: PropTypes.shape({
        date: PropTypes.instanceOf(Date).isRequired,
        president: PropTypes.string.isRequired,
        secretary: PropTypes.string.isRequired,
        vocal: PropTypes.string.isRequired,
        opponent: PropTypes.string.isRequired,
        tutors: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
}

export default ReadOnlyDefenseTribunalForm