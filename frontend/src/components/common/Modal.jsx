import PropTypes from 'prop-types'
import { createPortal } from 'react-dom'

const Modal = ({ children, isOpen }) => {
    if (!isOpen) return null

    return createPortal(
        <div className='modal-overlay'>
            <div className='modal-container'>
                {children}
            </div>
        </div>, document.body)
}

Modal.propTypes = {
    children: PropTypes.node.isRequired,
    isOpen: PropTypes.bool.isRequired
}

export default Modal