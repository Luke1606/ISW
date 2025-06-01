import PropTypes from 'prop-types'
import { FilePreviewer } from '@/presentation'
import { useReadOnlyDefenseActForm } from '@/logic'


/**
 * @description Ventana para mostrar detalles de un acta de defensa.
 * @param {function} `closeFunc- Función para cerrar el componente.
 * @param {Object} `values`- Contiene toda la información del acta de defensa a mostrar.
 * @returns Estructura de los campos a mostrar con la información del acta de defensa contenida en `values`.
 */
const ReadOnlyDefenseActForm = ({ closeFunc, values }) => {
    const authorName = useReadOnlyDefenseActForm(values)

    if (!values) return null

    return (
        <section
            className='form-container' 
            >
            <h1 
                className='form-title'
                >
                Ver detalles de acta de defensa
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
                        Datos del acta
                    </h2>

                    <label 
                        className='form-label' 
                        htmlFor='author'
                        >
                        Autor del acta:
                    </label>
                    
                    <input
                        className='form-input'
                        id='author'
                        type='text'
                        value={authorName || ''}
                        readOnly
                        />

                    <label 
                        className='form-label' 
                        htmlFor='name'
                        >
                        Nombre del acta:
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
                
                    <label 
                        className='form-label'
                        htmlFor='attachment'
                        >
                        Documento adjunto:
                    </label>
                    
                    <FilePreviewer 
                        source={values.attachment}
                        />
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

ReadOnlyDefenseActForm.propTypes = {
    closeFunc: PropTypes.func.isRequired,
    values: PropTypes.shape({
        id: PropTypes.string.isRequired,
        student: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        attachment: PropTypes.instanceOf(File).isRequired,
    }).isRequired,
}

export default ReadOnlyDefenseActForm