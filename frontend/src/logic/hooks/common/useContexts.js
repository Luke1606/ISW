import { useContext } from 'react'
import { ModalContext } from '../../'
import { LoadingContext } from '../../'

/**
 * Hooks personalizados que permiten consumir instancias de ModalContext y LoadingContext de manera sencilla.
 * Estos hooks evitan la necesidad de importar y usar manualmente useContext cada vez.
 */

/**
 * @returns {Object} Objeto que contiene `isOpen`, `openModal` y `closeModal` definidos en {@link ModalContext}, como verificar si un modal está abierto, abrirlo y cerrarlo, todas a partir de un `modalId`.
 * @example
 * const exampleModalId = 'example-modal'
 * const {isOpen, openModal, closeModal} = useModal()
 * 
 * return (
 *     <button 
 *         onClick={()=>openModal(exampleModalId)}
 *         >
 *         Abrir modal
 *     </button>
 * 
 *     <Modal isOpen={isOpen(exampleModalId)}>
 *         <button 
 *             onClick={()=>closeModal(exampleModalId)}
 *             >
 *             Cerrar modal
 *         </button>
 *     </Modal>
 * )
 */
export const useModal = () => useContext(ModalContext)

/**
 * @returns {Object} Objeto que contiene el estado `loading` y la función `setLoading` definidos en {@link LoadingContext}, para mostrar y/o ocultar el indicador de carga.
 * @example
 * const { setLoading } = useLoading()
 * setLoading(true)
 * actions()
 * setLoading(false)
 */
export const useLoading = () => useContext(LoadingContext)