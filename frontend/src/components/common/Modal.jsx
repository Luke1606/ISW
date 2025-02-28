import PropTypes from 'prop-types'

const ConfirmModal = ({title, isOpen, onClose, onConfirm}) => {
    if (!isOpen) return null

    return (
            <div>
                <h2>{title}</h2>
                <p>Está seguro de que desea continuar?</p>
                <button className="accept-button" onClick={(onConfirm)}>Aceptar</button>
                <button className="cancel-button" onClick={onClose}>Cancelar</button>
            </div>    
    )
}

ConfirmModal.propTypes = {
    title: PropTypes.string,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
}

const MessageModal = ({title, message, isOpen, onClose}) => {
    if (!isOpen) return null

    return (
            <div>
                <div>
                    <h2>{title}</h2>
                    <p>{message}</p>
                    <button className="accept-button" onClick={onClose}>Aceptar</button>
                </div>
            </div>    
    )
}

MessageModal.propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
}

export { ConfirmModal, MessageModal }