import PropTypes from "prop-types"
import { createContext, useState } from "react"

const ModalContext = createContext()

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