import { useState, useRef, useEffect } from "react"

/**
 * @description Hook para utilizar `drop popups`, osea `modals` que se cierran al hacer click fuera de la ventana (`popup`) o por algun otro detonador, ya sean `dropdown menus` o `tooltips`.
 * Utiliza {@link useRef} para detectar cuando se clickea fuera del `popup`
 * 
 * @param {function} `onClose`- Funcion a ejecutar cuando se cierra el popup (el usuario hace click fuera del `popup`), por defecto vacia.
 * 
 * @example
 * const {
 *     triggerRef,
 *     dropPopupRef,
 *     isVisible,
 *     toggleVisible
 * } = useDropPopup()
 * 
 * return(
 *     <button 
 *         onClick={toggleVisible}
 *         ref={triggerRef}
 *         >
 *         Cambiar visibilidad
 *     </button>
 * 
 *     <Modal 
 *         isOpen={isVisible}
 *         >
 *         <div ref={dropPopupRef}>
 *             <h1>Esto es un dropPopup</h1>
 *         </div>
 *     </Modal>
 * )
 * @returns {Object} Objeto con propiedades necesarias para el manejo de un `drop popup`. Contiene:
 * - {@link isVisible}- Estado de visibilidad del popup. El valor `true` indica visible y `false` indica no visible.
 * - {@link toggleVisible}
 * - {@link triggerRef}
 * - {@link dropPopupRef}
 */
const useDropPopup = (onClose = () => {}) => {
    const [isVisible, setVisible] = useState(false)
    
    /**
     * @description Función encargada de volver visible o invisible el popup.
     * @param {Event} `event`- Evento detonante de la función.
     */
    const toggleVisible = (event) => {
        event.stopPropagation()
        setVisible((prev) => !prev)
    }

    /**
     * @description Referencia para el contenedor del popup.
     */
    const dropPopupRef = useRef(null)
    /**
     * @description Referencia para el detonador (encargado de abrir o cerrar manualmente el popup).
     */
    const triggerRef = useRef(null)

    useEffect(() => {
        /**
         * @description Función que detecta cada click del usuario y verifica si fue en el elemento asociado a {@link triggerRef} o a {@link dropPopupRef}, si no es ninguno de los dos debe cerrar (desaparecer) el `popup`, mientras que si es en alguno de los anteriores no debe hacer nada. Al cerrarse ejecuta {@link onClose}. 
         * @param {EventHandler} `event`- Evento detonante de la función.
         */
        const handleClickOutside = (event) => {
            if (
                dropPopupRef.current &&
                triggerRef.current &&
                !dropPopupRef.current.contains(event.target) &&
                !triggerRef.current.contains(event.target)
            ) {
                setVisible(false)
                onClose()
            }
        }

        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isVisible, onClose])

    return {
        triggerRef,
        dropPopupRef,
        isVisible,
        toggleVisible,
    }
}

export default useDropPopup