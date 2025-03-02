import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

const useSideMenuOptions = () => {
    const location = useLocation()
    const currentPath = location.pathname
    const [ isVisible, setIsVisible ] = useState(false)

    useEffect(() => {
        if (currentPath === "/tree" || currentPath === "/form") {
            setIsVisible(true)
        } else {
            setIsVisible(false)
        }
    }, [currentPath])

    let options=['No hay opciones disponibles']

    switch (currentPath) {
        case "/tree":
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

const useHeaderOptions = () => {
    let options = []

    if (!options || options.length === 0)
        options[0] = {
            title: "No hay optiones",
            action: "#",
            icon: null,
        }

    return options
}

export { useSideMenuOptions, useHeaderOptions}