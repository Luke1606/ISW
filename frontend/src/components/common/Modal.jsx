import PropTypes from 'prop-types'
import { AcceptButton, CancelButton } from './Buttons'

const ConfirmModal = ({action, isOpen, onClose, onConfirm}) => {
    if (!isOpen) return null

    return (
            <div>
                <div>
                    <h2>Confirmar {action}</h2>
                    <p>Está seguro de que desea continuar?</p>
                    <AcceptButton onClick={(onConfirm)}></AcceptButton>
                    <CancelButton onClick={onClose}></CancelButton>
                </div>
            </div>    
    )
}

ConfirmModal.propTypes = {
    action: PropTypes.string,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
}

const MessageModal = ({message, isOpen, onClose}) => {
    if (!isOpen) return null

    return (
            <div>
                <div>
                    <h2>Atención</h2>
                    <p>{message}</p>
                    <AcceptButton onClick={onClose}></AcceptButton>
                </div>
            </div>    
    )
}

MessageModal.propTypes = {
    message: PropTypes.string,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
}

export { ConfirmModal, MessageModal }