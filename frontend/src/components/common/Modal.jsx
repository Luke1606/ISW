import PropTypes from 'prop-types'
import { createPortal } from 'react-dom'

const Modal = ({ title, children, isOpen }) => {
    if (!isOpen) return null
    const parentDiv = document.getElementById("modal")

    return createPortal(
        <div className='modal-overlay'>
            <div className='modal-container'>
                <h1 className='modal-title'>
                    {title}
                </h1>
                
                {children}
            </div>
        </div>, parentDiv)
}

Modal.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    isOpen: PropTypes.bool.isRequired
}

export default Modal