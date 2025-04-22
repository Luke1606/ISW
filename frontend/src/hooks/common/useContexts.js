import { useContext } from "react"
import { ModalContext } from "../../contexts/ModalContext"
import { LoadingContext } from "../../contexts/LoadingContext"

export const useModal = () => useContext(ModalContext)

export const useLoading = () => useContext(LoadingContext)

