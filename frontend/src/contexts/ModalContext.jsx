import PropTypes from "prop-types"
import { createContext, useState } from "react"

/**
 * @description Contexto diseñado para manejo centralizado de modals.
 */
const ModalContext = createContext()

/**
 * @description Provider diseñado para manejo del {@link ModalContext}
 * @param {React.ReactNode} children 
 * @returns Provider que permite a los componentes hijos acceder a {@link isOpen}, {@link openModal} y {@link closeModal} para verificar si un modal está abierto, abrirlo y cerrarlo, todas a partir de un `modalId`.
 */
const ModalProvider = ({ children }) => {
	const [modals, setModals] = useState({})

	const openModal = (id) => {
		setModals((prev) => ({
			...prev,
			[id]: true,
		}))
	}

	const closeModal = (id) => {
		setModals((prev) => {
			if (!prev[id])
				console.warn(`No existe un modal con el id ${id}`)
			else
				return { ...prev, [id]: false }
		})
	}

	const isOpen = (id) => !!(modals && modals[id])

	return (
		<ModalContext.Provider value={{ openModal, closeModal, isOpen }}>
		{children}
		</ModalContext.Provider>
	)
}

ModalProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export { ModalContext, ModalProvider}