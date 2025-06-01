import PropTypes from 'prop-types'
import { FilePreviewer } from '@/presentation'

const ReadOnlyEvidenceForm = ({ closeFunc, values }) => {
    if (!values) return null

    return (
        <section
            className='form-container' 
            >
            <h1 
                className='form-title'
                >
                Ver detalles de evidencia
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
                        Datos de la evidencia
                    </h2>

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
                </section>

                <section 
                    className='manage-section'
                    >
                    <h2 
                        className='form-subtitle'
                        >
                        Visualización del adjunto
                    </h2>

                    <label className='form-label'>
                        Adjunto:
                    </label>
            
                    {values.attachment_type === 'url'?
                        <a 
                            className='form-label'
                            href={values.attachment_url} 
                            target='_blank' 
                            rel='noopener noreferrer'>
                            {values.attachment_url}
                        </a>
                        :
                        <FilePreviewer 
                            source={values.attachment_file}
                            />}
                </section>
            </section>

            <button
                className='accept-button'
                onClick={closeFunc}
                >
                Aceptar
            </button>
        </section>
    )
}

ReadOnlyEvidenceForm.propTypes = {
    modalId: PropTypes.string.isRequired,
    closeFunc: PropTypes.func.isRequired,
    values: PropTypes.shape({
        id: PropTypes.string.isRequired,
        student: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        attachment_type: PropTypes.string.isRequired,
        attachment_url: PropTypes.string.isRequired,
        attachment_file: PropTypes.instanceOf(File).isRequired,
    }),
}

export default ReadOnlyEvidenceForm