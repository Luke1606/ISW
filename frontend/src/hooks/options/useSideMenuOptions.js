import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import usePopup from "../common/usePopup"

const useSideMenuOptions = () => {
    const location = useLocation()
    const currentPath = location.pathname
    const { isVisible, setIsVisible } = usePopup()

    useEffect(() => {
        if (currentPath === "/tree" || currentPath === "/form") {
            setIsVisible(true)
        } else {
            setIsVisible(false)
        }
    }, [currentPath])

    let options=['No hay opciones disponibles']

    switch (currentPath) {
        case "/list":
            options = [
                "Filtrar",
                "Ordenar"
            ]
            break
        case "/form":
            options = [
                "General",
                "Apariencia",
                "Otra opción",
                "Otra opción"
            ]
            break
    }
    return { options, isVisible}
}

export default useSideMenuOptions

