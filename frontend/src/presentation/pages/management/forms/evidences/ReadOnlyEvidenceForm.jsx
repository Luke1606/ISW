import PropTypes from 'prop-types'

const ReadOnlyEvidenceForm = ({modalId, closeModal, values}) => {
    if (!values) return null

    return (
        <section
        className='form-container manage-form' 
            >
            <label 
                className='form-label' 
                htmlFor='name'
                >
                Nombre de la evidencia:
            </label>
            
            <input
                className='form-input'
                id='name'
                type='text'
                value={values?.name || ''}
                readOnly
            />

            <label 
                className='form-label' 
                htmlFor='description'
                >
                Descripción:
            </label>
            
            <textarea
                className='form-input'
                id='description'
                rows='4'
                value={values?.description || ''}
                readOnly
            />

            <label className='form-label'>
                Adjunto:
            </label>
            
            <div className='current-attachment'>
                {values.attachment_type === 'url'?
                    <a href={values.attachment_url} target='_blank' rel='noopener noreferrer' />
                :
                    <img
                        src={URL.createObjectURL(values.attachment_file)}
                        alt='Vista previa'
                        title='Vista previa'
                        className='file-preview'
                        />}
            </div>

            <button
                className='accept-button'
                onClick={() => closeModal(modalId)}
                >
                Aceptar
            </button>
        </section>
    )
}

ReadOnlyEvidenceForm.propTypes = {
    modalId: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    values: PropTypes.shape({
        id: PropTypes.string.isRequired,
        student: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        attachment_type: PropTypes.string.isRequired,
        attachment_url: PropTypes.instanceOf(URL).isRequired,
        attachment_file: PropTypes.instanceOf(File).isRequired,
    }),
}

export default ReadOnlyEvidenceForm