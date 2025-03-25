import PropTypes from 'prop-types'
import { createPortal } from 'react-dom'

const Modal = ({ children, isOpen, position = 'center' }) => {
    if (!isOpen) return null

    // Definición de estilos dinámicos según la posición
    const positionStyles = {
        center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
        top: { top: '10%', left: '50%', transform: 'translateX(-50%)' },
        bottom: { bottom: '10%', left: '50%', transform: 'translateX(-50%)' },
        left: { top: '50%', left: '10%', transform: 'translateY(-50%)' },
        right: { top: '50%', right: '10%', transform: 'translateY(-50%)' },
        'top-left': { top: '10%', left: '10%' },
        'top-right': { top: '10%', right: '10%' },
        'bottom-left': { bottom: '10%', left: '10%' },
        'bottom-right': { bottom: '10%', right: '10%' },
    }

    const style = positionStyles[position] || positionStyles.center

    return createPortal(
        <div className="modal-overlay">
            <div className="modal-container" style={style}>
                {children}
            </div>
        </div>,
        document.body
    )
}

Modal.propTypes = {
    children: PropTypes.node.isRequired,
    isOpen: PropTypes.bool.isRequired,
    position: PropTypes.oneOf([
        'center',
        'top',
        'bottom',
        'left',
        'right',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
    ]),
}

export default Modal
