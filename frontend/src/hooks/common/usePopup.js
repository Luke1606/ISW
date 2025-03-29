import { useState, useRef, useEffect } from "react"

const useSimplePopup = () => {
    const [isVisible, setVisible] = useState(false)

    return {isVisible, setVisible}
}

const useDropPopup = (id, onClose = () => {}) => {
    const [isVisible, setVisible] = useState(false)
    
    const toggleVisible = (e) => {
        e.stopPropagation()
        if (id === openerRef.current?.dataset.popupId) {
            setVisible((prevState) => !prevState)
        }
    }

    const dropPopupRef = useRef(null)
    const openerRef = useRef(null)

    const handleClickOutside = (event) => {
        // Si se hace clic fuera del menú desplegable, se cierra
        if (
            dropPopupRef.current &&
            openerRef.current &&
            id === dropPopupRef.current?.dataset.popupId  &&
            id === openerRef.current?.dataset.popupId &&
            !dropPopupRef.current.contains(event.target) &&
            !openerRef.current.contains(event.target)
        ) {
            setVisible(false)
            onClose()
        }
    }

    useEffect(()=> {
        if (dropPopupRef.current) {
            dropPopupRef.current.dataset.popupId = id // Asocia el identificador único al contenedor del popup
        }
        if (openerRef.current) {
            openerRef.current.dataset.popupId = id // Asocia el identificador único al botón
        }
    }, [id])

    useEffect(() => {
        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isVisible])

    return {
        openerRef,
        dropPopupRef,
        isVisible,
        toggleVisible,
    }
}

export { useSimplePopup, useDropPopup }