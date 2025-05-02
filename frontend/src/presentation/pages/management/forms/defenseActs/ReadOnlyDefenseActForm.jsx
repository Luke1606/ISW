import PropTypes from 'prop-types'
import { FilePreviewer } from '@/presentation/'

/**
 * @description Ventana para mostrar detalles de un acta de defensa.
 * @param {string} `modalId` - Id del modal en el que se renderiza este componente.
 * @param {function} `closeModal- Función para cerrar el modal en el que se renderiza este componente.
 * @param {Object} `values`- Contiene toda la información del acta de defensa a mostrar.
 * @returns Estructura de los campos a mostrar con la información del acta de defensa contenida en `values`.
 */
const ReadOnlyDefenseActForm = ({modalId, closeModal, values}) => {
    if (!values) return null
    
    return (
        <section
            className='form-container manage-form' 
            >
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
                htmlFor='descripcion'
                >
                Descripción:
            </label>
            
            <textarea
                className='form-input'
                id='descripcion'
                rows='4'
                value={values?.description || ''}
                readOnly
            />

            <label 
                className='form-label'
                htmlFor='attachment'
                >
                Documento adjunto:
            </label>
            
            <FilePreviewer 
                source={values.attachment}
                />

            <button
                className='accept-button'
                onClick={() => closeModal(modalId)}
            >
                Aceptar
            </button>
        </section>
    )
}

ReadOnlyDefenseActForm.propTypes = {
    modalId: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    values: PropTypes.shape({
        id: PropTypes.string.isRequired,
        student: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        attachment: PropTypes.instanceOf(File).isRequired,
    }),
}

export default ReadOnlyDefenseActForm